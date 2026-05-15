export interface GenerateJsonArgs {
  systemPrompt: string;
  userPrompt: string;
  schemaName: string;
  schema: Record<string, unknown>;
}

export interface DigestJsonProvider {
  generateJson(args: GenerateJsonArgs): Promise<string>;
}
