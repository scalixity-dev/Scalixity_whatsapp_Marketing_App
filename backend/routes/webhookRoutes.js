// routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const webhookService = require('../services/webhookService');

// Webhook verification endpoint
router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];
  const verifyToken = process.env.VERIFY_TOKEN;

  const result = webhookService.verifyWebhook(mode, token, challenge, verifyToken);
  res.status(result.status).send(result.status === 200 ? result.data : "");
});

// Webhook message receiving endpoint
router.post("/", async (req, res) => {
  const result = await webhookService.processIncomingMessage(req.body);
  res.status(result.status).json(result.status === 200 ? result.data : { error: "Failed to process message" });
});

module.exports = router;