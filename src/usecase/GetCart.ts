import { Cart, CartItem } from "@/entity/Cart";
import { CartRepository, CartPresenter } from "./interface";

// 定義輸出數據結構
export interface CartItemDto {
	name: string;
	price: number;
	quantity: number;
}

export interface CartDto {
	items: CartItemDto[];
}

export class GetCart {
	constructor(
		private readonly carts: CartRepository,
		private readonly presenter: CartPresenter
	) {}

	async execute(sessionId: string): Promise<void> {
		const cart = await this.carts.find(sessionId);
		const cartDto = this.toDto(cart);
		await this.presenter.render(cartDto);
	}

	private toDto(cart: Cart): CartDto {
		return {
			items: cart.items.map(this.toItemDto),
		};
	}

	private toItemDto(item: CartItem): CartItemDto {
		return {
			name: item.name,
			price: item.price,
			quantity: item.quantity,
		};
	}
}
