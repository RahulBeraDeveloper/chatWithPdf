
import { Request, Response } from "express";
import mongoose from "mongoose";
import DocumentModel from "../models/document.model";
import cloudinary from "../config/cloudinary";

/**
 * View PDF - returns the public Cloudinary URL directly
 */
export const viewPdf = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const userId = (req as any)?.user?.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ message: "Invalid documentId" });
    }

    const doc = await DocumentModel.findOne({ _id: documentId, userId }).lean();

    if (!doc) return res.status(404).json({ message: "Document not found" });

    if (!doc.storagePath) {
      return res.status(500).json({ message: "Invalid document storage path" });
    }

    // Use stored fileUrl if available
    let url: string = (doc as any).fileUrl;

    if (!url) {
      // Fallback: look up from Cloudinary API
      const resourceInfo = await cloudinary.api.resource(doc.storagePath, {
        resource_type: "raw",
      });
      url = resourceInfo.secure_url;
    }

    return res.json({ url });

  } catch (err) {
    console.error("viewPdf error:", err);
    return res.status(500).json({ message: "Failed to get PDF" });
  }
};

/**
 * Download PDF
 */
export const downloadPdf = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const userId = (req as any)?.user?.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ message: "Invalid documentId" });
    }

    const doc = await DocumentModel.findOne({ _id: documentId, userId }).lean();

    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Use stored fileUrl if available
    let downloadUrl: string = (doc as any).fileUrl;

    if (!downloadUrl) {
      const resourceInfo = await cloudinary.api.resource(doc.storagePath, {
        resource_type: "raw",
      });
      downloadUrl = resourceInfo.secure_url;
    }

    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error("Failed to fetch file from Cloudinary");

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeFileName = doc.originalName?.replace(/[^a-zA-Z0-9.\-_]/g, "_") || "document.pdf";

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${safeFileName}"`);

    return res.send(buffer);

  } catch (err) {
    console.error("downloadPdf error:", err);
    return res.status(500).json({ message: "Failed to download PDF" });
  }
};