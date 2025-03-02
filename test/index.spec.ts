// test/index.spec.ts
import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("Hello World worker", () => {
	it("responds with Hello World!", async () => {
		const response = await SELF.fetch("https://example.com");
		expect(await response.text()).toMatchInlineSnapshot(`"<html lang="zh-TW"><head><title>Clean Architecture in TypeScript</title><meta charSet="utf-8"/><meta content="width=device-width, initial-scale=1" name="viewport"/><script type="module" src="/src/client.tsx"></script></head><body><div id="root"></div></body></html>"`);
	});
});
