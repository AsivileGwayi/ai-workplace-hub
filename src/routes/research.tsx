import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { AiTool } from "@/components/AiTool";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant | AI Workplace" }, { name: "description", content: "Get a briefing on any topic." }] }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <AiTool
      title="AI Research Assistant"
      description="Get a structured briefing on any topic, audience, or question."
      icon={<Search className="h-5 w-5" />}
      fields={[
        { name: "topic", label: "Topic or question", type: "textarea", rows: 3, placeholder: "e.g., Compare leading CRM platforms for SMBs" },
        { name: "audience", label: "Audience (optional)", type: "input", placeholder: "Who is this briefing for?" },
      ]}
      buildPrompt={(v) => ({
        system: "You are a senior research analyst. Produce a briefing with: 1) TL;DR, 2) Key points (bulleted), 3) Pros/cons or trade-offs, 4) Recommended next steps. Be balanced and flag uncertainty. Note your knowledge may be out of date.",
        prompt: `Topic: ${v.topic}\nAudience: ${v.audience || "General"}`,
      })}
      ctaLabel="Research"
    />
  );
}