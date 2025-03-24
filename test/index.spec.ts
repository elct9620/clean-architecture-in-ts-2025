import { SELF } from "cloudflare:test";
import { describe, it } from "vitest";
import { thenHtmlContains, whenGetRoot } from "./steps/http";

describe("GET /", () => {
	it("should render HTML with root element", async (ctx) => {
		await whenGetRoot(ctx);
		await thenHtmlContains(ctx, '<div id="root"></div>');
	});

	it("should render script tags", async (ctx) => {
		const response = await SELF.fetch("https://example.com/");
		const html = await response.text();

		await whenGetRoot(ctx);
		await thenHtmlContains(
			ctx,
			'<script type="module" src="/src/client.tsx"></script>',
		);
	});
});
