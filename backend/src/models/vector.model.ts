
import mongoose from "mongoose";

const vectorSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    required: true,
    index: true,
  },
  chunkIndex: Number,
  text: String,
  vector: {
    type: [Number],
    required: true,
  },
});

export default mongoose.model("Vector", vectorSchema);
