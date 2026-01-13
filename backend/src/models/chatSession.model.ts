
import { Schema, model, Document, Types } from "mongoose";

export interface IChatSession extends Document {
  userId: Types.ObjectId;
  documentId: Types.ObjectId;
  title: string;
}

const chatSessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    documentId: { type: Schema.Types.ObjectId, ref: "Document", required: true },
    title: { type: String, default: "New Chat" },
  },
  { timestamps: true }
);

export default model<IChatSession>("ChatSession", chatSessionSchema);
