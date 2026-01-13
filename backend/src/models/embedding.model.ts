
import mongoose, { Document, Schema } from "mongoose";

export interface IEmbedding extends Document {
  documentId: mongoose.Types.ObjectId;
  chunkIndex: number;
  text: string;
  vector: number[]; // embedding vector
}

const EmbeddingSchema: Schema = new Schema(
  {
    documentId: { type: Schema.Types.ObjectId, ref: "Document", required: true },
    chunkIndex: { type: Number, required: true },
    text: { type: String, required: true },
    vector: { type: [Number], required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IEmbedding>("Embedding", EmbeddingSchema);
