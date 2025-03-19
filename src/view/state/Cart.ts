import { CartItem as ApiCartItem, getCart } from "@api/cart";
import { createContext, useContext, useEffect, useState } from "hono/jsx/dom";
import { useSession } from "./session";

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
	refresh: () => Promise<void>;
	loading: boolean;
	totalItems: number;
	totalPrice: number;
}

const defaultCartContext: CartContextType = {
	items: [],
	addItem: () => {},
	updateQuantity: () => {},
	removeItem: () => {},
	clearCart: () => {},
	refresh: async () => {},
	loading: false,
	totalItems: 0,
	totalPrice: 0,
};

export const CartContext = createContext<CartContextType>(defaultCartContext);

export function useCart(): CartContextType {
	return useContext(CartContext);
}

export function useCartProvider(): CartContextType {
	const sessionId = useSession();
	const [items, setItems] = useState<CartItem[]>([]);
	const [loading, setLoading] = useState(false);

	// 從 API 加載購物車項目的函數
	const refresh = async () => {
		setLoading(true);
		try {
			const cartData = await getCart(sessionId);

			// 將 API 返回的購物車項目轉換為本地格式
			// 注意：API 返回的項目可能沒有 id 和 image，這裡我們使用名稱作為 id，並使用預設圖片
			const convertedItems: CartItem[] = cartData.items.map(
				(item: ApiCartItem) => ({
					id: item.name, // 使用名稱作為 ID
					name: item.name,
					price: item.price,
					quantity: item.quantity,
					image: "https://placehold.co/80x80", // 使用預設圖片
				}),
			);

			setItems(convertedItems);
		} catch (error) {
			console.error("Failed to load cart:", error);
		} finally {
			setLoading(false);
		}
	};

	// 組件掛載時加載購物車
	useEffect(() => {
		refresh();
	}, [sessionId]);

	const addItem = (newItem: CartItem) => {
		setItems((currentItems) => {
			// 檢查商品是否已存在於購物車
			const existingItemIndex = currentItems.findIndex(
				(item) => item.id === newItem.id,
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
				item.id === id ? { ...item, quantity } : item,
			),
		);
	};

	const removeItem = (id: string) => {
		setItems((currentItems) => currentItems.filter((item) => item.id !== id));
	};

	const clearCart = () => {
		setItems([]);
	};

	// 計算購物車總數量
	const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

	// 計算購物車總價格
	const totalPrice = items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	return {
		items,
		addItem,
		updateQuantity,
		removeItem,
		clearCart,
		refresh,
		loading,
		totalItems,
		totalPrice,
	};
}
