import { SELF } from "cloudflare:test";
import { TestContext, expect } from "vitest";

export async function whenGetRoot(ctx: TestContext) {
	ctx.response = await SELF.fetch("https://example.com");
}

export async function thenHtmlContains(ctx: TestContext, text: string) {
	const html = await ctx.response.text();

	expect(html).toContain(text);
}
