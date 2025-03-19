import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono<{ Bindings: Env }>();

// 模擬購物車數據
const mockCarts: Record<string, any> = {
	// 預設一些模擬數據
	"default-session": {
		items: [
			{
				name: "無線藍牙耳機",
				price: 1299,
				quantity: 1,
			},
			{
				name: "智慧手錶",
				price: 2499,
				quantity: 1,
			},
		],
	},
};

// 獲取購物車內容
app.get("/", async (c) => {
	const sessionId = c.req.query("sessionId") || "default-session";
	
	// 如果該 session 沒有購物車，創建一個空的
	if (!mockCarts[sessionId]) {
		mockCarts[sessionId] = { items: [] };
	}
	
	return c.json(mockCarts[sessionId]);
});

// 添加商品到購物車
const addItemSchema = z.object({
	sessionId: z.string(),
	name: z.string(),
	price: z.number(),
	quantity: z.number().int().positive(),
});

app.post("/add", zValidator("json", addItemSchema), async (c) => {
	const { sessionId, name, price, quantity } = c.req.valid("json");
	
	// 如果該 session 沒有購物車，創建一個空的
	if (!mockCarts[sessionId]) {
		mockCarts[sessionId] = { items: [] };
	}
	
	const cart = mockCarts[sessionId];
	const existingItemIndex = cart.items.findIndex((item: any) => item.name === name);
	
	if (existingItemIndex >= 0) {
		// 如果商品已存在，增加數量
		cart.items[existingItemIndex].quantity += quantity;
	} else {
		// 如果商品不存在，添加新商品
		cart.items.push({ name, price, quantity });
	}
	
	return c.json({ success: true, cart });
});

// 更新購物車商品數量
const updateItemSchema = z.object({
	sessionId: z.string(),
	name: z.string(),
	quantity: z.number().int().positive(),
});

app.post("/update", zValidator("json", updateItemSchema), async (c) => {
	const { sessionId, name, quantity } = c.req.valid("json");
	
	if (!mockCarts[sessionId]) {
		return c.json({ success: false, message: "購物車不存在" }, 404);
	}
	
	const cart = mockCarts[sessionId];
	const existingItemIndex = cart.items.findIndex((item: any) => item.name === name);
	
	if (existingItemIndex < 0) {
		return c.json({ success: false, message: "商品不存在" }, 404);
	}
	
	cart.items[existingItemIndex].quantity = quantity;
	
	return c.json({ success: true, cart });
});

// 從購物車移除商品
const removeItemSchema = z.object({
	sessionId: z.string(),
	name: z.string(),
});

app.post("/remove", zValidator("json", removeItemSchema), async (c) => {
	const { sessionId, name } = c.req.valid("json");
	
	if (!mockCarts[sessionId]) {
		return c.json({ success: false, message: "購物車不存在" }, 404);
	}
	
	const cart = mockCarts[sessionId];
	const existingItemIndex = cart.items.findIndex((item: any) => item.name === name);
	
	if (existingItemIndex < 0) {
		return c.json({ success: false, message: "商品不存在" }, 404);
	}
	
	cart.items.splice(existingItemIndex, 1);
	
	return c.json({ success: true, cart });
});

// 清空購物車
const clearCartSchema = z.object({
	sessionId: z.string(),
});

app.post("/clear", zValidator("json", clearCartSchema), async (c) => {
	const { sessionId } = c.req.valid("json");
	
	if (!mockCarts[sessionId]) {
		return c.json({ success: false, message: "購物車不存在" }, 404);
	}
	
	mockCarts[sessionId] = { items: [] };
	
	return c.json({ success: true, cart: mockCarts[sessionId] });
});

export default app;
