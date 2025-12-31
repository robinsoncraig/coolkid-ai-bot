/**
 * CoolKid AI Bot - chat.routes.js
 * Defines chat API endpoints for CoolKid AI
 */

import express from "express";
import { handleChat, debugChatMemory } from "../controllers/chat.controller.js";

const router = express.Router();

/**
 * POST /chat
 * Receives user message and returns AI response
 * Body: { message: "User input" }
 */
router.post("/", handleChat);

/**
 * GET /chat/test
 * Simple test endpoint to verify chat route
 */
router.get("/test", (req, res) => {
  res.json({
    status: "success",
    message: "Chat route is working ✅",
    timestamp: new Date(),
  });
});

/**
 * GET /chat/debug
 * Optional route to inspect conversation memory
 */
router.get("/debug", debugChatMemory);

export default router;
