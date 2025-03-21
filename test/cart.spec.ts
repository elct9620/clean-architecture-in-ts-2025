import { simulateReadableStream } from "ai";
import { SELF } from "cloudflare:test";
import { container } from "tsyringe-neo";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MockLanguageModelV1 } from "./mocks/MockLanguageModelV1";

import { LlmModel } from "@/container";
import { Cart } from "@api/cart";

describe("Cart Controller", () => {
	beforeEach(() => {
		let nthStep = 0;
		const model = new MockLanguageModelV1({
			doStream: async () => {
				if (nthStep > 0) {
					return {
						rawCall: { rawPrompt: null, rawSettings: {} },
						stream: simulateReadableStream({ chunks: [] }),
					};
				}

				nthStep++;
				return {
					rawCall: { rawPrompt: null, rawSettings: {} },
					stream: simulateReadableStream({
						chunks: [
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
						],
					}),
				};
			},
		});

		container.register(LlmModel, {
			useValue: model,
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("responds with cart data", async () => {
		const response = await SELF.fetch(
			`https://example.com/api/cart?sessionId=mock-id`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toContain("application/json");

		const data = (await response.json()) as Cart;
		expect(data).toHaveProperty("items");
		expect(Array.isArray(data.items)).toBe(true);
	});

	it("adds items to cart", async () => {
		const response = await SELF.fetch("https://example.com/api/chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "text/event-stream",
			},
			body: JSON.stringify({
				sessionId: "test-session",
				content: "我要買 2 個 無線滑鼠",
			}),
		});

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

		const cartResponse = await SELF.fetch(
			`https://example.com/api/cart?sessionId=test-session`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		const cartData = (await cartResponse.json()) as Cart;
		expect(cartData.items).toHaveLength(1);
		expect(cartData.items[0].name).toBe("無線滑鼠");
		expect(cartData.items[0].price).toBe(699);
		expect(cartData.items[0].quantity).toBe(2);
	});
});
