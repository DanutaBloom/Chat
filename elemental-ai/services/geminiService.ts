
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants';

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable is not set.");
  // In a real app, you might want to throw an error or handle this more gracefully
  // For this exercise, we'll let it proceed and fail at runtime if not set,
  // or rely on the environment to provide it.
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const sendMessageToGemini = async (prompt: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        // For low latency chat, disable thinking.
        // For higher quality, omit thinkingConfig or set budget higher.
        // This is a creative choice for an "Apple-like" AI.
        // Apple often prioritizes responsiveness and smooth UX.
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    
    // The .text property directly provides the string output.
    const text = response.text;
    if (typeof text !== 'string') {
        console.error("Unexpected response format from Gemini API:", response);
        return "Sorry, I received an unexpected response. Please try again.";
    }
    return text;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API_KEY_INVALID') || error.message.includes('API_KEY_MISSING')) {
             return "There seems to be an issue with the API configuration. Please check the API key.";
        }
        return `An error occurred: ${error.message}. Please try again.`;
    }
    return "An unknown error occurred while contacting the AI. Please try again.";
  }
};
