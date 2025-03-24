import { afterEach, beforeEach, describe, it, vi } from "vitest";

import "../src/index";
import { thenStreamEventHave, whenSendChatMessage } from "./steps/http";
import { givenLanguageModel } from "./steps/llm";

describe("Chat Controller", () => {
	beforeEach((ctx) => {
		givenLanguageModel(ctx, [
			{ type: "text-delta", textDelta: "Hello" },
			{ type: "text-delta", textDelta: " World" },
			{
				type: "finish",
				finishReason: "stop",
				usage: { completionTokens: 0, promptTokens: 0 },
			},
		]);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("responds with SSE stream", async () => {
		const sessionId = "test-session";
		const response = await whenSendChatMessage(sessionId, "Hello");

		await thenStreamEventHave(response, [
			"event: message",
			'data: {"content":"Hello"}',
			'data: {"content":" World"}',
		]);
	});
});
