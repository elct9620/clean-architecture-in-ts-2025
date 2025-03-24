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

export async function thenHtmlContains(ctx: TestContext, text: string) {
	const html = await ctx.response.text();

	expect(html).toContain(text);
}
