
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import embeddingService from "./embedding.service";
import vectorService from "./vector.service";
import ChatSession from "../models/chatSession.model";
import ChatMessage from "../models/chatMessage.model";

export default {
  async askQuestion(sessionId: string, question: string) {
    const session = await ChatSession.findById(sessionId);
    if (!session) throw new Error("Session not found");

    const history = await ChatMessage.find({ sessionId })
      .sort({ createdAt: 1 })
      .limit(10)
      .lean();

    const queryVector = await embeddingService.embedText(question);

    const results = await vectorService.searchEmbeddings(
      session.documentId,
      queryVector,
      5
    );

    const context = results.map(r => r.text).join("\n\n");

    const historyText = history
      .map(m => `${m.role.toUpperCase()}: ${m.message}`)
      .join("\n");

    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY!,
      model: "gemini-2.5-flash",
      temperature: 0.2,
    });

    const prompt = `
Use the PDF context to answer.

CHAT HISTORY:
${historyText}

PDF CONTEXT:
${context}

QUESTION:
${question}

If answer is not in PDF say:
"I couldn't find that in the document."
`;

    const res = await model.invoke([{ role: "user", content: prompt }]);
    return res.content.toString();
  },
};
