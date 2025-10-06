import { TextChunk, ChunkMetadata, TranscriptSegment } from "./types"

const DEFAULT_CHUNK_SIZE = 1000
const DEFAULT_OVERLAP = 150

export function chunkText(
  text: string,
  metadata: ChunkMetadata,
  chunkSize: number = DEFAULT_CHUNK_SIZE,
  overlap: number = DEFAULT_OVERLAP
): TextChunk[] {
  const chunks: TextChunk[] = []
  
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  
  let currentChunk = ""
  let currentLength = 0
  
  for (const sentence of sentences) {
    const sentenceLength = sentence.length
    
    if (currentLength + sentenceLength > chunkSize && currentChunk.length > 0) {
      chunks.push({
        text: currentChunk.trim(),
        metadata: { ...metadata },
      })
      
      const words = currentChunk.split(" ")
      const overlapWords = Math.floor(words.length * (overlap / chunkSize))
      currentChunk = words.slice(-overlapWords).join(" ") + " " + sentence
      currentLength = currentChunk.length
    } else {
      currentChunk += sentence
      currentLength += sentenceLength
    }
  }
  
  if (currentChunk.trim().length > 0) {
    chunks.push({
      text: currentChunk.trim(),
      metadata: { ...metadata },
    })
  }
  
  return chunks
}

export function chunkTranscript(
  segments: TranscriptSegment[],
  metadata: ChunkMetadata,
  chunkDuration: number = 40
): TextChunk[] {
  const chunks: TextChunk[] = []
  
  let currentChunk: TranscriptSegment[] = []
  let currentDuration = 0
  let chunkStartTime = 0
  
  for (const segment of segments) {
    const segmentDuration = segment.end - segment.start
    
    if (currentDuration + segmentDuration > chunkDuration && currentChunk.length > 0) {
      const chunkText = currentChunk.map(s => s.text).join(" ")
      const chunkEndTime = currentChunk[currentChunk.length - 1].end
      
      chunks.push({
        text: chunkText,
        metadata: {
          ...metadata,
          startTime: chunkStartTime,
          endTime: chunkEndTime,
        },
      })
      
      const overlapSegments = Math.min(2, currentChunk.length)
      currentChunk = currentChunk.slice(-overlapSegments)
      currentChunk.push(segment)
      chunkStartTime = currentChunk[0].start
      currentDuration = segment.end - chunkStartTime
    } else {
      if (currentChunk.length === 0) {
        chunkStartTime = segment.start
      }
      currentChunk.push(segment)
      currentDuration = segment.end - chunkStartTime
    }
  }
  
  if (currentChunk.length > 0) {
    const chunkText = currentChunk.map(s => s.text).join(" ")
    const chunkEndTime = currentChunk[currentChunk.length - 1].end
    
    chunks.push({
      text: chunkText,
      metadata: {
        ...metadata,
        startTime: chunkStartTime,
        endTime: chunkEndTime,
      },
    })
  }
  
  return chunks
}
