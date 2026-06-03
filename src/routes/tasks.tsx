import { createFileRoute } from "@tanstack/react-router";
import { ListTodo } from "lucide-react";
import { AiTool } from "@/components/AiTool";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "AI Task Planner | AI Workplace" }, { name: "description", content: "Turn goals into an actionable plan." }] }),
  component: TasksPage,
});

function TasksPage() {
  return (
    <AiTool
      title="AI Task Planner"
      description="Break down a goal into prioritized, time-boxed steps."
      icon={<ListTodo className="h-5 w-5" />}
      fields={[
        { name: "goal", label: "Goal or project", type: "textarea", rows: 3, placeholder: "e.g., Launch a new marketing campaign in 4 weeks" },
        { name: "constraints", label: "Constraints (optional)", type: "input", placeholder: "Deadline, team size, budget..." },
      ]}
      buildPrompt={(v) => ({
        system: "You are an expert project planner. Produce a structured plan with: 1) Milestones with target dates, 2) Detailed tasks under each milestone (with priority H/M/L and estimated effort), 3) Risks & mitigations. Use markdown.",
        prompt: `Goal: ${v.goal}\nConstraints: ${v.constraints || "None specified"}`,
      })}
      ctaLabel="Plan it"
    />
  );
}