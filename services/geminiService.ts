import { GoogleGenAI, Modality } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { pcmToWav, base64ToUint8Array } from "./audioUtils";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });

export const generateDevotionalText = async (book: string, chapter: number, verse: number): Promise<string> => {
  try {
    const userPrompt = `Versículo: ${book} ${chapter}:${verse} (Reina Valera 1960)`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7, // Slightly creative but focused
        maxOutputTokens: 5000, 
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text generated");
    return text.trim();
  } catch (error) {
    console.error("Error generating text:", error);
    throw new Error("El Sello no pudo ser revelado. Intenta nuevamente.");
  }
};

export const generateDevotionalAudio = async (text: string): Promise<Blob> => {
  try {
    // Generate speech using the preview TTS model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              // 'Kore' tends to have a good soothing tone, but default is often fine. 
              // Using 'Fenrir' for a deeper, more "Atalaya" (Watchman) voice.
              prebuiltVoiceConfig: { voiceName: 'Fenrir' }, 
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error("No audio data received from the Seal.");
    }

    // Convert Base64 raw PCM to WAV Blob
    const pcmBytes = base64ToUint8Array(base64Audio);
    const wavBlob = pcmToWav(pcmBytes, 24000); // Gemini usually outputs 24kHz

    return wavBlob;
  } catch (error) {
    console.error("Error generating audio:", error);
    throw new Error("La voz del Sello no pudo ser manifestada.");
  }
};