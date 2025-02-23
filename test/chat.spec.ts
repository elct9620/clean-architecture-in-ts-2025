import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

import "../src/index";

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("Chat Controller", () => {
	const payload = {
		sessionId: "test-session",
		content: "Hello",
	};

	it("responds with SSE stream (integration style)", async () => {
		const response = await SELF.fetch("https://example.com/api/chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "text/event-stream",
			},
			body: JSON.stringify(payload),
		});

		expect(response.headers.get("content-type")).toBe("text/event-stream");

		const reader = response.body?.getReader();
		const decoder = new TextDecoder();

		if (!reader) {
			throw new Error("No reader available");
		}

		const { value } = await reader.read();
		const text = decoder.decode(value);

		expect(text).toContain("event: message");
		expect(text).toContain('data: {"content":"Hello World"}');
	});
});
