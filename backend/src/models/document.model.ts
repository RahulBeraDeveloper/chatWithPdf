
import mongoose, { Schema, Types, Document } from "mongoose";

export interface IDocument extends Document {
  userId: Types.ObjectId;
  originalName: string;
  storagePath: string;
  processed: boolean;
  textLength: number;
}

const DocumentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    originalName: { type: String, required: true },
    storagePath: { type: String, required: true },
    processed: { type: Boolean, default: false },
    textLength: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IDocument>("Document", DocumentSchema);
