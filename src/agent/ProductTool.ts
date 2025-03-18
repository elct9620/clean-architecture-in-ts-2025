import { tool } from "ai";
import { z } from "zod";

import { ProductQuery } from "@/usecase/interface";

export class ProductTool {
	constructor(private readonly productQuery: ProductQuery) {}

	static create(productQuery: ProductQuery) {
		return new ProductTool(productQuery);
	}

	getTools() {
		return {
			listProduct: tool({
				description: "List products by name",
				parameters: z.object({}),
				execute: async ({}) => {
					return {
						products: (await this.productQuery.execute("")).map((p) => ({
							name: p.name,
							price: p.price,
						})),
					};
				},
			}),
			searchProduct: tool({
				description: "Search products by name",
				parameters: z.object({
					query: z.string(),
				}),
				execute: async ({ query }) => {
					return {
						products: (await this.productQuery.execute(query)).map((p) => ({
							name: p.name,
							price: p.price,
						})),
					};
				},
			}),
		};
	}
}
