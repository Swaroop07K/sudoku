
import { GoogleGenAI, Type } from "@google/genai";
import { SudokuGrid, HintResponse } from "../types";

export const getGeminiHint = async (grid: SudokuGrid): Promise<HintResponse | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this Sudoku grid and find the single best next logical move. Provide the row, column, value, and a concise explanation of the logic (e.g., "Only remaining spot in the row").
    
    Grid State (null represents empty): ${JSON.stringify(grid)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          row: { type: Type.INTEGER, description: "Row index (0-8)" },
          col: { type: Type.INTEGER, description: "Column index (0-8)" },
          value: { type: Type.INTEGER, description: "Value to place (1-9)" },
          explanation: { type: Type.STRING, description: "Why this move is logical" }
        },
        required: ["row", "col", "value", "explanation"]
      }
    }
  });

  try {
    const result = JSON.parse(response.text || "{}");
    return result as HintResponse;
  } catch (error) {
    console.error("Failed to parse Gemini hint:", error);
    return null;
  }
};
