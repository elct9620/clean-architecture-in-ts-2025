import { FC } from "hono/jsx/dom";
import { CartItem } from "./CartItem";
import { useCart } from "./state/cart";

export const CartSidebar: FC = () => {
	const { items, totalItems, totalPrice, loading, refresh } = useCart();

	return (
		<div className="w-80 h-screen bg-card border-l border-gray-200 p-6 flex flex-col shadow-md">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-bold text-text-primary">
					購物車 ({totalItems})
				</h2>
				<button
					onClick={() => refresh()}
					className="text-primary hover:text-opacity-80 transition-colors"
					aria-label="重新整理購物車"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					</svg>
				</button>
			</div>

			<div className="flex-1 overflow-y-auto space-y-6 pr-2">
				{loading ? (
					<div className="text-center py-10 text-text-secondary">載入中...</div>
				) : items.length === 0 ? (
					<div className="text-center py-10 text-text-secondary">
						購物車是空的
					</div>
				) : (
					items.map((item) => (
						<CartItem
							key={item.id}
							id={item.id}
							name={item.name}
							price={item.price}
							quantity={item.quantity}
							image={item.image}
						/>
					))
				)}
			</div>

			<div className="border-t border-gray-200 pt-6 mt-4">
				<div className="flex justify-between mb-3 text-text-secondary">
					<span>小計</span>
					<span>NT$ {totalPrice.toLocaleString()}</span>
				</div>
				<div className="flex justify-between mb-4 text-text-secondary">
					<span>運費</span>
					<span>免費</span>
				</div>
				<div className="flex justify-between font-bold mb-6 text-text-primary">
					<span>總計</span>
					<span>NT$ {totalPrice.toLocaleString()}</span>
				</div>

				<button
					className="w-full py-3 bg-primary text-white rounded-md font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={items.length === 0 || loading}
				>
					前往結帳
				</button>
			</div>
		</div>
	);
};
