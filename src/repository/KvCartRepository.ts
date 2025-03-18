import { inject, injectable } from "tsyringe-neo";

import { KvStore } from "@/container";
import { Cart, CartItem } from "@/entity/Cart";
import { CartRepository } from "@/usecase/interface";
import { SessionId } from "@entity/Session";

interface CartSchema {
	id: string;
	items: Array<{
		name: string;
		price: number;
		quantity: number;
	}>;
}

@injectable()
export class KvCartRepository implements CartRepository {
	constructor(@inject(KvStore) private readonly kv: KVNamespace) {}

	async find(sessionId: SessionId): Promise<Cart> {
		const key = `cart:${sessionId}`;
		const data = await this.kv.get<CartSchema>(key, "json");
		if (!data) {
			return new Cart(sessionId);
		}
		const cart = new Cart(sessionId);
		for (const item of data.items) {
			cart.addItem(item.name, item.price, item.quantity);
		}
		return cart;
	}

	async save(cart: Cart): Promise<void> {
		const key = `cart:${cart.id}`;
		const schema: CartSchema = {
			id: cart.id,
			items: cart.items.map((item) => ({
				name: item.name,
				price: item.price,
				quantity: item.quantity,
			})),
		};
		// 設置購物車在 1 小時後過期 (3600 秒)
		await this.kv.put(key, JSON.stringify(schema), { expirationTtl: 3600 });
	}
}
