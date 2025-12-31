/**
 * instagram.controller.js
 * Handles Instagram Webhook verification and DM processing for CoolKid AI Bot
 */

import axios from "axios";
import {
  getAIResponse,
  addToMemory,
  getConversationMemory,
} from "../services/ai.service.js";

const PAGE_ACCESS_TOKEN = process.env.INSTAGRAM_PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.INSTAGRAM_VERIFY_TOKEN;

/**
 * Webhook verification endpoint
 * Meta will call this to verify your webhook
 */
export const handleWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verified successfully");
      return res.status(200).send(challenge);
    } else {
      console.warn("❌ Webhook verification failed: invalid token");
      return res.sendStatus(403);
    }
  } else {
    console.warn("❌ Webhook verification failed: missing mode or token");
    return res.sendStatus(400);
  }
};

/**
 * Handle incoming Instagram messages (DMs)
 */
export const handleDM = async (req, res) => {
  const body = req.body;

  if (body.object === "instagram") {
    try {
      for (const entry of body.entry) {
        // Each entry can contain multiple messaging events
        const messagingEvents = entry.messaging || [];

        for (const event of messagingEvents) {
          // Only process if the event has a message and sender ID
          if (event.message && event.sender && event.sender.id) {
            const senderId = event.sender.id;
            const userMessage = event.message.text;

            // Log incoming message
            console.log(`📩 Received DM from ${senderId}:`, userMessage);

            // Handle non-text messages gracefully
            if (!userMessage) {
              const fallbackReply =
                "Hey! I can only respond to text messages right now 😅. Try typing something!";
              await sendMessage(senderId, fallbackReply);
              console.log(
                `⚠️ Non-text message received from ${senderId}, sent fallback reply`
              );
              continue;
            }

            // Get AI-generated reply
            const aiReply = await getAIResponse(userMessage);

            // Store in conversation memory
            addToMemory(userMessage, aiReply);

            // Log AI reply
            console.log(`🤖 AI reply to ${senderId}:`, aiReply);

            // Send reply back to Instagram
            await sendMessage(senderId, aiReply);
          }
        }
      }

      // Respond to Meta to acknowledge receipt of event
      return res.status(200).send("EVENT_RECEIVED");
    } catch (error) {
      console.error("❌ Error handling DM:", error);
      return res.status(500).send("Error processing DM");
    }
  } else {
    // Ignore non-Instagram events
    console.warn("⚠️ Received non-Instagram webhook event");
    return res.sendStatus(404);
  }
};

/**
 * Helper function to send messages via Instagram Graph API
 * @param {string} recipientId - Instagram user ID
 * @param {string} message - Text message to send
 */
const sendMessage = async (recipientId, message) => {
  try {
    const url = `https://graph.facebook.com/v17.0/${recipientId}/messages`;
    const payload = {
      messaging_type: "RESPONSE",
      text: message,
    };
    const params = { access_token: PAGE_ACCESS_TOKEN };

    await axios.post(url, payload, { params });
    console.log(`✅ Message sent to ${recipientId}`);
  } catch (error) {
    console.error(`❌ Failed to send message to ${recipientId}:`, error.response?.data || error.message);
  }
};

/**
 * Optional: Retrieve conversation memory (for debugging or analytics)
 */
export const debugMemory = () => {
  const memory = getConversationMemory();
  console.log("🗂️ Conversation Memory:", memory);
  return memory;
};
