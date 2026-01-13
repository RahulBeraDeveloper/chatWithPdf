import express from "express";
import { viewPdf, downloadPdf } from "../controllers/document.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/:documentId/view", authMiddleware, viewPdf);
router.get("/:documentId/download", authMiddleware, downloadPdf);

export default router;
