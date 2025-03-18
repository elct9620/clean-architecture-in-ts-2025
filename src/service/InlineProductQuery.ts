import { injectable } from "tsyringe-neo";

import { Product } from "@/entity/Product";
import { ProductQuery } from "@/usecase/interface";

@injectable()
export class InlineProductQuery implements ProductQuery {
	private products: Product[] = [
		new Product("p001", "藍牙耳機", 1299, "https://placehold.co/300x300"),
		new Product("p002", "智慧手錶", 2499, "https://placehold.co/300x300"),
		new Product("p003", "隨身充", 799, "https://placehold.co/300x300"),
		new Product("p004", "機械鍵盤", 1899, "https://placehold.co/300x300"),
		new Product("p005", "無線滑鼠", 699, "https://placehold.co/300x300"),
		new Product(
			"p006",
			"筆記型電腦散熱墊",
			599,
			"https://placehold.co/300x300",
		),
		new Product("p007", "網路攝影機", 1299, "https://placehold.co/300x300"),
		new Product("p008", "智慧音響", 1999, "https://placehold.co/300x300"),
		new Product("p009", "防水藍牙喇叭", 1499, "https://placehold.co/300x300"),
		new Product("p010", "快速充電器", 599, "https://placehold.co/300x300"),
	];

	async execute(query: string): Promise<Product[]> {
		if (!query || query === "") {
			return this.products;
		}

		// 搜尋產品名稱包含查詢字串的產品
		return this.products.filter((product) =>
			product.name.toLowerCase().includes(query.toLowerCase()),
		);
	}
}
