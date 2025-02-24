import "reflect-metadata";

import { openai } from "@ai-sdk/openai";
import { container } from "tsyringe-neo";
import { afterEach, beforeEach, vi } from "vitest";

import { LlmModel } from "./src/container";

afterEach(() => {
	vi.restoreAllMocks();
});

beforeEach(() => {
	const model = openai("gpt-4o-mini");

	vi.spyOn(model, "doGenerate").mockImplementation(async () => ({
		rawCall: { rawPrompt: null, rawSettings: {} },
		finishReason: "stop",
		usage: { promptTokens: 10, completionTokens: 20 },
		text: "Hello World",
	}));

	// NOTE: The `ai/test` use `node:https` which not supported by Cloudflare Worker
	container.register(LlmModel, {
		useValue: model,
	});
});
