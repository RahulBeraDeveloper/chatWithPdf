import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  sessionId: mongoose.Types.ObjectId;
  sender: "user" | "assistant";
  message: string;
}

const MessageSchema: Schema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "ChatSession", required: true },
    sender: { type: String, enum: ["user", "assistant"], required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>("Message", MessageSchema);
