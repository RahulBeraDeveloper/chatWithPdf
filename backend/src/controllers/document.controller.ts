import { Request, Response } from "express";
import mongoose from "mongoose";
import DocumentModel from "../models/document.model";
import supabase from "../config/supabase";

/**
 * View PDF (Signed URL - 10 minutes)
 */
export const viewPdf = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const userId = (req as any)?.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ message: "Invalid documentId" });
    }

    const doc = await DocumentModel.findOne({
      _id: documentId,
      userId,
    }).lean();

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (!doc.storagePath) {
      return res.status(500).json({ message: "Invalid document storage path" });
    }

    const { data, error } = await supabase.storage
      .from("pdfs")
      .createSignedUrl(doc.storagePath, 600); // 10 minutes

    if (error || !data?.signedUrl) {
      console.error("Supabase signed URL error:", error);
      return res.status(500).json({
        message: "Failed to generate PDF link",
      });
    }

    return res.json({
      url: data.signedUrl,
    });

  } catch (err) {
    console.error("viewPdf error:", err);
    return res.status(500).json({
      message: "Failed to get PDF",
    });
  }
};


/**
 * Download PDF (Streams file)
 */
export const downloadPdf = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const userId = (req as any)?.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ message: "Invalid documentId" });
    }

    const doc = await DocumentModel.findOne({
      _id: documentId,
      userId,
    }).lean();

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (!doc.storagePath) {
      return res.status(500).json({ message: "Invalid document storage path" });
    }

    const { data, error } = await supabase.storage
      .from("pdfs")
      .download(doc.storagePath);

    if (error || !data) {
      console.error("Supabase download error:", error);
      return res.status(500).json({
        message: "Failed to download file",
      });
    }

    const buffer = Buffer.from(await data.arrayBuffer());

    // Sanitize filename
    const safeFileName = doc.originalName
      ?.replace(/[^a-zA-Z0-9.\-_]/g, "_") || "document.pdf";

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeFileName}"`
    );

    return res.send(buffer);

  } catch (err) {
    console.error("downloadPdf error:", err);
    return res.status(500).json({
      message: "Failed to download PDF",
    });
  }
};