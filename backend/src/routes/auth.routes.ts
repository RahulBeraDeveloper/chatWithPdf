import { Router } from "express";
import {
  googleLogin,
  sendOtp,
  verifyOtp,
  register,
  emailLogin,
  forgotPasswordSendOtp,
  resetPassword,
} from "../controllers/auth.controller";

const router = Router();

// Google OAuth
router.post("/google", googleLogin);

// Email registration flow
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", register);

// Email login
router.post("/login", emailLogin);

// Forgot password flow
router.post("/forgot-password/send-otp", forgotPasswordSendOtp);
router.post("/forgot-password/reset", resetPassword);

export default router;