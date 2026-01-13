import { Request, Response } from "express";
import DocumentModel from "../models/document.model";
import supabase from "../config/supabase";

export const viewPdf = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const doc = await DocumentModel.findOne({
      _id: documentId,
      userId,
    });

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    //  Create signed URL (valid for 10 minutes)
    const { data, error } = await supabase.storage
      .from("pdfs")
      .createSignedUrl(doc.storagePath, 600);

    if (error || !data?.signedUrl) {
      throw error;
    }

    return res.json({
      url: data.signedUrl,
    });
  } catch (err: any) {
    console.error(" viewPdf error:", err);
    return res.status(500).json({
      message: "Failed to get PDF",
      error: err.message,
    });
  }
};



export const downloadPdf = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const doc = await DocumentModel.findOne({
      _id: documentId,
      userId,
    });

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const { data, error } = await supabase.storage
      .from("pdfs")
      .download(doc.storagePath);

    if (error || !data) {
      throw error;
    }

    const buffer = Buffer.from(await data.arrayBuffer());

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${doc.originalName}"`
    );

    return res.send(buffer);
  } catch (err: any) {
    console.error(" downloadPdf error:", err);
    return res.status(500).json({
      message: "Failed to download PDF",
      error: err.message,
    });
  }
};