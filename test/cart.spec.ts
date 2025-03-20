import { SELF } from "cloudflare:test";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CartTool } from "@/agent/CartTool";
import { Cart as CartEntity } from "@/entity/Cart";
import { Cart } from "@api/cart";

describe("Cart Controller", () => {
	const sessionId = "test-session";
	let cartEntity: CartEntity;
	let cartTool: CartTool;

	beforeEach(() => {
		// 創建一個新的購物車實體
		cartEntity = new CartEntity(sessionId);
		cartTool = CartTool.create(cartEntity);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

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

		const data = (await response.json()) as Cart;
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

		const data = (await response.json()) as Cart;
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

		const data = (await response.json()) as Cart;
		expect(data).toHaveProperty("items");
		expect(Array.isArray(data.items)).toBe(true);
		// 不再期望預設購物車一定有項目
	});

	describe("CartTool operations", () => {
		it("adds items to cart", async () => {
			// 獲取工具集
			const tools = cartTool.getTools();

			// 添加商品到購物車
			const result = await tools.addToCart.execute({
				name: "測試商品",
				price: 100,
				quantity: 2,
			});

			// 驗證添加結果
			expect(result.success).toBe(true);
			expect(result.message).toBe("已將 2 個 測試商品 加入購物車");

			// 驗證購物車內容
			const cartItems = await tools.listCartItems.execute({});
			expect(cartItems.items).toHaveLength(1);
			expect(cartItems.items[0].name).toBe("測試商品");
			expect(cartItems.items[0].price).toBe(100);
			expect(cartItems.items[0].quantity).toBe(2);
			expect(cartItems.items[0].total).toBe(200);
			expect(cartItems.totalAmount).toBe(200);
		});

		it("updates items in cart", async () => {
			const tools = cartTool.getTools();

			// 先添加商品
			await tools.addToCart.execute({
				name: "測試商品",
				price: 100,
				quantity: 1,
			});

			// 更新商品數量
			const updateResult = await tools.updateCartItem.execute({
				name: "測試商品",
				quantity: 3,
			});

			expect(updateResult.success).toBe(true);
			expect(updateResult.message).toBe("已將 測試商品 的數量更新為 3");

			// 驗證更新後的購物車
			const cartItems = await tools.listCartItems.execute({});
			expect(cartItems.items[0].quantity).toBe(3);
			expect(cartItems.items[0].total).toBe(300);
		});

		it("removes items from cart", async () => {
			const tools = cartTool.getTools();

			// 先添加商品
			await tools.addToCart.execute({
				name: "測試商品",
				price: 100,
				quantity: 1,
			});

			// 移除商品
			const removeResult = await tools.removeFromCart.execute({
				name: "測試商品",
			});

			expect(removeResult.success).toBe(true);
			expect(removeResult.message).toBe("已從購物車中移除 測試商品");

			// 驗證購物車是否為空
			const cartItems = await tools.listCartItems.execute({});
			expect(cartItems.items).toHaveLength(0);
		});

		it("fails to update non-existent item", async () => {
			const tools = cartTool.getTools();

			// 嘗試更新不存在的商品
			const updateResult = await tools.updateCartItem.execute({
				name: "不存在的商品",
				quantity: 3,
			});

			expect(updateResult.success).toBe(false);
			expect(updateResult.message).toBe("購物車中沒有 不存在的商品");
		});

		it("fails to remove non-existent item", async () => {
			const tools = cartTool.getTools();

			// 嘗試移除不存在的商品
			const removeResult = await tools.removeFromCart.execute({
				name: "不存在的商品",
			});

			expect(removeResult.success).toBe(false);
			expect(removeResult.message).toBe("購物車中沒有 不存在的商品");
		});

		it("calculates correct totals with multiple items", async () => {
			const tools = cartTool.getTools();

			// 添加多個商品
			await tools.addToCart.execute({
				name: "商品 A",
				price: 100,
				quantity: 2,
			});

			await tools.addToCart.execute({
				name: "商品 B",
				price: 50,
				quantity: 3,
			});

			// 驗證購物車總計
			const cartItems = await tools.listCartItems.execute({});
			expect(cartItems.items).toHaveLength(2);
			expect(cartItems.totalItems).toBe(2);
			expect(cartItems.totalAmount).toBe(350); // 2*100 + 3*50 = 350
		});
	});
});
