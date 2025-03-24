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
}

export async function whenSendChatMessage(
	ctx: TestContext,
	sessionId: string,
	content: string,
) {
	ctx.response = await SELF.fetch("https://example.com/api/chat", {
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

export async function thenCartResponseIsValid(ctx: TestContext) {
	expect(ctx.response.status).toBe(200);
	expect(ctx.response.headers.get("content-type")).toContain(
		"application/json",
	);

	const data = (await ctx.response.json()) as Cart;
	expect(data).toHaveProperty("items");
	expect(Array.isArray(data.items)).toBe(true);

	return data;
}

export async function thenCartContainsItem(
	ctx: TestContext,
	sessionId: string,
	expectedItem: { name: string; price: number; quantity: number },
) {
	await whenGetCart(ctx, sessionId);
	const cartData = await thenCartResponseIsValid(ctx);

	expect(cartData.items).toHaveLength(1);
	expect(cartData.items[0].name).toBe(expectedItem.name);
	expect(cartData.items[0].price).toBe(expectedItem.price);
	expect(cartData.items[0].quantity).toBe(expectedItem.quantity);

	return cartData;
}

export async function whenStreamResponseCompleted(ctx: TestContext) {
	const reader = ctx.response.body?.getReader();
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

export async function thenStreamEventHave(
	ctx: TestContext,
	expectedContents: string[],
) {
	expect(ctx.response.headers.get("content-type")).toBe("text/event-stream");

	const chunks = await whenStreamResponseCompleted(ctx);

	for (const content of expectedContents) {
		expect(chunks).toContain(content);
	}

	return chunks;
}

export async function whenGetChat(ctx: TestContext, sessionId: string) {
	ctx.response = await SELF.fetch(`https://example.com/api/chat/${sessionId}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
}

export async function thenChatContainsMessages(
	ctx: TestContext,
	expectedMessages: Array<{ role: string; content: string }>,
) {
	expect(ctx.response.status).toBe(200);
	expect(ctx.response.headers.get("content-type")).toContain(
		"application/json",
	);

	const data = (await ctx.response.json()) as {
		messages: Array<{ role: string; content: string }>;
	};
	expect(data).toHaveProperty("messages");

	expect(data.messages).toHaveLength(expectedMessages.length);

	for (let i = 0; i < expectedMessages.length; i++) {
		expect(data.messages[i].role).toBe(expectedMessages[i].role);
		expect(data.messages[i].content).toBe(expectedMessages[i].content);
	}
}

export async function thenHtmlContains(ctx: TestContext, text: string) {
	const html = await ctx.response.text();

	expect(html).toContain(text);
}
