import { FC } from "hono/jsx/dom";

export interface CartItemProps {
	id: string;
	name: string;
	price: number;
	quantity: number;
	image: string;
}

export const CartItem: FC<CartItemProps> = ({
	id,
	name,
	price,
	quantity,
	image,
}) => {
	return (
		<div className="flex border-b border-gray-100 pb-4">
			<img src={image} alt={name} className="w-20 h-20 object-cover rounded" />
			<div className="ml-3 flex-1">
				<h3 className="font-medium">{name}</h3>
				<p className="text-gray-500">
					NT$ {price.toLocaleString()} x {quantity}
				</p>
			</div>
		</div>
	);
};
