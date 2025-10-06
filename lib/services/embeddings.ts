import { OpenAIEmbeddings } from "@langchain/openai"

function getEmbeddings() {
  return new OpenAIEmbeddings({
    modelName: "text-embedding-3-small",
    openAIApiKey: process.env.OPENAI_API_KEY,
  })
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const embeddings = getEmbeddings()
    const result = await embeddings.embedQuery(text)
    return result
  } catch (error) {
    console.error("Error generating embedding:", error)
    throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const embeddings = getEmbeddings()
    const results = await embeddings.embedDocuments(texts)
    return results
  } catch (error) {
    console.error("Error generating embeddings:", error)
    throw new Error(`Failed to generate embeddings: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function cosineSimilarity(a: number[], b: number[]): Promise<number> {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length")
  }

  let dotProduct = 0
  let magnitudeA = 0
  let magnitudeB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    magnitudeA += a[i] * a[i]
    magnitudeB += b[i] * b[i]
  }

  magnitudeA = Math.sqrt(magnitudeA)
  magnitudeB = Math.sqrt(magnitudeB)

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0
  }

  return dotProduct / (magnitudeA * magnitudeB)
}
