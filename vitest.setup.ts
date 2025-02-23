import "reflect-metadata";

import { container } from "tsyringe-neo";
import { beforeEach } from "vitest";

import { LlmModel } from "./src/container";

beforeEach(() => {
	// NOTE: The `ai/test` use `node:https` which not supported by Cloudflare Worker
	container.register(LlmModel, {
		useValue: {
			doGenerate: async () => ({
				rawCall: { rawPrompt: null, rawSettings: {} },
				finishReason: "stop",
				usage: { promptTokens: 10, completionTokens: 20 },
				text: "Hello World",
			}),
		},
	});
});
