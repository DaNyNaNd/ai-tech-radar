export interface LLMProvider {
  summarize(input: string): Promise<string>;
}