import supabase from "../config/supabase";
import pdf from "pdf-parse";
import Tesseract from "tesseract.js";
import DocumentModel from "../models/document.model";
import embeddingService from "./embedding.service";
import vectorService from "./vector.service";
import mongoose from "mongoose";
import { AI_CONFIG } from "../config/ai.config";
const MIN_TEXT_LENGTH = AI_CONFIG.document.MIN_TEXT_LENGTH;
const CHUNK_SIZE = AI_CONFIG.document.CHUNK_SIZE;
const MAX_TEXT_LENGTH = AI_CONFIG.document.MAX_TEXT_LENGTH; // safety cap
const BATCH_SIZE = AI_CONFIG.embedding.BATCH_SIZE; // embed 5 at a time

export default {
  async processDocument(documentId: string) {
    try {
      const doc = await DocumentModel.findById(documentId);
      if (!doc) throw new Error("Document not found");

      // Download PDF
      const { data, error } = await supabase.storage
        .from("pdfs")
        .download(doc.storagePath);

      if (error || !data) {
        throw new Error("Failed to download PDF from storage");
      }

      const buffer = Buffer.from(await data.arrayBuffer());

      // Parse PDF
      let parsed;
      try {
        parsed = await pdf(buffer);
      } catch (err) {
        console.error("PDF parse error:", err);
        throw new Error("PDF parsing failed");
      }

      let text = parsed.text?.trim() || "";

      console.log("Extracted text length:", text.length);

      // OCR fallback
      if (text.length < MIN_TEXT_LENGTH) {
        console.log("Running OCR fallback...");

        try {
          const ocrResult = await Tesseract.recognize(buffer, "eng", {
            logger: m =>
              console.log(
                `OCR ${m.status}: ${Math.round(m.progress * 100)}%`
              ),
          });

          text = ocrResult.data.text.trim();
          console.log("OCR text length:", text.length);

        } catch (ocrError) {
          console.error("OCR failed:", ocrError);
        }
      }

      // Safety cap (protect memory)
      if (text.length > MAX_TEXT_LENGTH) {
        text = text.slice(0, MAX_TEXT_LENGTH);
      }

      if (!text || text.length < MIN_TEXT_LENGTH) {
        console.log("No usable text found");

        doc.processed = true;
        doc.textLength = 0;
        await doc.save();
        return;
      }

      // Chunking
      const rawChunks = text.match(
        new RegExp(`(.|[\\r\\n]){1,${CHUNK_SIZE}}`, "g")
      ) || [];

      const chunks = rawChunks
        .map(c => c.replace(/\s+/g, " ").trim())
        .filter(c => c.length > 30);

      console.log("Total chunks:", chunks.length);

      // Process in batches (IMPORTANT)
      for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batch = chunks.slice(i, i + BATCH_SIZE);

        const vectors = await Promise.all(
          batch.map(chunk => embeddingService.embedText(chunk))
        );

        for (let j = 0; j < batch.length; j++) {
          await vectorService.saveEmbedding(
            doc._id as mongoose.Types.ObjectId,
            i + j,
            batch[j],
            vectors[j]
          );
        }
      }

      doc.processed = true;
      doc.textLength = text.length;
      await doc.save();

      console.log("Document processed successfully");

    } catch (err) {
      console.error("processDocument error:", err);

      // Mark as processed to avoid infinite retry loop
      try {
        await DocumentModel.findByIdAndUpdate(documentId, {
          processed: true,
          textLength: 0,
        });
      } catch (updateErr) {
        console.error("Failed to mark document processed:", updateErr);
      }
    }
  },
};