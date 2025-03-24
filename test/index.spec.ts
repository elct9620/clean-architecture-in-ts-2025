import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("GET /", () => {
	it("should render HTML with root element", async () => {
		const response = await SELF.fetch("https://example.com");
		const html = await response.text();

		expect(html).toContain('<div id="root"></div>');
	});

	it("should render script tags", async () => {
		const response = await SELF.fetch("https://example.com/");
		const html = await response.text();

		expect(html).toContain(
			'<script type="module" src="/src/client.tsx"></script>',
		);
	});
});
