export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: { message: "Method not allowed" } });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key)
    return res.status(500).json({ error: { message: "ANTHROPIC_API_KEY is not set on the server." } });

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });
    const data = await upstream.json();
    if (upstream.status >= 400) {
      console.error("ERR_TYPE:", data?.error?.type);
      console.error("ERR_MSG:", data?.error?.message);
      console.error("REQ_MODEL:", req.body?.model);
      console.error("REQ_MAXTOK:", req.body?.max_tokens);
    }
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
}
