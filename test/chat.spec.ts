import { openai } from "@ai-sdk/openai";
import { SELF } from "cloudflare:test";
import { container } from "tsyringe-neo";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LlmModel } from "../src/container";
import "../src/index";

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("Chat Controller", () => {
	const payload = {
		sessionId: "test-session",
		content: "Hello",
	};

	beforeEach(() => {
		const model = openai("gpt-4o-mini");

		vi.spyOn(model, "doGenerate").mockImplementation(async () => ({
			rawCall: { rawPrompt: null, rawSettings: {} },
			finishReason: "stop",
			usage: { promptTokens: 10, completionTokens: 20 },
			text: "Hello World",
		}));

		container.register(LlmModel, {
			useValue: model,
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

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
