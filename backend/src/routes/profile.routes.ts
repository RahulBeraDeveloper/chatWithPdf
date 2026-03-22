import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { uploadImage } from "../middlewares/multer";
import { uploadProfilePicture, updatePassword } from "../controllers/profile.controller";

const router = Router();

router.post("/photo", authMiddleware, uploadImage.single("photo"), uploadProfilePicture);
router.put("/password", authMiddleware, updatePassword);

export default router;