import { FC } from "hono/jsx/dom";
import { CartItem } from "./CartItem";
import { useCart } from "./state/Cart";

export const CartSidebar: FC = () => {
	const { items, totalItems, totalPrice } = useCart();

	return (
		<div className="w-80 h-screen bg-white border-l border-gray-200 p-4 flex flex-col">
			<h2 className="text-xl font-bold mb-4">購物車 ({totalItems})</h2>

			<div className="flex-1 overflow-y-auto space-y-4">
				{items.length === 0 ? (
					<div className="text-center py-10 text-gray-500">
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

			<div className="border-t border-gray-200 pt-4 mt-4">
				<div className="flex justify-between mb-2">
					<span>小計</span>
					<span>NT$ {totalPrice.toLocaleString()}</span>
				</div>
				<div className="flex justify-between mb-4">
					<span>運費</span>
					<span>免費</span>
				</div>
				<div className="flex justify-between font-bold mb-4">
					<span>總計</span>
					<span>NT$ {totalPrice.toLocaleString()}</span>
				</div>
			</div>
		</div>
	);
};
