import { CartSidebar } from "@view/CartSidebar";
import { Chat } from "@view/Chat";
import { CartContext, useCartProvider } from "@view/state/Cart";
import { SessionContext, getOrCreateSessionId } from "@view/state/session";
import { FC } from "hono/jsx/dom";

import "@view/style.css";

export const App: FC = () => {
	const sessionId = getOrCreateSessionId();
	const cartState = useCartProvider();

	return (
		<SessionContext.Provider value={sessionId}>
			<CartContext.Provider value={cartState}>
				<div className="flex w-full">
					<div className="flex-1">
						<Chat />
					</div>
					<CartSidebar />
				</div>
			</CartContext.Provider>
		</SessionContext.Provider>
	);
};
