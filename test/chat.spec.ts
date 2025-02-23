import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("Chat Controller", () => {
	const payload = {
		sessionId: "test-session",
		content: "Hello",
	};

	it("responds with success (integration style)", async () => {
		const response = await SELF.fetch("https://example.com/api/chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
		expect(await response.json()).toEqual({ success: true });
	});
});
