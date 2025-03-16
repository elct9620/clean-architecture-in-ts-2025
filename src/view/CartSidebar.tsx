import { FC } from "hono/jsx/dom";

interface CartItem {
	id: string;
	name: string;
	price: number;
	quantity: number;
	image: string;
}

export const CartSidebar: FC = () => {
	// 模擬購物車數據
	const cartItems: CartItem[] = [
		{
			id: "1",
			name: "無線藍牙耳機",
			price: 1299,
			quantity: 1,
			image: "https://placehold.co/80x80",
		},
		{
			id: "2",
			name: "智能手錶",
			price: 2499,
			quantity: 1,
			image: "https://placehold.co/80x80",
		},
		{
			id: "3",
			name: "便攜式充電寶",
			price: 799,
			quantity: 2,
			image: "https://placehold.co/80x80",
		},
	];

	const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
	const totalPrice = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	return (
		<div className="w-80 h-screen bg-white border-l border-gray-200 p-4 flex flex-col">
			<h2 className="text-xl font-bold mb-4">購物車 ({totalItems})</h2>
			
			<div className="flex-1 overflow-y-auto space-y-4">
				{cartItems.map((item) => (
					<div key={item.id} className="flex border-b border-gray-100 pb-4">
						<img
							src={item.image}
							alt={item.name}
							className="w-20 h-20 object-cover rounded"
						/>
						<div className="ml-3 flex-1">
							<h3 className="font-medium">{item.name}</h3>
							<p className="text-gray-500">
								NT$ {item.price.toLocaleString()} x {item.quantity}
							</p>
							<div className="flex items-center mt-2">
								<button className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
									-
								</button>
								<span className="mx-2">{item.quantity}</span>
								<button className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
									+
								</button>
							</div>
						</div>
					</div>
				))}
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
				<button className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600">
					結帳
				</button>
			</div>
		</div>
	);
};
