import { Cart } from "@/entity/Cart";
import { CartPresenter } from "@/usecase/interface";
import { Context } from "hono";

export class JsonCartPresenter implements CartPresenter {
	constructor(private readonly context: Context) {}

	async render(cart: Cart): Promise<void> {
		// 將 Cart 實體轉換為適合 JSON 響應的格式
		const response = {
			items: cart.items.map((item) => ({
				name: item.name,
				price: item.price,
				quantity: item.quantity,
			})),
		};

		this.context.status(200);
		this.context.header("Content-Type", "application/json");
		this.context.json(response);
	}
}
