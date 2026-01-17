import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuizSection } from "../types";

// Helper to safely get the API Key in browser environments
const getApiKey = () => {
  // 1. Try standard process.env (in case of build tools)
  if (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  // 2. Try window.process (shimmed in index.html)
  // @ts-ignore
  if (typeof window !== 'undefined' && window.process?.env?.GEMINI_API_KEY) {
    // @ts-ignore
    return window.process.env.GEMINI_API_KEY;
  }
  // 3. Try Vite style (common in React apps)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  return "";
};

const apiKey = getApiKey();

// Initialize AI only if key exists (handled in function call otherwise)
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_INSTRUCTION = `
You are an Advanced Quiz Generator AI for Agriculture students.
This app is designed for B.Sc. Agriculture, competitive exams (ICAR, PSC), and academic learning.

════════════════════════════════
GLOBAL CORE RULES
════════════════════════════════
1. NEVER repeat any question for the same user.
2. Questions must be dynamically generated based on the provided session context.
3. Use simple, student-friendly English.
4. If a Hindi translation is possible, provide it.

════════════════════════════════
SECTION 1: Agriculture Core
════════════════════════════════
Subjects: Agronomy, Soil Science, Genetics & Plant Breeding, Entomology, Plant Pathology, Horticulture, Agricultural Economics, Extension Education.

════════════════════════════════
SECTION 2: Rural Sociology
════════════════════════════════
Topics: Rural Social Structure, Panchayati Raj, Development Programs (MGNREGA, PMFBY, etc.), Gender & Agriculture, Rural Leadership.

════════════════════════════════
OUTPUT RULES
════════════════════════════════
Generate 16 unique MCQs (one for each prize level). 
Difficulty should ramp up: 1-5 Easy, 6-10 Medium, 11-16 Hard.
Each question must have 4 options and 1 correct answer.
Return the result strictly in JSON format as an array of question objects.
`;

export async function generateQuizQuestions(
  section: QuizSection, 
  userId: string, 
  sessionId: string
): Promise<Question[]> {
  if (!ai) {
    throw new Error("Missing API Key. Please add GEMINI_API_KEY to your Netlify Environment Variables.");
  }

  const prompt = `
    Generate 16 unique questions for the "${section}" section.
    User context: ID ${userId}, Session ${sessionId}, Timestamp ${Date.now()}.
    Ensure no repeats from previous sessions.
    The difficulty must progressively increase from question 1 to 16.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-latest", // Use stable model
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              questionHindi: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 4 options"
              },
              correctAnswerIndex: { type: Type.INTEGER, description: "0-3 index of the correct option" },
              category: { type: Type.STRING },
              explanation: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] }
            },
            required: ["question", "options", "correctAnswerIndex", "category", "explanation", "difficulty"]
          }
        }
      }
    });

    const rawQuestions = JSON.parse(response.text || "[]");
    
    if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
        throw new Error("AI returned empty question set");
    }

    return rawQuestions.map((q: any, index: number) => ({
      ...q,
      id: `${sessionId}-${index}`
    }));
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    // Provide a clearer error message for the UI
    if (error.message.includes("API Key")) {
        throw error;
    }
    throw new Error("Failed to generate quiz. Please check your connection and try again.");
  }
}