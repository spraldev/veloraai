import { prisma } from "@/lib/prisma"
import { transcribeAudio } from "./transcription"
import { chunkText, chunkTranscript } from "./chunking"
import { generateEmbeddings } from "./embeddings"
import { extractEvents } from "./event-extraction"
import { ChunkMetadata } from "./types"
import fs from "fs"

export async function ingestAudio(
  audioPath: string,
  userId: string,
  classId: string,
  title: string
): Promise<string> {
  try {
    console.log("Starting audio ingestion:", title)
    
    const { text, segments } = await transcribeAudio(audioPath)
    
    console.log("Transcription complete, creating material record")
    
    const material = await prisma.material.create({
      data: {
        classId,
        title,
        type: "audio",
        source: audioPath,
        content: text,
      },
    })
    
    console.log("Chunking transcript")
    
    const metadata: ChunkMetadata = {
      classId,
      materialId: material.id,
      source: title,
      type: "audio",
    }
    
    const chunks = segments.length > 0 
      ? chunkTranscript(segments, metadata, 40)
      : chunkText(text, metadata)
    
    console.log(`Generated ${chunks.length} chunks, creating embeddings`)
    
    const texts = chunks.map(c => c.text)
    const embeddings = await generateEmbeddings(texts)
    
    console.log("Storing embeddings in database")
    
    await prisma.$executeRaw`
      UPDATE "Material" 
      SET embedding = ${JSON.stringify(embeddings[0])}::vector 
      WHERE id = ${material.id}
    `
    
    console.log("Extracting events from transcript")
    
    await extractEvents(text, userId, classId, material.id)
    
    console.log("Audio ingestion complete")
    
    return material.id
  } catch (error) {
    console.error("Audio ingestion error:", error)
    throw new Error(`Failed to ingest audio: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function ingestText(
  text: string,
  userId: string,
  classId: string,
  title: string,
  type: "text" | "pdf" | "link" = "text"
): Promise<string> {
  try {
    const material = await prisma.material.create({
      data: {
        classId,
        title,
        type,
        source: `${type}:${title}`,
        content: text,
      },
    })
    
    const metadata: ChunkMetadata = {
      classId,
      materialId: material.id,
      source: title,
      type,
    }
    
    const chunks = chunkText(text, metadata)
    const texts = chunks.map(c => c.text)
    const embeddings = await generateEmbeddings(texts)
    
    await prisma.$executeRaw`
      UPDATE "Material" 
      SET embedding = ${JSON.stringify(embeddings[0])}::vector 
      WHERE id = ${material.id}
    `
    
    await extractEvents(text, userId, classId, material.id)
    
    return material.id
  } catch (error) {
    console.error("Text ingestion error:", error)
    throw new Error(`Failed to ingest text: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
