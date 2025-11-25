import { GoogleGenAI, Type } from "@google/genai";
import { RoastResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateRealityCheck = async (age: number, hours: number): Promise<RoastResponse> => {
  if (!apiKey) {
    return {
      roast: "API Key missing. Just assume I'm judging you silently.",
      alternativeActivity: "Configuring your environment variables."
    };
  }

  const lostYears = ((hours * 365 * (80 - age)) / 24 / 365).toFixed(1);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `User is ${age} years old and spends ${hours} hours a day on their phone. 
      This equates to roughly ${lostYears} years of their remaining life staring at a rectangle.
      
      Task:
      1. Provide a witty, slightly dark, humorous "roast" of this behavior.
      2. Provide a specific, absurdly impressive skill or feat they could have accomplished in that time instead.
      
      Keep it cheeky but clean.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roast: { type: Type.STRING },
            alternativeActivity: { type: Type.STRING }
          },
          required: ["roast", "alternativeActivity"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as RoastResponse;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini roast failed:", error);
    return {
      roast: "You've spent so much time online even the AI is refusing to process your data.",
      alternativeActivity: "Touching grass immediately."
    };
  }
};

export const generateScheduleRoast = async (doomscrollHours: number): Promise<string> => {
  if (!apiKey) return "Looks like a lot of empty space.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `A user has planned their ideal day but left ${doomscrollHours.toFixed(1)} hours unallocated, which we are calling the "Doomscroll Window".
      
      Give a one-sentence, sarcastic warning about what will likely fill this void if they aren't careful.`,
    });
    return response.text || "The void stares back.";
  } catch (e) {
    return "The algorithm is hungrily eyeing your free time.";
  }
}
