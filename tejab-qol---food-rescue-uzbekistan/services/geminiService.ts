import { GoogleGenAI } from "@google/genai";
import { StoreCategory } from "../types";

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateBagHint = async (category: StoreCategory, storeName: string): Promise<string> => {
  try {
    const prompt = `
      You are an assistant for a food rescue app in Tashkent, Uzbekistan.
      A user is looking at a "Surprise Bag" from a place called "${storeName}" which is a "${category}".
      
      Generate a short, appetizing, 1-sentence hint about what *might* be inside based on typical Uzbek cuisine or standard bakery/grocery items.
      Do not promise specific items, use words like "Expect", "Likely contains", "Could feature".
      Keep it under 20 words.
      Example: "Likely contains fresh non bread, savory samsas, or sweet pastries."
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || "A delicious assortment of surplus food.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "A mystery bag containing delicious surplus food at a great price.";
  }
};

export const generateReviews = async (storeName: string): Promise<Array<{user: string, text: string, rating: number}>> => {
    try {
        const prompt = `
          Generate 2 short fake reviews for a food spot in Tashkent called "${storeName}". 
          The reviews should be positive about the food quality and value.
          Return ONLY valid JSON array format like: [{"user": "Aziz", "text": "Great plov!", "rating": 5}, ...]
        `;
    
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });
    
        const text = response.text;
        if (!text) return [];
        return JSON.parse(text);
      } catch (error) {
        return [
            { user: "Diyor", text: "Great value for money!", rating: 5 },
            { user: "Malika", text: "Saved delicious food.", rating: 4 }
        ];
      }
}