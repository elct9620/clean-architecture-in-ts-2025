import { Cart } from "@api/cart";
import { SELF } from "cloudflare:test";
import { TestContext, expect } from "vitest";

export async function whenGetRoot(ctx: TestContext) {
	ctx.response = await SELF.fetch("https://example.com");
}

export async function whenGetCart(ctx: TestContext, sessionId: string) {
	ctx.response = await SELF.fetch(
		`https://example.com/api/cart?sessionId=${sessionId}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		},
	);

	return ctx.response;
}

export async function whenSendChatMessage(sessionId: string, content: string) {
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

export async function thenCartResponseIsValid(response: Response) {
	expect(response.status).toBe(200);
	expect(response.headers.get("content-type")).toContain("application/json");

	const data = (await response.json()) as Cart;
	expect(data).toHaveProperty("items");
	expect(Array.isArray(data.items)).toBe(true);

	return data;
}

export async function thenCartContainsItem(
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

export async function thenReadStreamResponse(response: Response) {
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

export async function thenHtmlContains(ctx: TestContext, text: string) {
	const html = await ctx.response.text();

	expect(html).toContain(text);
}
