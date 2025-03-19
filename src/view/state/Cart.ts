import { createContext, useContext, useState } from "hono/jsx/dom";

export interface CartItem {
	id: string;
	name: string;
	price: number;
	quantity: number;
	image: string;
}

export interface CartContextType {
	items: CartItem[];
	addItem: (item: CartItem) => void;
	updateQuantity: (id: string, quantity: number) => void;
	removeItem: (id: string) => void;
	clearCart: () => void;
	totalItems: number;
	totalPrice: number;
}

const defaultCartContext: CartContextType = {
	items: [],
	addItem: () => {},
	updateQuantity: () => {},
	removeItem: () => {},
	clearCart: () => {},
	totalItems: 0,
	totalPrice: 0,
};

export const CartContext = createContext<CartContextType>(defaultCartContext);

export function useCart(): CartContextType {
	return useContext(CartContext);
}

export function useCartProvider(): CartContextType {
	const [items, setItems] = useState<CartItem[]>([]);

	const addItem = (newItem: CartItem) => {
		setItems((currentItems) => {
			// 檢查商品是否已存在於購物車
			const existingItemIndex = currentItems.findIndex(
				(item) => item.id === newItem.id
			);

			if (existingItemIndex >= 0) {
				// 如果商品已存在，增加數量
				const updatedItems = [...currentItems];
				updatedItems[existingItemIndex] = {
					...updatedItems[existingItemIndex],
					quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
				};
				return updatedItems;
			} else {
				// 如果商品不存在，添加新商品
				return [...currentItems, newItem];
			}
		});
	};

	const updateQuantity = (id: string, quantity: number) => {
		setItems((currentItems) =>
			currentItems.map((item) =>
				item.id === id ? { ...item, quantity } : item
			)
		);
	};

	const removeItem = (id: string) => {
		setItems((currentItems) =>
			currentItems.filter((item) => item.id !== id)
		);
	};

	const clearCart = () => {
		setItems([]);
	};

	// 計算購物車總數量
	const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

	// 計算購物車總價格
	const totalPrice = items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);

	return {
		items,
		addItem,
		updateQuantity,
		removeItem,
		clearCart,
		totalItems,
		totalPrice,
	};
}
