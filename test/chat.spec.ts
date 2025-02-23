import {
	createExecutionContext,
	env,
	SELF,
	waitOnExecutionContext,
} from "cloudflare:test";
import { describe, expect, it } from "vitest";
import worker from "../src/index";

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("Chat Controller", () => {
	it("responds with Hello World! on POST request", async () => {
		const request = new IncomingRequest("http://example.com/api/chat", {
			method: "POST",
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(await response.text()).toBe("Hello World!");
	});

	it("responds with Hello World! (integration style)", async () => {
		const response = await SELF.fetch("https://example.com/api/chat", {
			method: "POST",
		});
		expect(await response.text()).toBe("Hello World!");
	});
});
