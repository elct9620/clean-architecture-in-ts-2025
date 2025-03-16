import { CartSidebar } from "@view/CartSidebar";
import { Chat } from "@view/Chat";
import { FC } from "hono/jsx/dom";

import "@view/style.css";

export const App: FC = () => {
	return (
		<div className="flex w-full">
			<div className="flex-1">
				<Chat />
			</div>
			<CartSidebar />
		</div>
	);
};
