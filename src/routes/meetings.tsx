import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { AiTool } from "@/components/AiTool";

export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer | AI Workplace" }, { name: "description", content: "Summarize meetings into clear action items." }] }),
  component: MeetingsPage,
});

function MeetingsPage() {
  return (
    <AiTool
      title="Meeting Notes Summarizer"
      description="Turn raw notes or transcripts into structured summaries and action items."
      icon={<FileText className="h-5 w-5" />}
      fields={[
        { name: "context", label: "Meeting context (optional)", type: "input", placeholder: "e.g., Weekly product sync" },
        { name: "notes", label: "Notes or transcript", type: "textarea", rows: 10, placeholder: "Paste your raw meeting notes or transcript here..." },
      ]}
      buildPrompt={(v) => ({
        system: "You are an expert meeting summarizer. Produce: 1) A 3-sentence executive summary, 2) Key decisions, 3) Action items with owners (if mentioned) and due dates, 4) Open questions. Use clean markdown with headings.",
        prompt: `Context: ${v.context || "N/A"}\n\nNotes:\n${v.notes}`,
      })}
      ctaLabel="Summarize"
    />
  );
}