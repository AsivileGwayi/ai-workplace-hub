import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { system, prompt, model } = await request.json();
          if (typeof prompt !== "string" || prompt.length === 0 || prompt.length > 8000) {
            return new Response(JSON.stringify({ error: "Invalid prompt" }), { status: 400 });
          }
          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) {
            return new Response(JSON.stringify({ error: "AI not configured" }), { status: 500 });
          }
          const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: model || "google/gemini-3-flash-preview",
              messages: [
                ...(system ? [{ role: "system", content: String(system).slice(0, 4000) }] : []),
                { role: "user", content: prompt },
              ],
            }),
          });
          if (resp.status === 429) {
            return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), { status: 429 });
          }
          if (resp.status === 402) {
            return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits to your workspace." }), { status: 402 });
          }
          if (!resp.ok) {
            const txt = await resp.text();
            return new Response(JSON.stringify({ error: "AI gateway error", detail: txt }), { status: 500 });
          }
          const data = await resp.json();
          const content = data?.choices?.[0]?.message?.content ?? "";
          return new Response(JSON.stringify({ content }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500 });
        }
      },
    },
  },
});