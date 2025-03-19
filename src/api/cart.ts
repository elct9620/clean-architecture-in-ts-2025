import { hc } from "hono/client";

import cart from "@controller/CartController";

const cartApi = hc<typeof cart>("/api/cart");

export interface CartItem {
	name: string;
	price: number;
	quantity: number;
}

export interface Cart {
	items: CartItem[];
}

export async function getCart(sessionId: string): Promise<Cart> {
	const res = await cartApi.index.$get({
		query: {
			sessionId,
		},
	});

	return (await res.json()) as Cart;
}
