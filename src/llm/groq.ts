import type { LLMProvider } from "./types.js";

export class GroqProvider implements LLMProvider {
  constructor(
    private readonly apiKey: string,
    private readonly model: string,
  ) {}

  async summarize(input: string): Promise<string> {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: "system",
            content:
              "Return valid JSON only. Do not wrap the response in markdown code fences.",
          },
          {
            role: "user",
            content: input,
          },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(
        `Groq API request failed: ${res.status} ${res.statusText}`,
      );
    }

    const json = await res.json();
    return json.choices?.[0]?.message?.content ?? "";
  }
}
