import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import embeddingService from "./embedding.service";
import vectorService from "./vector.service";
import ChatSession from "../models/chatSession.model";
import ChatMessage from "../models/chatMessage.model";
import { AI_CONFIG } from "../config/ai.config";
const MAX_HISTORY_MESSAGES = AI_CONFIG.rag.MAX_HISTORY_MESSAGES;
const MAX_CONTEXT_CHARS = AI_CONFIG.rag.MAX_CONTEXT_CHARS;
const MAX_QUESTION_LENGTH = AI_CONFIG.rag.MAX_QUESTION_LENGTH;
const MODEL_TIMEOUT = AI_CONFIG.rag.MODEL_TIMEOUT;

export default {
  async askQuestion(
    sessionId: string,
    question: string
  ): Promise<{ answer: string; followUp: string }> {
    try {
      if (!sessionId || !question?.trim()) {
        throw new Error("Invalid input");
      }

      question = question.trim().slice(0, MAX_QUESTION_LENGTH);

      const session = await ChatSession.findById(sessionId).lean();
      if (!session) {
        throw new Error("Session not found");
      }

      /* ------------------ Chat History ------------------ */
      const history = await ChatMessage.find({ sessionId })
        .sort({ createdAt: -1 })
        .limit(MAX_HISTORY_MESSAGES)
        .lean();

      const orderedHistory = history.reverse();

      /* ------------------ Embedding ------------------ */
      let queryVector: number[];

      try {
        queryVector = await embeddingService.embedText(question);
      } catch (err) {
        console.error("Embedding error:", err);
        throw new Error("Embedding service failed");
      }

      /* ------------------ Vector Search ------------------ */
      let context = "";

      try {
        const results = await vectorService.searchEmbeddings(
          session.documentId,
          queryVector,
          5
        );

        if (Array.isArray(results) && results.length > 0) {
          context = results
            .map((r: any) => r?.text || "")
            .filter(Boolean)
            .join("\n\n");
        }
      } catch (err) {
        console.error("Vector search error:", err);
      }

      context = context.slice(0, MAX_CONTEXT_CHARS);

      if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing GEMINI_API_KEY");
      }

      const model = new ChatGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY,
        model: "gemini-2.5-flash",
        temperature: 0.2,
      });

      /* ------------------ Build Messages ------------------ */
      const messages: any[] = [
        {
          role: "system",
          content: `
You are a PDF assistant.

Strict Rules:
- Answer ONLY using the provided PDF context.
- If answer is not in context say:
  "I couldn't find that in the document."
- Do NOT hallucinate.
- Do NOT use external knowledge.
- After answering, suggest ONE short relevant follow-up question based only on the PDF.
- If no answer is found, followUp must be an empty string.
- Respond strictly in JSON format:

{
  "answer": "string",
  "followUp": "string"
}
          `,
        },
      ];

      // Inject chat history properly
      orderedHistory.forEach((m: any) => {
        messages.push({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.message,
        });
      });

      // Add context + current question
      messages.push({
        role: "user",
        content: `
PDF CONTEXT:
${context || "No relevant context found."}

QUESTION:
${question}
        `,
      });

      /* ------------------ Model Call with Timeout ------------------ */
      const response = await Promise.race([
        model.invoke(messages),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Model timeout")), MODEL_TIMEOUT)
        ),
      ]);

      /* ------------------ Safe JSON Extraction ------------------ */
      let answer = "I couldn't find that in the document.";
      let followUp = "";

      try {
        const raw =
          typeof response.content === "string"
            ? response.content
            : Array.isArray(response.content)
            ? response.content.map((c: any) => c.text || "").join("")
            : "";

        const cleaned = raw.trim().replace(/```json|```/g, "");

        const parsed = JSON.parse(cleaned);

        answer = parsed.answer || answer;
        followUp = parsed.followUp || "";

      } catch (err) {
        console.error("Failed to parse model JSON:", err);
      }

      return {
        answer: answer.trim(),
        followUp: followUp.trim(),
      };

    } catch (err) {
      console.error("askQuestion service error:", err);

      return {
        answer: "Sorry, something went wrong while generating the answer.",
        followUp: "",
      };
    }
  },
};