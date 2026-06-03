import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, Copy, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Field {
  name: string;
  label: string;
  placeholder?: string;
  type?: "input" | "textarea";
  rows?: number;
}

interface AiToolProps {
  title: string;
  description: string;
  icon: ReactNode;
  fields: Field[];
  buildPrompt: (values: Record<string, string>) => { system: string; prompt: string };
  ctaLabel?: string;
}

export function AiTool({ title, description, icon, fields, buildPrompt, ctaLabel = "Generate" }: AiToolProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const update = (n: string, v: string) => setValues((p) => ({ ...p, [n]: v }));

  const run = async () => {
    const missing = fields.find((f) => !values[f.name]?.trim());
    if (missing) {
      toast.error(`Please fill in: ${missing.label}`);
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const body = buildPrompt(values);
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }
      setOutput(data.content);
    } catch (e) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
          <div className="text-primary-foreground">{icon}</div>
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>

      <Card className="p-6 space-y-4" style={{ boxShadow: "var(--shadow-soft)" }}>
        {fields.map((f) => (
          <div key={f.name} className="space-y-1.5">
            <label className="text-sm font-medium">{f.label}</label>
            {f.type === "input" ? (
              <input
                value={values[f.name] || ""}
                onChange={(e) => update(f.name, e.target.value)}
                placeholder={f.placeholder}
                maxLength={500}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            ) : (
              <Textarea
                value={values[f.name] || ""}
                onChange={(e) => update(f.name, e.target.value)}
                placeholder={f.placeholder}
                rows={f.rows || 4}
                maxLength={4000}
              />
            )}
          </div>
        ))}
        <Button onClick={run} disabled={loading} className="w-full sm:w-auto">
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {loading ? "Generating..." : ctaLabel}
        </Button>
      </Card>

      {output && (
        <Card className="p-6 space-y-3" style={{ boxShadow: "var(--shadow-soft)" }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Result (editable)</h3>
            <Button variant="outline" size="sm" onClick={copy}>
              {copied ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <Textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            rows={14}
            className="font-mono text-sm"
          />
          <div className="flex items-start gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
            <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <p>AI-generated content. Review for accuracy, tone, and confidentiality before sharing.</p>
          </div>
        </Card>
      )}
    </div>
  );
}