import { Cart } from "@/entity/Cart";
import { CartPresenter, CartRepository } from "./interface";

export class GetCart {
	constructor(
		private readonly carts: CartRepository,
		private readonly presenter: CartPresenter,
	) {}

	async execute(sessionId: string): Promise<void> {
		const cart = await this.carts.find(sessionId);
		await this.presenter.render(cart);
	}
}
