import { tool } from "ai";
import { z } from "zod";

import { ProductQuery } from "@/usecase/interface";

export const createListProductsTool = (productQuery: ProductQuery) =>
	tool({
		description: "List all available products",
		parameters: z.object({}),
		execute: async ({}) => {
			return {
				products: (await productQuery.execute("")).map((p) => ({
					name: p.name,
					price: p.price,
				})),
			};
		},
	});

export const createSearchProductsTool = (productQuery: ProductQuery) =>
	tool({
		description: "Search products by name",
		parameters: z.object({
			query: z.string().describe("The search query for products"),
		}),
		execute: async ({ query }) => {
			return {
				products: (await productQuery.execute(query)).map((p) => ({
					name: p.name,
					price: p.price,
				})),
			};
		},
	});

export const createProductTools = (productQuery: ProductQuery) => ({
	listProducts: createListProductsTool(productQuery),
	searchProducts: createSearchProductsTool(productQuery),
});
