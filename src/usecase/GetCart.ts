import { Cart } from "@/entity/Cart";
import { CartRepository } from "./interface";

export class GetCart {
	constructor(private readonly carts: CartRepository) {}

	async execute(sessionId: string): Promise<Cart> {
		const cart = await this.carts.find(sessionId);
		return cart;
	}
}
