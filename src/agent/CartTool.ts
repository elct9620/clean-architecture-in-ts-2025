import { tool } from "ai";
import { z } from "zod";

import { Cart } from "@/entity/Cart";

export class CartTool {
	constructor(private readonly cart: Cart) {}

	static create(cart: Cart) {
		return new CartTool(cart);
	}

	getTools() {
		return {
			listCartItems: tool({
				description: "List all items in the cart",
				parameters: z.object({}),
				execute: async ({}) => {
					return {
						items: this.cart.items.map((item) => ({
							name: item.name,
							price: item.price,
							quantity: item.quantity,
							total: item.total,
						})),
						totalItems: this.cart.items.length,
						totalAmount: this.cart.items.reduce(
							(sum, item) => sum + item.total,
							0,
						),
					};
				},
			}),
			addToCart: tool({
				description: "Add a product to the cart",
				parameters: z.object({
					name: z.string().describe("The name of the product"),
					price: z.number().describe("The price of the product"),
					quantity: z.number().int().positive().describe("The quantity to add"),
				}),
				execute: async ({ name, price, quantity }) => {
					this.cart.addItem(name, price, quantity);
					return {
						success: true,
						message: `已將 ${quantity} 個 ${name} 加入購物車`,
					};
				},
			}),
			updateCartItem: tool({
				description: "Update the quantity of a product in the cart",
				parameters: z.object({
					name: z.string().describe("The name of the product"),
					quantity: z.number().int().positive().describe("The new quantity"),
				}),
				execute: async ({ name, quantity }) => {
					const existingItem = this.cart.items.find(
						(item) => item.name === name,
					);
					if (!existingItem) {
						return {
							success: false,
							message: `購物車中沒有 ${name}`,
						};
					}

					this.cart.updateItem(name, quantity);
					return {
						success: true,
						message: `已將 ${name} 的數量更新為 ${quantity}`,
					};
				},
			}),
			removeFromCart: tool({
				description: "Remove a product from the cart",
				parameters: z.object({
					name: z.string().describe("The name of the product"),
				}),
				execute: async ({ name }) => {
					const existingItem = this.cart.items.find(
						(item) => item.name === name,
					);
					if (!existingItem) {
						return {
							success: false,
							message: `購物車中沒有 ${name}`,
						};
					}

					this.cart.removeItem(name);
					return {
						success: true,
						message: `已從購物車中移除 ${name}`,
					};
				},
			}),
		};
	}
}
