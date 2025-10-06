import OpenAI from "openai"
import fs from "fs"

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export async function transcribeAudio(
  audioPath: string
): Promise<{ text: string; segments: Array<{ text: string; start: number; end: number }> }> {
  try {
    const openai = getOpenAIClient()
    const audioFile = fs.createReadStream(audioPath)
    
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"],
    })

    const segments = (transcription as any).segments?.map((seg: any) => ({
      text: seg.text,
      start: seg.start,
      end: seg.end,
    })) || []

    return {
      text: transcription.text,
      segments,
    }
  } catch (error) {
    console.error("Transcription error:", error)
    throw new Error(`Failed to transcribe audio: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
