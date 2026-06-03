import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { AiTool } from "@/components/AiTool";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator | AI Workplace" }, { name: "description", content: "Generate professional emails with AI." }] }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <AiTool
      title="Smart Email Generator"
      description="Draft polished, on-brand emails in seconds."
      icon={<Mail className="h-5 w-5" />}
      fields={[
        { name: "recipient", label: "Recipient", type: "input", placeholder: "e.g., My manager, a client named Sarah" },
        { name: "purpose", label: "Purpose of the email", type: "textarea", rows: 3, placeholder: "What do you want to communicate?" },
        { name: "tone", label: "Tone", type: "input", placeholder: "professional, friendly, concise, formal..." },
      ]}
      buildPrompt={(v) => ({
        system: "You are an expert professional email writer. Produce a complete, ready-to-send email with a subject line, greeting, body, and sign-off. Use markdown for the subject (bold). Keep it clear and concise.",
        prompt: `Recipient: ${v.recipient}\nTone: ${v.tone}\nPurpose: ${v.purpose}\n\nWrite the email now.`,
      })}
    />
  );
}