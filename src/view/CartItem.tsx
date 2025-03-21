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
			<div className="w-20 h-20 bg-background rounded-md overflow-hidden">
				<img src={image} alt={name} className="w-full h-full object-cover" />
			</div>
			<div className="ml-4 flex-1">
				<h3 className="font-medium text-text-primary">{name}</h3>
				<p className="text-text-secondary text-sm mt-1">
					NT$ {price.toLocaleString()} x {quantity}
				</p>
				<div className="mt-2 flex justify-between items-center">
					<span className="font-medium text-primary">
						NT$ {(price * quantity).toLocaleString()}
					</span>
					<div className="flex items-center space-x-1">
						<button className="w-6 h-6 flex items-center justify-center rounded-full bg-background text-text-primary hover:bg-gray-200 transition-colors">
							-
						</button>
						<span className="mx-1 text-sm">{quantity}</span>
						<button className="w-6 h-6 flex items-center justify-center rounded-full bg-background text-text-primary hover:bg-gray-200 transition-colors">
							+
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
