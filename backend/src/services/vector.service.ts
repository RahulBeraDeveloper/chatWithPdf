
import VectorModel from "../models/vector.model";
import mongoose from "mongoose";

export default {
  async saveEmbedding(
    documentId: mongoose.Types.ObjectId,
    chunkIndex: number,
    text: string,
    vector: number[]
  ) {
    await VectorModel.create({
      documentId,
      chunkIndex,
      text,
      vector,
    });
  },

  async searchEmbeddings(
    documentId: mongoose.Types.ObjectId,
    queryVector: number[],
    topK = 5
  ) {
    const docs = await VectorModel.find({ documentId })
      .select({ vector: 1, text: 1 })
      .limit(100)
      .lean();

    const cosine = (a: number[], b: number[]) =>
      a.reduce((s, v, i) => s + v * b[i], 0) /
      (Math.sqrt(a.reduce((s, v) => s + v * v, 0)) *
       Math.sqrt(b.reduce((s, v) => s + v * v, 0)));

    return docs
      .map(d => ({
        text: d.text,
        score: cosine(queryVector, d.vector),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  },
};
