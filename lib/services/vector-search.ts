import { prisma } from "@/lib/prisma"
import { generateEmbedding } from "./embeddings"
import { SearchResult } from "./types"

export async function vectorSearch(
  query: string,
  userId: string,
  classId?: string,
  limit: number = 5
): Promise<SearchResult[]> {
  try {
    const queryEmbedding = await generateEmbedding(query)
    
    const embeddingString = `[${queryEmbedding.join(",")}]`
    
    const whereClause = classId 
      ? `WHERE m."userId" = '${userId}' AND m."classId" = '${classId}'`
      : `WHERE m."userId" = '${userId}'`
    
    const results = await prisma.$queryRawUnsafe<Array<{
      id: string
      content: string
      classId: string
      source: string
      type: string
      similarity: number
    }>>(`
      SELECT 
        m.id,
        m.content,
        m."classId",
        m.title as source,
        m.type,
        1 - (m.embedding <=> $1::vector) as similarity
      FROM "Material" m
      ${whereClause}
      ORDER BY m.embedding <=> $1::vector
      LIMIT $2
    `, embeddingString, limit)

    return results.map(r => ({
      id: r.id,
      content: r.content || "",
      score: r.similarity,
      metadata: {
        classId: r.classId,
        materialId: r.id,
        source: r.source || "Unknown",
        type: r.type as any,
      },
      type: "material" as const,
    }))
  } catch (error) {
    console.error("Vector search error:", error)
    throw new Error(`Vector search failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function searchNotes(
  query: string,
  userId: string,
  classId?: string,
  limit: number = 5
): Promise<SearchResult[]> {
  try {
    const queryEmbedding = await generateEmbedding(query)
    const embeddingString = `[${queryEmbedding.join(",")}]`
    
    const whereClause = classId 
      ? `WHERE n."userId" = '${userId}' AND n."classId" = '${classId}'`
      : `WHERE n."userId" = '${userId}'`
    
    const results = await prisma.$queryRawUnsafe<Array<{
      id: string
      content: string
      classId: string
      title: string
      similarity: number
    }>>(`
      SELECT 
        n.id,
        n.content,
        n."classId",
        n.title,
        1 - (n.embedding <=> $1::vector) as similarity
      FROM "Note" n
      ${whereClause}
      ORDER BY n.embedding <=> $1::vector
      LIMIT $2
    `, embeddingString, limit)

    return results.map(r => ({
      id: r.id,
      content: r.content || "",
      score: r.similarity,
      metadata: {
        classId: r.classId,
        materialId: r.id,
        source: r.title || "Note",
        type: "text" as const,
      },
      type: "note" as const,
    }))
  } catch (error) {
    console.error("Note search error:", error)
    throw new Error(`Note search failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
