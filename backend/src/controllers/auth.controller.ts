import { Request, Response } from "express";
import admin from "../config/firebase";
import User from "../models/user.model";
import OtpModel from "../models/otp.model";
import { generateJwt } from "../utils/generateJwt";
import { sendOtpEmail } from "../utils/mailer";

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ─── STEP 1: Send OTP ────────────────────────────────────────────────────────
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already registered. Please login." });
    }

    await OtpModel.deleteMany({ email: email.toLowerCase() });
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await OtpModel.create({ email: email.toLowerCase(), otp, expiresAt });
    await sendOtpEmail(email, otp);

    return res.json({ message: "OTP sent to your email" });
  } catch (error: any) {
    console.error("sendOtp error:", error);
    return res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

// ─── STEP 2: Verify OTP ──────────────────────────────────────────────────────
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const record = await OtpModel.findOne({ email: email.toLowerCase() });
    if (!record) return res.status(400).json({ message: "OTP not found or expired" });
    if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (new Date() > record.expiresAt) {
      await OtpModel.deleteOne({ _id: record._id });
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    await OtpModel.deleteOne({ _id: record._id });
    return res.json({ message: "OTP verified successfully" });
  } catch (error: any) {
    console.error("verifyOtp error:", error);
    return res.status(500).json({ message: "OTP verification failed", error: error.message });
  }
};

// ─── STEP 3: Register ────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({
      uid: `email_${email.toLowerCase()}`,
      name,
      email: email.toLowerCase(),
      authProvider: "email",
      passwordHash: password,
      isEmailVerified: true,
    });

    const token = generateJwt(user._id.toString());
    return res.status(201).json({ message: "Registration successful", token, user });
  } catch (error: any) {
    console.error("register error:", error);
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// ─── Email Login ─────────────────────────────────────────────────────────────
export const emailLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found. Please register first." });
    if (user.authProvider !== "email") {
      return res.status(400).json({ message: "This account uses Google Sign-In. Please login with Google." });
    }
    if (user.passwordHash !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = generateJwt(user._id.toString());
    return res.json({ message: "Login successful", token, user });
  } catch (error: any) {
    console.error("emailLogin error:", error);
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// ─── Google Login ─────────────────────────────────────────────────────────────
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: "No Google token provided" });

    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decoded;
    if (!email) return res.status(400).json({ message: "Email not found in token" });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        uid, email, name, photoUrl: picture,
        authProvider: "google", isEmailVerified: true,
      });
    } else if (user.authProvider === "email") {
      user.authProvider = "google";
      user.uid = uid;
      user.photoUrl = picture;
      await user.save();
    }

    const token = generateJwt(user._id.toString());
    return res.json({ message: "Login successful", token, user });
  } catch (error: any) {
    console.error("googleLogin error:", error);
    return res.status(500).json({ message: "Google Login Failed", error: error.message });
  }
};

// ─── Forgot Password: Send OTP ───────────────────────────────────────────────
export const forgotPasswordSendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "No account found with this email" });
    if (user.authProvider !== "email") {
      return res.status(400).json({ message: "This account uses Google Sign-In. No password to reset." });
    }

    await OtpModel.deleteMany({ email: email.toLowerCase() });
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await OtpModel.create({ email: email.toLowerCase(), otp, expiresAt });
    await sendOtpEmail(email, otp);

    return res.json({ message: "OTP sent to your email" });
  } catch (error: any) {
    console.error("forgotPasswordSendOtp error:", error);
    return res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

// ─── Forgot Password: Verify OTP + Set New Password ─────────────────────────
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const record = await OtpModel.findOne({ email: email.toLowerCase() });
    if (!record) return res.status(400).json({ message: "OTP not found or expired" });
    if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (new Date() > record.expiresAt) {
      await OtpModel.deleteOne({ _id: record._id });
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    await OtpModel.deleteOne({ _id: record._id });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.passwordHash = newPassword;
    await user.save();

    return res.json({ message: "Password reset successfully. Please login." });
  } catch (error: any) {
    console.error("resetPassword error:", error);
    return res.status(500).json({ message: "Password reset failed", error: error.message });
  }
};