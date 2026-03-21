import { Request, Response } from "express";
import DocumentModel from "../models/document.model";
import pdfService from "../services/pdf.service";
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

export const uploadPdf = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: `pdfs/${userId}`,
          public_id: `${Date.now()}-${req.file!.originalname}`,
          overwrite: false,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(req.file!.buffer).pipe(uploadStream);
    });

    console.log("Uploaded to Cloudinary:", uploadResult.secure_url);

    // Save metadata in MongoDB
    const doc = await DocumentModel.create({
      userId,
      originalName: req.file.originalname,
      storagePath: uploadResult.public_id,
      fileUrl: uploadResult.secure_url,
      processed: false,
      textLength: 0,
    }) as any;

    // Process directly from buffer — no re-download needed
    pdfService.processDocumentFromBuffer(doc._id.toString(), req.file.buffer).catch(console.error);

    return res.status(201).json({ message: "PDF uploaded", document: doc });

  } catch (err: any) {
    console.error("uploadPdf error FULL:", err);
    return res.status(500).json({ message: "Upload failed", error: err?.message || "Unknown error" });
  }
};

// No-op: processing already happens in uploadPdf above
// Kept so frontend doesn't break
export const triggerProcess = async (req: Request, res: Response) => {
  return res.json({ message: "Processing started" });
};