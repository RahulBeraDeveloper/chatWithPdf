import { Router } from "express";
import {
  createChatSession,
  askQuestion,
  getUserSessions,
  getSessionMessages,
  deleteDocument,
} from "../controllers/chat.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/session", authMiddleware, createChatSession); // create new chat session
router.post("/ask", authMiddleware, askQuestion);           // send question
router.get("/sessions", authMiddleware, getUserSessions);   // fetch all sessions for user (left sidebar)
router.get("/messages/:sessionId", authMiddleware, getSessionMessages); // fetch messages for session
router.delete("/session/:documentId", authMiddleware, deleteDocument);


export default router;
      