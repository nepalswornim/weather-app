export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { question, city, weatherData } = req.body;

  if (!question || !city) {
    return res.status(400).json({ error: "Missing question or city" });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You're a helpful weather assistant." },
          { role: "user", content: `City: ${city}. Weather: ${JSON.stringify(weatherData)}. Question: ${question}` },
        ],
        temperature: 0.7,
      }),
    });

    const json = await openaiRes.json();
    if (json.error) return res.status(500).json({ error: json.error.message });

    return res.status(200).json({ answer: json.choices[0].message.content });

  } catch (err) {
    return res.status(500).json({ error: "Failed to contact OpenAI." });
  }
}
