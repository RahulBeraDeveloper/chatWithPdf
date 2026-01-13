
import supabase from "../config/supabase";
import pdf from "pdf-parse";
import Tesseract from "tesseract.js";
import DocumentModel from "../models/document.model";
import embeddingService from "./embedding.service";
import vectorService from "./vector.service";
import mongoose from "mongoose";

export default {
  async processDocument(documentId: string) {
    const doc = await DocumentModel.findById(documentId);
    if (!doc) throw new Error("Document not found");

    const { data, error } = await supabase.storage
      .from("pdfs")
      .download(doc.storagePath);

    if (error || !data) throw new Error("Failed to download PDF");

    const buffer = Buffer.from(await data.arrayBuffer());

    let parsed = await pdf(buffer);
    let text = parsed.text?.trim() || "";

    console.log("   Extracted text length:", text.length);

    // OCR FALLBACK
    if (text.length < 50) {
      console.log(" No text found. Running OCR...");

      const ocrResult = await Tesseract.recognize(buffer, "eng", {
        logger: m => console.log(`OCR ${m.status}: ${Math.round(m.progress * 100)}%`)
      });

      text = ocrResult.data.text.trim();
      console.log(" OCR text length:", text.length);
    }

    if (!text || text.length < 50) {
      console.log(" No usable text even after OCR");

      doc.processed = true;
      doc.textLength = 0;
      await doc.save();
      return;
    }

    // ✅ Chunk text
    const rawChunks = text.match(/(.|[\r\n]){1,500}/g) || [];
    const chunks = rawChunks
      .map(c => c.replace(/\s+/g, " ").trim())
      .filter(c => c.length > 30);

    console.log("🧩 Final chunks:", chunks.length);

    for (let i = 0; i < chunks.length; i++) {
      const vector = await embeddingService.embedText(chunks[i]);

      await vectorService.saveEmbedding(
        doc._id as mongoose.Types.ObjectId,
        i,
        chunks[i],
        vector
      );
    }

    doc.processed = true;
    doc.textLength = text.length;
    await doc.save();

    console.log("🎉 Document processed with OCR");
  },
};
