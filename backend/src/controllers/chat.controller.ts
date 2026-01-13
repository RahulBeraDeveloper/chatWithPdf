
import { Request, Response } from "express";
import ChatSession from "../models/chatSession.model";
import ChatMessage from "../models/chatMessage.model";
import ragService from "../services/rag.service";
import mongoose from "mongoose";
import DocumentModel from "../models/document.model";
import Vector from "../models/vector.model";
import supabase from "../config/supabase";
// Create a new chat session for a PDF
export const createChatSession = async (req: Request, res: Response) => {
  try {
    const { documentId, title } = req.body;
    const userId = (req as any).user.userId; // ensure auth middleware sets req.user

    const session = await ChatSession.create({
      userId,
      documentId,
      title: title || "Chat Session",
    });

    res.status(201).json({ session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create chat session" });
  }
};

// Ask a question in a session and save Q&A
export const askQuestion = async (req: Request, res: Response) => {
  try {
    const { sessionId, question } = req.body;

    // Save user question
    await ChatMessage.create({
      sessionId,
      role: "user",
      message: question,
    });

    // Get AI answer using RAG service
    const answer = await ragService.askQuestion(sessionId, question);

    // Save assistant answer
await ChatMessage.create(<any>{
  sessionId,
  role: "assistant",
  message: answer,
});

    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to answer question" });
  }
};

// Get all chat sessions for a user (to display in left sidebar)


export const getUserSessions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    // Read query params with defaults
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const pageSize = Math.min(
      Math.max(parseInt(req.query.pageSize as string) || 20, 1),
      100 // safety cap
    );

    const skip = (page - 1) * pageSize;

    //Parallel queries (fast)
    const [sessions, total] = await Promise.all([
      ChatSession.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      ChatSession.countDocuments({ userId }),
    ]);

    return res.json({
      sessions,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNextPage: page * pageSize < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.error("getUserSessions error:", err);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
};


// Get messages for a specific chat session
export const getSessionMessages = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const messages = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 });
    res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};


export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const userId = (req as any).user.userId;

    //  Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ message: "Invalid documentId" });
    }

    // Find document (ownership check)
    const document = await DocumentModel.findOne({
      _id: documentId,
      userId,
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    //  1. Find all chat sessions for this document
    const sessions = await ChatSession.find({ documentId });

    const sessionIds = sessions.map(s => s._id);

    //  2. Delete all chat messages
    if (sessionIds.length > 0) {
      await ChatMessage.deleteMany({
        sessionId: { $in: sessionIds },
      });
    }

    //  3. Delete chat sessions
    await ChatSession.deleteMany({ documentId });

    //  4. Delete vector embeddings
    await Vector.deleteMany({ documentId });

    //  5. Delete PDF from Supabase
    await supabase.storage
      .from("pdfs")
      .remove([document.storagePath]);

    //  6. Delete document metadata
    await DocumentModel.deleteOne({ _id: documentId });

    return res.json({
      message: "Document and all related data deleted successfully",
    });
  } catch (err: any) {
    console.error(" deleteDocument error:", err);
    return res.status(500).json({
      message: "Failed to delete document",
      error: err.message,
    });
  }
};