import { afterEach, beforeEach, describe, it, vi } from "vitest";

import "../src/index";
import {
	thenChatContainsMessages,
	thenStreamEventHave,
	whenGetChat,
	whenSendChatMessage,
	whenStreamResponseCompleted,
} from "./steps/http";
import { givenLanguageModel } from "./steps/llm";
import { givenConversation } from "./steps/cloudflare";

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

	it("responds with SSE stream", async (ctx) => {
		const sessionId = "test-session";
		await whenSendChatMessage(ctx, sessionId, "Hello");

		await thenStreamEventHave(ctx, [
			"event: message",
			'data: {"content":"Hello"}',
			'data: {"content":" World"}',
		]);
	});

	describe("GET /api/chat/:id", () => {
		it("returns empty conversation when not exists", async (ctx) => {
			await whenGetChat(ctx, "non-existent-id");

			await thenChatContainsMessages(ctx, []);
		});

		it("returns conversation from KV store", async (ctx) => {
			const sessionId = "existing-session";
			const conversation = {
				id: sessionId,
				messages: [
					{ role: "user", content: "你好" },
					{ role: "assistant", content: "你好！有什麼我可以幫助你的嗎？" },
				],
			};

			await givenConversation(ctx, conversation);
			await whenGetChat(ctx, sessionId);

			await thenChatContainsMessages(ctx, [
				{ role: "user", content: "你好" },
				{ role: "assistant", content: "你好！有什麼我可以幫助你的嗎？" },
			]);
		});

		it("saves and retrieves conversation after chat", async (ctx) => {
			const sessionId = "chat-then-get-session";

			// 發送聊天訊息
			await whenSendChatMessage(ctx, sessionId, "Hello");
			await whenStreamResponseCompleted(ctx);

			// 獲取對話
			await whenGetChat(ctx, sessionId);

			await thenChatContainsMessages(ctx, [
				{ role: "user", content: "Hello" },
				{ role: "assistant", content: "Hello World" },
			]);
		});
	});
});
