import { Router } from "express";
import { upload } from "../middlewares/multer";
import path from "path";
import { uploadPdf, triggerProcess } from "../controllers/pdf.controller";
import { authMiddleware } from "../middlewares/authMiddleware"; // your existing middleware

const router = Router();





router.post("/upload", authMiddleware, upload.single("file"), uploadPdf);
router.post("/process", authMiddleware, triggerProcess);

export default router;
