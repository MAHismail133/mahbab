
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchQuestions = async (): Promise<Question[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "قم بإنشاء 5 أسئلة مسابقات إسلامية فريدة ومتنوعة (قرآن، سيرة، حديث، فقه). لكل سؤال 4 خيارات ورقم الإجابة الصحيحة (0-3).",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              correctAnswer: { type: Type.INTEGER }
            },
            required: ["id", "question", "options", "correctAnswer"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as Question[];
  } catch (error) {
    console.error("Error fetching questions:", error);
    // Fallback static questions in case of API failure
    return [
      {
        id: 1,
        question: "ما هو السورة التي تسمى عروس القرآن؟",
        options: ["سورة البقرة", "سورة الرحمن", "سورة يس", "سورة الواقعة"],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "كم عدد أجزاء القرآن الكريم؟",
        options: ["20 جزء", "25 جزء", "30 جزء", "40 جزء"],
        correctAnswer: 2
      }
    ];
  }
};
