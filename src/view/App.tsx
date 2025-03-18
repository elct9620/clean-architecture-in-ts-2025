import { CartSidebar } from "@view/CartSidebar";
import { Chat } from "@view/Chat";
import { SessionContext } from "@view/state/session";
import { FC } from "hono/jsx/dom";

import "@view/style.css";

export const App: FC = () => {
	// 為整個應用程序提供 SessionContext
	const sessionId = crypto.randomUUID();

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
