import VectorModel from "../models/vector.model";
import mongoose from "mongoose";
import { AI_CONFIG } from "../config/ai.config";
const MAX_VECTOR_DOCS = AI_CONFIG.vector.MAX_VECTOR_DOCS; // safety cap

export default {
  async saveEmbedding(
    documentId: mongoose.Types.ObjectId,
    chunkIndex: number,
    text: string,
    vector: number[]
  ) {
    try {
      if (!mongoose.Types.ObjectId.isValid(documentId)) {
        throw new Error("Invalid documentId");
      }

      if (!Array.isArray(vector) || vector.length === 0) {
        throw new Error("Invalid vector");
      }

      await VectorModel.create({
        documentId,
        chunkIndex,
        text,
        vector,
      });

    } catch (err) {
      console.error("saveEmbedding error:", err);
      throw err;
    }
  },

  async searchEmbeddings(
    documentId: mongoose.Types.ObjectId,
    queryVector: number[],
    topK = 5
  ) {
    try {
      if (!mongoose.Types.ObjectId.isValid(documentId)) {
        throw new Error("Invalid documentId");
      }

      if (!Array.isArray(queryVector) || queryVector.length === 0) {
        throw new Error("Invalid query vector");
      }

      const docs = await VectorModel.find({ documentId })
        .select({ vector: 1, text: 1 })
        .limit(AI_CONFIG.vector.MAX_VECTOR_DOCS)
        .lean();

      if (!docs.length) return [];

      const cosine = (a: number[], b: number[]) => {
        if (!a || !b || a.length !== b.length) return 0;

        const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
        const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
        const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

        if (magA === 0 || magB === 0) return 0;

        return dot / (magA * magB);
      };

      return docs
        .map(d => ({
          text: d.text,
          score: cosine(queryVector, d.vector),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.max(1, topK));

    } catch (err) {
      console.error("searchEmbeddings error:", err);
      return [];
    }
  },
};