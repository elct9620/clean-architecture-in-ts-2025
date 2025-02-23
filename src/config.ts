export interface OpenAiConfig {
	baseUrl: string;
	apiKey: string;
}

export class Config {
	constructor(
		public readonly openai: OpenAiConfig,
		public readonly modelId: string,
	) {}
}
