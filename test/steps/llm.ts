import { LanguageModelV1StreamPart, simulateReadableStream } from "ai";
import { container } from "tsyringe-neo";
import { TestContext } from "vitest";

import { LlmModel } from "@/container";
import { MockLanguageModelV1 } from "../mocks/MockLanguageModelV1";

function runOnce<T>(fn: () => Promise<T>, defaultValue: T): () => Promise<T> {
	let isRun = false;
	return async () => {
		if (isRun) {
			return defaultValue;
		}
		isRun = true;
		return fn();
	};
}

export function givenLanguageModel(
	ctx: TestContext,
	chunks: LanguageModelV1StreamPart[],
) {
	const model = new MockLanguageModelV1({
		doStream: runOnce(
			async () => ({
				rawCall: { rawPrompt: null, rawSettings: {} },
				stream: simulateReadableStream({ chunks }),
			}),
			{
				rawCall: { rawPrompt: null, rawSettings: {} },
				stream: simulateReadableStream({ chunks: [] }),
			},
		),
	});

	container.register(LlmModel, {
		useValue: model,
	});
}
