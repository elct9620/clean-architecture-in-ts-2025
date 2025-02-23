import { createOpenAI } from "@ai-sdk/openai";
import { LanguageModel } from "ai";
import { container } from "tsyringe-neo";

import { Config } from "./config";

export const KvStore = Symbol("KvStore");
export const LlmProvider = Symbol("LlmProvider");
export const LlmModel = Symbol("LlmModel");

export type LanguageModelProvider = (modelId: string) => LanguageModel;

container.register(LlmProvider, {
	useFactory: (c) => {
		const config = c.resolve(Config);

		return createOpenAI({
			baseURL: config.openai.baseUrl,
			apiKey: config.openai.apiKey,
		});
	},
});

container.register(LlmModel, {
	useFactory: (c) => {
		const config = c.resolve(Config);
		const provider = c.resolve<LanguageModelProvider>(LlmProvider);

		return provider(config.modelId);
	},
});
