/**
 * CoolKid AI Bot - ai.service.js
 * Handles OpenAI API communication for Instagram AI bot
 */

import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Initialize OpenAI client with API key from .env
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates AI response for a given user message
 * Uses Instagram-style friendly tone with English + light Sheng + emojis
 * @param {string} message - User input
 * @returns {string} AI response
 */
export const getAIResponse = async (message) => {
  if (!message || message.trim() === "") {
    console.warn("⚠️ Empty user message received");
    return "Please provide a message 😅";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an Instagram-style AI assistant. Respond in a friendly, short tone. Use English mixed with light Sheng and add emojis where appropriate. Help users with captions, ideas, questions, and fun responses.",
        },
        { role: "user", content: message },
      ],
      temperature: 0.7, // creative responses
      max_tokens: 150, // keep messages short for Instagram DMs
    });

    const reply = response.choices[0].message.content;

    // Log user message and AI response with timestamp
    console.log(`[${new Date().toLocaleString()}] User:`, message);
    console.log(`[${new Date().toLocaleString()}] AI:`, reply);

    return reply;
  } catch (err) {
    console.error("❌ Error in AI service:", err);
    return "Sorry, I cannot respond right now 😔. Please try again.";
  }
};

/**
 * Conversation memory
 * Stores last 20 interactions (user + AI)
 * Can be extended to a database for persistent memory
 */
const conversationMemory = [];

/**
 * Add interaction to conversation memory
 * @param {string} userMessage - User input
 * @param {string} aiReply - AI response
 */
export const addToMemory = (userMessage, aiReply) => {
  if (!userMessage || !aiReply) return;

  conversationMemory.push({ user: userMessage, ai: aiReply });

  // Keep only last 20 messages to limit memory
  if (conversationMemory.length > 20) {
    conversationMemory.shift();
  }

  console.log(
    `[${new Date().toLocaleString()}] Memory updated. Total messages stored: ${conversationMemory.length}`
  );
};

/**
 * Retrieve current conversation memory
 * @returns {Array} Array of { user, ai } objects
 */
export const getConversationMemory = () => {
  return conversationMemory;
};

/**
 * Optional: Clear memory (useful for testing or resetting)
 */
export const clearConversationMemory = () => {
  conversationMemory.length = 0;
  console.log(`[${new Date().toLocaleString()}] Conversation memory cleared`);
};
