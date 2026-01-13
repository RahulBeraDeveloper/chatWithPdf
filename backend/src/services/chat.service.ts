// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import vectorService from "./vector.service";
// import ChatMessage from "../models/chatMessage.model";

// export default {
//   async askQuestion(sessionId: string, question: string) {
//     const results = await vectorService.searchEmbeddings(sessionId, question, 5);

//     const context = results.map(r => r.text).join("\n\n");

//     const model = new ChatGoogleGenerativeAI({
//       apiKey: process.env.GEMINI_API_KEY!,
//          model: "gemini-2.0-flash", // ✅ FIXED MODEL
//     });

//     const prompt = `
//       CONTEXT:
//       ${context}

//       QUESTION:
//       ${question}

//       RULES:
//       - Answer ONLY using the context.
//       - If answer is not in context, say "I couldn't find this in the document."
//     `;

//     const response = await model.invoke(prompt);

//     return response;
//   }
// };
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import vectorService from "./vector.service";
// import { embedText } from "./embedding.service";
// import ChatMessage from "../models/chatMessage.model";
// import ChatSession from "../models/chatSession.model";

// export default {
//   async askQuestion(sessionId: string, question: string): Promise<string> {
//     // 1️⃣ Load session
//     const session = await ChatSession.findById(sessionId);
//     if (!session) throw new Error("Chat session not found");

//     const documentId = session.documentId.toString();

//     // 2️⃣ Embed the question (🔥 REQUIRED)
//     const queryVector = await embedText(question);

//     // 3️⃣ Vector search
//     const results = await vectorService.searchEmbeddings(
//       documentId,
//       queryVector,
//       5
//     );

//     const context = results.map(r => r.text).join("\n\n");

//     // 4️⃣ Gemini chat model
//     const model = new ChatGoogleGenerativeAI({
//       apiKey: process.env.GEMINI_API_KEY!,
//       model: "gemini-1.0-pro", // ✅ stable & supported
//       temperature: 0.2,
//     });

//     const prompt = `
// CONTEXT:
// ${context}

// QUESTION:
// ${question}

// RULES:
// - Answer ONLY using the context.
// - If the answer is not in the context, say:
//   "I couldn't find this in the document."
// `;

//     const response = await model.invoke(prompt);

//     const answerText = response.content.toString();

//     // 5️⃣ Save assistant message
//     await ChatMessage.create({
//       sessionId,
//       role: "assistant",
//       message: answerText,
//     });

//     return answerText;
//   },
// };
