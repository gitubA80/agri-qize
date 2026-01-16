import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuizSection } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
  const prompt = `
    Generate 16 unique questions for the "${section}" section.
    User context: ID ${userId}, Session ${sessionId}, Timestamp ${Date.now()}.
    Ensure no repeats from previous sessions.
    The difficulty must progressively increase from question 1 to 16.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
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

  try {
    const rawQuestions = JSON.parse(response.text || "[]");
    return rawQuestions.map((q: any, index: number) => ({
      ...q,
      id: `${sessionId}-${index}`
    }));
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("Could not generate questions. Please try again.");
  }
}