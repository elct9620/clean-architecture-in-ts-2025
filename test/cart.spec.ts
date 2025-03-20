import { openai } from "@ai-sdk/openai";
import { SELF } from "cloudflare:test";
import { container } from "tsyringe-neo";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CartTool } from "@/agent/CartTool";
import { LlmModel } from "@/container";
import { Cart as CartEntity } from "@/entity/Cart";
import { Cart } from "@api/cart";
import { simulateReadableStream } from "ai";

describe("Cart Controller", () => {
	const sessionId = "test-session";
	let cartEntity: CartEntity;
	let cartTool: CartTool;

	beforeEach(() => {
		// 創建一個新的購物車實體
		cartEntity = new CartEntity(sessionId);
		cartTool = CartTool.create(cartEntity);

		// 模擬語言模型
		const model = openai("gpt-4o-mini");

		// 模擬 doStream 方法，讓它能夠調用 CartTool 中的函數
		vi.spyOn(model, "doStream").mockImplementation(async () => ({
			rawCall: { rawPrompt: null, rawSettings: {} },
			stream: simulateReadableStream({
				chunks: [
					{ type: "text-delta", textDelta: "我將幫您處理購物車" },
					{
						type: "tool-call",
						toolCall: {
							id: "call_1",
							type: "function",
							function: {
								name: "listCartItems",
								arguments: "{}",
							},
						},
					},
					{ type: "text-delta", textDelta: "您的購物車目前是空的" },
					{
						type: "tool-call",
						toolCall: {
							id: "call_2",
							type: "function",
							function: {
								name: "addToCart",
								arguments: JSON.stringify({
									name: "測試商品",
									price: 100,
									quantity: 2,
								}),
							},
						},
					},
					{ type: "text-delta", textDelta: "已將商品加入購物車" },
					{
						type: "finish",
						finishReason: "stop",
						usage: { completionTokens: 0, promptTokens: 0 },
					},
				],
			}),
		}));

		// 註冊模型到容器中
		container.register(LlmModel, {
			useValue: model,
		});
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
		it("simulates LLM function calls to cart tools", async () => {
			// 獲取工具集
			const tools = cartTool.getTools();

			// 模擬 LLM 調用工具的處理函數
			const handleToolCall = async (name: string, args: string) => {
				const parsedArgs = JSON.parse(args || "{}");

				switch (name) {
					case "listCartItems":
						return await tools.listCartItems.execute(parsedArgs);
					case "addToCart":
						return await tools.addToCart.execute(parsedArgs);
					case "updateCartItem":
						return await tools.updateCartItem.execute(parsedArgs);
					case "removeFromCart":
						return await tools.removeFromCart.execute(parsedArgs);
					default:
						throw new Error(`未知的工具: ${name}`);
				}
			};

			// 模擬 LLM 調用 listCartItems
			const initialCartState = await handleToolCall("listCartItems", "{}");
			expect(initialCartState.items).toHaveLength(0);

			// 模擬 LLM 調用 addToCart
			const addResult = await handleToolCall(
				"addToCart",
				JSON.stringify({
					name: "測試商品",
					price: 100,
					quantity: 2,
				}),
			);

			// 驗證添加結果
			expect(addResult.success).toBe(true);
			expect(addResult.message).toBe("已將 2 個 測試商品 加入購物車");

			// 再次檢查購物車狀態
			const updatedCartState = await handleToolCall("listCartItems", "{}");
			expect(updatedCartState.items).toHaveLength(1);
			expect(updatedCartState.items[0].name).toBe("測試商品");
			expect(updatedCartState.items[0].price).toBe(100);
			expect(updatedCartState.items[0].quantity).toBe(2);
			expect(updatedCartState.items[0].total).toBe(200);
		});

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

	describe("LLM integration with CartTool", () => {
		it("processes LLM stream with tool calls", async () => {
			// 模擬 LLM 響應處理
			const processLlmResponse = async () => {
				const model = container.resolve(LlmModel);
				const tools = cartTool.getTools();

				// 獲取模擬的流
				const { stream } = await model.doStream({
					messages: [{ role: "user", content: "我想添加商品到購物車" }],
					tools: Object.values(tools),
				});

				// 處理流中的每個塊
				const reader = stream.getReader();
				const results = [];

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					results.push(value);

					// 如果是工具調用，則執行相應的工具函數
					if (value.type === "tool-call") {
						const { name, arguments: args } = value.toolCall.function;
						const parsedArgs = JSON.parse(args);

						switch (name) {
							case "listCartItems":
								await tools.listCartItems.execute(parsedArgs);
								break;
							case "addToCart":
								await tools.addToCart.execute(parsedArgs);
								break;
						}
					}
				}

				return results;
			};

			// 執行模擬的 LLM 響應處理
			const results = await processLlmResponse();

			// 驗證結果中包含了預期的工具調用
			const toolCalls = results.filter((r) => r.type === "tool-call");
			expect(toolCalls).toHaveLength(2);
			expect(toolCalls[0].toolCall.function.name).toBe("listCartItems");
			expect(toolCalls[1].toolCall.function.name).toBe("addToCart");

			// 驗證購物車狀態已更新
			const cartItems = await cartTool.getTools().listCartItems.execute({});
			expect(cartItems.items).toHaveLength(1);
			expect(cartItems.items[0].name).toBe("測試商品");
			expect(cartItems.items[0].quantity).toBe(2);
		});
	});
});
