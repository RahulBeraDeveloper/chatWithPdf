import { Request, Response } from "express";
import DocumentModel from "../models/document.model";
import path from "path";
import pdfService from "../services/pdf.service";
import supabase from "../config/supabase";


  export const uploadPdf = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = `${userId}/${Date.now()}-${req.file.originalname}`;

    //  Upload to Supabase
    const { error } = await supabase.storage
      .from("pdfs")
      .upload(fileName, req.file.buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (error) throw error;

    // Save metadata in MongoDB
    const doc = await DocumentModel.create({
      userId,
      originalName: req.file.originalname,
      storagePath: fileName,
      processed: false,
      textLength: 0,
    }) as any;

    // async processing
    pdfService.processDocument(doc._id.toString()).catch(console.error);

    return res.status(201).json({
      message: "PDF uploaded",
      document: doc,
    });
  }
  catch (err: any) {
  console.error(" uploadPdf error FULL:", err);

  if (err?.error) {
    console.error(" Supabase error:", err.error);
  }

  return res.status(500).json({
    message: "Upload failed",
    error: err?.message || "Unknown error",
  });
}

};   
export const triggerProcess = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.body;
    if (!documentId) return res.status(400).json({ message: "documentId required" });

    pdfService.processDocument(documentId).then(() => {
      // asynchronous
    }).catch((err) => console.error(err));

    return res.json({ message: "Processing started" });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to trigger", error: error.message });
  }
};


