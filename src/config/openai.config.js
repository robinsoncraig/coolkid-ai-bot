/**
 * CoolKid AI Bot - openai.config.js
 * Initializes OpenAI client for AI service
 */

import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Export OpenAI client instance
 * Reads API key from .env
 */
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
