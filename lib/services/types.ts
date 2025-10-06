export interface ChunkMetadata {
  classId: string
  materialId: string
  source: string
  type: 'audio' | 'text' | 'pdf' | 'image' | 'link'
  startTime?: number
  endTime?: number
  page?: number
  speaker?: string
}

export interface TextChunk {
  text: string
  metadata: ChunkMetadata
  embedding?: number[]
}

export interface TranscriptSegment {
  text: string
  start: number
  end: number
  speaker?: string
}

export interface SearchResult {
  id: string
  content: string
  score: number
  metadata: ChunkMetadata
  type: 'material' | 'note'
}

export interface ExtractedEvent {
  type: 'quiz' | 'test' | 'exam' | 'assignment' | 'deadline'
  when: Date
  topic: string
  confidence: number
  sourceId: string
  context: string
}
