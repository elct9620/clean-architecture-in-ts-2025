// test/index.spec.ts
import { SELF } from "cloudflare:test";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("Hello World worker", () => {
	it("should render HTML with root element and script", async () => {
		const response = await SELF.fetch("https://example.com");
		const html = await response.text();
		const dom = new JSDOM(html);
		const document = dom.window.document;

		// Verify root element exists
		const rootElement = document.getElementById("root");
		expect(rootElement).toBeTruthy();

		// Verify script is loaded
		const scripts = document.getElementsByTagName("script");
		expect(scripts.length).toBe(1);
		expect(scripts[0].type).toBe("module");
		expect(scripts[0].src).toMatch(import.meta.env.PROD ? "/app.js" : "/src/client.tsx");
	});
});
