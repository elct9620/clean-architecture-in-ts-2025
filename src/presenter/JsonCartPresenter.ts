import { Cart } from "@/entity/Cart";
import { CartPresenter } from "@/usecase/interface";

export class JsonCartPresenter implements CartPresenter {
	private cart?: Cart;

	async setCart(cart: Cart): Promise<void> {
		this.cart = cart;
	}

	async render() {
		if (!this.cart) {
			return {
				items: [],
			};
		}

		return {
			items: this.cart.items.map((item) => ({
				name: item.name,
				price: item.price,
				quantity: item.quantity,
			})),
		};
	}
}
