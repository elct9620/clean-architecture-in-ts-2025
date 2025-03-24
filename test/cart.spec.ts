import { SELF } from "cloudflare:test";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Cart } from "@api/cart";
import { givenLanguageModel } from "./steps/llm";
import { whenGetCart } from "./steps/http";

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


	async function thenCartResponseIsValid(response: Response) {
		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toContain("application/json");

		const data = (await response.json()) as Cart;
		expect(data).toHaveProperty("items");
		expect(Array.isArray(data.items)).toBe(true);

		return data;
	}

	it("responds with cart data", async (ctx) => {
		const response = await whenGetCart(ctx, "mock-id");
		await thenCartResponseIsValid(response);
	});

	async function whenSendChatMessage(sessionId: string, content: string) {
		return await SELF.fetch("https://example.com/api/chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "text/event-stream",
			},
			body: JSON.stringify({
				sessionId,
				content,
			}),
		});
	}

	async function thenReadStreamResponse(response: Response) {
		const reader = response.body?.getReader();
		if (!reader) {
			throw new Error("No reader available");
		}

		let chunks = "";
		while (true) {
			const { value, done } = await reader.read();
			if (done) break;
			chunks += new TextDecoder().decode(value);
		}

		return chunks;
	}

	async function thenCartContainsItem(
		ctx: TestContext,
		sessionId: string,
		expectedItem: { name: string; price: number; quantity: number },
	) {
		const cartResponse = await whenGetCart(ctx, sessionId);
		const cartData = await thenCartResponseIsValid(cartResponse);

		expect(cartData.items).toHaveLength(1);
		expect(cartData.items[0].name).toBe(expectedItem.name);
		expect(cartData.items[0].price).toBe(expectedItem.price);
		expect(cartData.items[0].quantity).toBe(expectedItem.quantity);

		return cartData;
	}

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
