import mongoose, { Document, Schema } from "mongoose";

export interface IOtp extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}

const OtpSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// Auto-delete expired OTPs via MongoDB TTL index
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IOtp>("Otp", OtpSchema);