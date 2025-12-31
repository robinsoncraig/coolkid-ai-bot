export default function handler(req, res) {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (
      mode === "subscribe" &&
      token === process.env.INSTAGRAM_VERIFY_TOKEN
    ) {
      return res.status(200).send(challenge);
    }

    return res.status(403).json({ error: "Verification failed" });
  }

  if (req.method === "POST") {
    return res.status(200).json({ status: "EVENT_RECEIVED" });
  }

  return res.status(405).end();
}
