import { Hono } from "hono";

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

const app = new Hono<{ Bindings: Env }>();

// 鏈式路由定義
const routes = app.get("/", async (c) => {
	const sessionId = c.req.query("sessionId") || "default-session";

	// 如果該 session 沒有購物車，創建一個空的
	if (!mockCarts[sessionId]) {
		mockCarts[sessionId] = { items: [] };
	}

	return c.json(mockCarts[sessionId]);
});

export default routes;
