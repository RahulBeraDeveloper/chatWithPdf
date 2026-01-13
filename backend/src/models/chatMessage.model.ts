
import { Schema, model, Document, Types } from "mongoose";

export interface IChatMessage extends Document {
  sessionId: Types.ObjectId;
  role: "user" | "assistant";
  message: string;
}

const chatMessageSchema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "ChatSession", required: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<IChatMessage>("ChatMessage", chatMessageSchema);
