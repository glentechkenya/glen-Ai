export async function POST(req) {
  try {
    const { messages } = await req.json();

    const res = await fetch("https://api.oxlo.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OXLO_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages
      })
    });

    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
