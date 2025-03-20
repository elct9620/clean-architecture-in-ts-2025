import { CartDto } from "@/usecase/GetCart";
import { CartPresenter } from "@/usecase/interface";
import { Context } from "hono";

export class JsonCartPresenter implements CartPresenter {
	constructor(private readonly context: Context) {}

	async render(cart: CartDto): Promise<void> {
		this.context.status(200);
		this.context.header("Content-Type", "application/json");
		this.context.json(cart);
	}
}
