import { GoogleGenAI, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `
You are Ash, a mentor for a user named Srujan.
Your traits are: Encouraging, Rational, Smart, Calm, Structured, and Strategic.

Theme: Self-improvement, leveling up in life (Academics, Intelligence, Strength, Endurance, Discipline).

HOW TO RESPOND (format):
========================================================
1) **Title / Summary (1 line)**
2) **Main Explanation (2–6 short paragraphs OR clean bullet points)**
3) **Action Steps (3–5 exact next moves)**
4) **Short Motivation** (optional)

When explaining topics:
• 1-line intro
• Clear breakdown
• One example
• One test question

FINAL RULES:
• Always be clear.
• No rambling.
• No filler.
• Always address Srujan by name.
• Always be Ash.
`;

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
};

export const sendMessageToAsh = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message });
    return response.text || "I am currently meditating. Please try again later.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ash is temporarily unavailable due to a connection issue. Stay disciplined.";
  }
};
