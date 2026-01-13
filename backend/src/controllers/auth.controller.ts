import { Request, Response } from "express";
import admin from "../config/firebase";
import User from "../models/user.model";
import { generateJwt } from "../utils/generateJwt";

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "No Google token provided" });
    }

    // Verify Google ID Token using Firebase Admin
    const decoded = await admin.auth().verifyIdToken(idToken);

    const {uid, email, name, picture } = decoded;

    if (!email) {
      return res.status(400).json({ message: "Email not found in token" });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
          uid,
        email,
        name,
        photoUrl: picture,
        authProvider: "google",
      });
    }

    // Generate JWT
    const token = generateJwt(user._id.toString());

    return res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Google Login Failed", error: error.message });
  }
};
