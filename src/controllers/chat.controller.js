/**
 * CoolKid AI Bot - chat.controller.js
 * Handles incoming chat requests for CoolKid AI
 */

import { getAIResponse, addToMemory } from "../services/ai.service.js";

/**
 * Handles POST /chat
 * Body: { message: "User input" }
 * Returns AI-generated response in JSON
 */
export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message || message.trim() === "") {
      console.warn("⚠️ Empty chat message received");
      return res.status(400).json({
        status: "error",
        message: "Message cannot be empty 😅",
      });
    }

    // Generate AI response
    const reply = await getAIResponse(message);

    // Add to conversation memory
    addToMemory(message, reply);

    // Log chat interaction
    console.log(`[${new Date().toLocaleString()}] Chat received: ${message}`);
    console.log(`[${new Date().toLocaleString()}] AI reply: ${reply}`);

    // Return response
    res.status(200).json({
      status: "success",
      userMessage: message,
      aiReply: reply,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("❌ Chat controller error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error. Please try again later 😔",
    });
  }
};

/**
 * Optional GET /chat/debug route
 * Can be used to inspect conversation memory (for debugging)
 */
export const debugChatMemory = (req, res) => {
  try {
    const memory = getConversationMemory();
    res.status(200).json({
      status: "success",
      memory,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("❌ Error fetching chat memory:", error);
    res.status(500).json({
      status: "error",
      message: "Cannot retrieve memory 😔",
    });
  }
};
