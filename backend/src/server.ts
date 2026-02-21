import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import cors from "cors";

import morgan from "morgan";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import pdfRoutes from "./routes/pdf.routes";
import chatRoutes from "./routes/chat.routes";
import documentRoutes from "./routes/document.routes";
import { APP_CONFIG } from "./config/app.config";
const app: Application = express();




app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (APP_CONFIG.CORS_ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Connect DB
connectDB();

// Test route
app.get("/", (_req, res) => {
  res.json({ message: "ChatWithPdf TypeScript server running..." });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/document", documentRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
