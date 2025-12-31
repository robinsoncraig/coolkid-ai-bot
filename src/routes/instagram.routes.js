import express from "express";
import { handleWebhook, handleDM } from "../controllers/instagram.controller.js";

const router = express.Router();

// GET for webhook verification
router.get("/webhook", handleWebhook);

// POST for receiving messages
router.post("/webhook", handleDM);

export default router;
