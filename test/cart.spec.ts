import { SELF } from "cloudflare:test";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Cart } from "@api/cart";
import { givenAddToCartLanguageModel } from "./steps/llm";

describe("Cart Controller", () => {
	beforeEach((ctx) => {
		givenAddToCartLanguageModel(ctx);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	async function whenGetCart(sessionId: string) {
		return await SELF.fetch(
			`https://example.com/api/cart?sessionId=${sessionId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}

	async function thenCartResponseIsValid(response: Response) {
		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toContain("application/json");

		const data = (await response.json()) as Cart;
		expect(data).toHaveProperty("items");
		expect(Array.isArray(data.items)).toBe(true);

		return data;
	}

	it("responds with cart data", async () => {
		const response = await whenGetCart("mock-id");
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
		sessionId: string,
		expectedItem: { name: string; price: number; quantity: number },
	) {
		const cartResponse = await whenGetCart(sessionId);
		const cartData = await thenCartResponseIsValid(cartResponse);

		expect(cartData.items).toHaveLength(1);
		expect(cartData.items[0].name).toBe(expectedItem.name);
		expect(cartData.items[0].price).toBe(expectedItem.price);
		expect(cartData.items[0].quantity).toBe(expectedItem.quantity);

		return cartData;
	}

	it("adds items to cart", async () => {
		const sessionId = "test-session";
		const response = await whenSendChatMessage(
			sessionId,
			"我要買 2 個 無線滑鼠",
		);
		await thenReadStreamResponse(response);
		await thenCartContainsItem(sessionId, {
			name: "無線滑鼠",
			price: 699,
			quantity: 2,
		});
	});
});
