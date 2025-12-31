/**
 * CoolKid AI Bot - server.js
 * Main entry point for the AI bot
 * Author: You
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.routes.js";

dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "CoolKid AI Bot is online and ready! 🔥",
    timestamp: new Date(),
  });
});

// Chat route
app.use("/chat", chatRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "Route not found 🚫",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error 😔",
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`CoolKid AI Bot running on port ${PORT} ✅`)
);

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down CoolKid AI Bot... Goodbye!");
  process.exit();
});

process.on("SIGTERM", () => {
  console.log("Process terminated. Clean exit.");
  process.exit();
});
