// test/index.spec.ts
import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("Hello World worker", () => {
	it("should render HTML with root element and script", async () => {
		const response = await SELF.fetch("https://example.com");
		const html = await response.text();

		// Verify root element exists
		expect(html).toContain('<div id="root"></div>');

		// Verify script is loaded with correct path
		expect(html).toContain('<script type="module" src="/src/client.tsx"></script>');
	});
});
