import { prisma } from "@/lib/prisma"
import { vectorSearch, searchNotes } from "./vector-search"
import { SearchResult } from "./types"

function calculateRecencyScore(createdAt: Date): number {
  const hoursSince = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60)
  const decayRate = 0.01
  return Math.exp(-decayRate * hoursSince)
}

function reciprocalRankFusion(
  results: SearchResult[][],
  k: number = 60
): SearchResult[] {
  const scoreMap = new Map<string, { result: SearchResult; score: number }>()
  
  results.forEach((resultSet, setIndex) => {
    resultSet.forEach((result, rank) => {
      const rrf = 1 / (k + rank + 1)
      const existing = scoreMap.get(result.id)
      
      if (existing) {
        existing.score += rrf
      } else {
        scoreMap.set(result.id, { result, score: rrf })
      }
    })
  })
  
  return Array.from(scoreMap.values())
    .sort((a, b) => b.score - a.score)
    .map(item => ({
      ...item.result,
      score: item.score,
    }))
}

export async function hybridSearch(
  query: string,
  userId: string,
  classId?: string,
  limit: number = 5
): Promise<SearchResult[]> {
  try {
    const [vectorResults, noteResults] = await Promise.all([
      vectorSearch(query, userId, classId, limit * 2),
      searchNotes(query, userId, classId, limit * 2),
    ])

    const keywordResults = await keywordSearch(query, userId, classId, limit * 2)
    
    const fusedResults = reciprocalRankFusion([
      vectorResults,
      noteResults,
      keywordResults,
    ])
    
    const materials = await prisma.material.findMany({
      where: {
        id: { in: fusedResults.map(r => r.id) },
      },
      select: { id: true, createdAt: true },
    })
    
    const materialMap = new Map(materials.map(m => [m.id, m]))
    
    const rankedResults = fusedResults.map(result => {
      const material = materialMap.get(result.id)
      const recencyBoost = material ? calculateRecencyScore(material.createdAt) : 0
      
      return {
        ...result,
        score: result.score + (recencyBoost * 0.2),
      }
    })
    
    return rankedResults
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  } catch (error) {
    console.error("Hybrid search error:", error)
    return []
  }
}

async function keywordSearch(
  query: string,
  userId: string,
  classId?: string,
  limit: number = 10
): Promise<SearchResult[]> {
  try {
    const whereClause: any = {
      userId,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ],
    }
    
    if (classId) {
      whereClause.classId = classId
    }
    
    const materials = await prisma.material.findMany({
      where: whereClause,
      take: limit,
      orderBy: { createdAt: "desc" },
    })
    
    return materials.map(m => ({
      id: m.id,
      content: m.content || m.title,
      score: 0.5,
      metadata: {
        classId: m.classId,
        materialId: m.id,
        source: m.title,
        type: m.type as any,
      },
      type: "material" as const,
    }))
  } catch (error) {
    console.error("Keyword search error:", error)
    return []
  }
}
