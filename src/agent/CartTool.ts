import { tool } from "ai";
import { z } from "zod";

import { Cart } from "@/entity/Cart";
import { ProductQuery } from "@/usecase/interface";

export const createListCartItemsTool = (cart: Cart) =>
	tool({
		description: "List all items in the cart",
		parameters: z.object({}),
		execute: async ({}) => {
			return {
				items: cart.items.map((item) => ({
					name: item.name,
					price: item.price,
					quantity: item.quantity,
					total: item.total,
				})),
				totalItems: cart.items.length,
				totalAmount: cart.items.reduce((sum, item) => sum + item.total, 0),
			};
		},
	});

export const createAddToCartTool = (cart: Cart, productQuery: ProductQuery) =>
	tool({
		description: "Add a product to the cart",
		parameters: z.object({
			name: z.string().describe("The name of the product"),
			quantity: z.number().int().positive().describe("The quantity to add"),
		}),
		execute: async ({ name, quantity }) => {
			// 查詢商品以獲取正確的價格
			const products = await productQuery.execute(name);
			const product = products.find((p) => p.name === name);
			
			if (!product) {
				return {
					success: false,
					message: `找不到商品 ${name}`,
				};
			}
			
			cart.addItem(name, product.price, quantity);
			return {
				success: true,
				message: `已將 ${quantity} 個 ${name} 加入購物車`,
			};
		},
	});

export const createUpdateCartItemTool = (cart: Cart) =>
	tool({
		description: "Update the quantity of a product in the cart",
		parameters: z.object({
			name: z.string().describe("The name of the product"),
			quantity: z.number().int().positive().describe("The new quantity"),
		}),
		execute: async ({ name, quantity }) => {
			const existingItem = cart.items.find((item) => item.name === name);
			if (!existingItem) {
				return {
					success: false,
					message: `購物車中沒有 ${name}`,
				};
			}

			cart.updateItem(name, quantity);
			return {
				success: true,
				message: `已將 ${name} 的數量更新為 ${quantity}`,
			};
		},
	});

export const createRemoveFromCartTool = (cart: Cart) =>
	tool({
		description: "Remove a product from the cart",
		parameters: z.object({
			name: z.string().describe("The name of the product"),
		}),
		execute: async ({ name }) => {
			const existingItem = cart.items.find((item) => item.name === name);
			if (!existingItem) {
				return {
					success: false,
					message: `購物車中沒有 ${name}`,
				};
			}

			cart.removeItem(name);
			return {
				success: true,
				message: `已從購物車中移除 ${name}`,
			};
		},
	});

export const createCartTools = (cart: Cart, productQuery: ProductQuery) => ({
	listCartItems: createListCartItemsTool(cart),
	addToCart: createAddToCartTool(cart, productQuery),
	updateCartItem: createUpdateCartItemTool(cart),
	removeFromCart: createRemoveFromCartTool(cart),
});
