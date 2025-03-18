import { CartSidebar } from "@view/CartSidebar";
import { Chat } from "@view/Chat";
import { SessionContext, getOrCreateSessionId } from "@view/state/session";
import { FC } from "hono/jsx/dom";

import "@view/style.css";

export const App: FC = () => {
	const sessionId = getOrCreateSessionId();

	return (
		<SessionContext.Provider value={sessionId}>
			<div className="flex w-full">
				<div className="flex-1">
					<Chat />
				</div>
				<CartSidebar />
			</div>
		</SessionContext.Provider>
	);
};
