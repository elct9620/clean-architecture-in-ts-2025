import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("Cart Controller", () => {
	const sessionId = "test-session";

	it("responds with cart data", async () => {
		// 測試獲取購物車數據
		const response = await SELF.fetch(
			`https://example.com/api/cart?sessionId=${sessionId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toContain("application/json");

		const data = await response.json();
		expect(data).toHaveProperty("items");
		expect(Array.isArray(data.items)).toBe(true);
	});

	it("creates a new cart if session doesn't exist", async () => {
		const newSessionId = "new-test-session";

		const response = await SELF.fetch(
			`https://example.com/api/cart?sessionId=${newSessionId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		expect(response.status).toBe(200);

		const data = await response.json();
		expect(data).toHaveProperty("items");
		expect(Array.isArray(data.items)).toBe(true);
	});

	it("returns default cart when no sessionId provided", async () => {
		const response = await SELF.fetch("https://example.com/api/cart", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		expect(response.status).toBe(200);

		const data = await response.json();
		expect(data).toHaveProperty("items");
		expect(Array.isArray(data.items)).toBe(true);
		expect(data.items.length).toBeGreaterThan(0); // 預設購物車應該有項目
	});
});
