import { FC } from "hono/jsx/dom";

export interface CartItemProps {
	id: string;
	name: string;
	price: number;
	quantity: number;
	image: string;
	onIncrement?: (id: string) => void;
	onDecrement?: (id: string) => void;
}

export const CartItem: FC<CartItemProps> = ({
	id,
	name,
	price,
	quantity,
	image,
	onIncrement,
	onDecrement,
}) => {
	return (
		<div className="flex border-b border-gray-100 pb-4">
			<img
				src={image}
				alt={name}
				className="w-20 h-20 object-cover rounded"
			/>
			<div className="ml-3 flex-1">
				<h3 className="font-medium">{name}</h3>
				<p className="text-gray-500">
					NT$ {price.toLocaleString()} x {quantity}
				</p>
				<div className="flex items-center mt-2">
					<button 
						className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center"
						onClick={() => onDecrement?.(id)}
					>
						-
					</button>
					<span className="mx-2">{quantity}</span>
					<button 
						className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center"
						onClick={() => onIncrement?.(id)}
					>
						+
					</button>
				</div>
			</div>
		</div>
	);
};
