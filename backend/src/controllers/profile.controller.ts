import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import User from "../models/user.model";
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

// ─── Upload Profile Picture ──────────────────────────────────────────────────
export const uploadProfilePicture = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const userId = req.user?.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Directly stream buffer to Cloudinary (frontend already compressed)
    const cloudinaryUrl: string = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "chatwithpdf/profiles",
          resource_type: "image",
          overwrite: true,
          public_id: `user_${userId}`,
          transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
        },
        (error: any, result: any) => {
          if (error || !result) return reject(error);
          resolve(result.secure_url);
        }
      );
      streamifier.createReadStream(req.file!.buffer).pipe(uploadStream);
    });

    user.photoUrl = cloudinaryUrl;
    await user.save();

    return res.json({ message: "Profile picture updated", photoUrl: cloudinaryUrl });
  } catch (error: any) {
    console.error("uploadProfilePicture error:", error);
    return res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// ─── Update Password (email users only) ──────────────────────────────────────
export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.authProvider !== "email") {
      return res.status(400).json({ message: "Password update is only for email accounts" });
    }

    if (user.passwordHash !== currentPassword) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.passwordHash = newPassword;
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (error: any) {
    console.error("updatePassword error:", error);
    return res.status(500).json({ message: "Password update failed", error: error.message });
  }
};