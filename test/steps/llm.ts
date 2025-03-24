import { simulateReadableStream } from "ai";
import { container } from "tsyringe-neo";
import { TestContext } from "vitest";

import { LlmModel } from "@/container";
import { MockLanguageModelV1 } from "../mocks/MockLanguageModelV1";

export type StreamChunk =
	| { type: "text-delta"; textDelta: string }
	| {
			type: "tool-call";
			toolName: string;
			toolCallId: string;
			toolCallType: string;
			args: string;
	  }
	| {
			type: "tool-call-delta";
			toolName: string;
			toolCallId: string;
			toolCallType: string;
			argsTextDelta: string;
	  }
	| {
			type: "finish";
			finishReason: string;
			usage: { completionTokens: number; promptTokens: number };
	  };

export function givenLanguageModel(ctx: TestContext, chunks: StreamChunk[]) {
	const model = new MockLanguageModelV1({
		doStream: async () => {
			return {
				rawCall: { rawPrompt: null, rawSettings: {} },
				stream: simulateReadableStream({ chunks }),
			};
		},
	});

	container.register(LlmModel, {
		useValue: model,
	});

	ctx.model = model;
}

export function givenAddToCartLanguageModel(ctx: TestContext) {
	givenLanguageModel(ctx, [
		{
			type: "tool-call",
			toolName: "addToCart",
			toolCallId: "1234",
			toolCallType: "function",
			args: '{ "name": "無線滑鼠", "quantity": 2 }',
		},
		{
			type: "tool-call-delta",
			toolName: "addToCart",
			toolCallId: "1234",
			toolCallType: "function",
			argsTextDelta: "{}",
		},
		{ type: "text-delta", textDelta: "已將商品加入購物車" },
		{
			type: "finish",
			finishReason: "stop",
			usage: { completionTokens: 0, promptTokens: 0 },
		},
	]);
}
