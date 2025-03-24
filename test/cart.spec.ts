import { afterEach, beforeEach, describe, it, vi } from "vitest";

import { 
	thenCartContainsItem, 
	thenCartResponseIsValid, 
	thenReadStreamResponse, 
	whenGetCart, 
	whenSendChatMessage 
} from "./steps/http";
import { givenLanguageModel } from "./steps/llm";

describe("Cart Controller", () => {
	beforeEach((ctx) => {
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
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});


	it("responds with cart data", async (ctx) => {
		const response = await whenGetCart(ctx, "mock-id");
		await thenCartResponseIsValid(response);
	});


	it("adds items to cart", async (ctx) => {
		const sessionId = "test-session";
		const response = await whenSendChatMessage(
			sessionId,
			"我要買 2 個 無線滑鼠",
		);
		await thenReadStreamResponse(response);
		await thenCartContainsItem(ctx, sessionId, {
			name: "無線滑鼠",
			price: 699,
			quantity: 2,
		});
	});
});
