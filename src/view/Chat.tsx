import { FC, useCallback, useReducer, useState } from "hono/jsx/dom";

import { chatWithAssistant, EventType } from "@api/chat";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { useCart } from "./state/cart";
import { useSession } from "./state/session";
import { ActionType, Message, Role } from "./types/Message";

function messagesReducer(
	state: Message[],
	action: { type: ActionType; payload: any },
): Message[] {
	switch (action.type) {
		case ActionType.AddUserMessage:
			return [...state, { role: Role.User, content: action.payload }];
		case ActionType.AddAssistantMessage:
			return [...state, { role: Role.Assistant, content: "" }];
		case ActionType.UpdateLastMessage:
			return state.map((msg, index) =>
				index === state.length - 1
					? { ...msg, content: msg.content + action.payload }
					: msg,
			);
		default:
			return state;
	}
}

async function doChat(
	sessionId: string,
	message: string,
	dispatcher: (type: ActionType, payload: any) => void,
	refreshCart: () => Promise<void>,
) {
	dispatcher(ActionType.AddUserMessage, message);
	dispatcher(ActionType.AddAssistantMessage, "");

	const events = chatWithAssistant(sessionId, message);
	for await (const event of events) {
		if (event.type === EventType.Message && event.content) {
			dispatcher(ActionType.UpdateLastMessage, event.content);
		} else if (event.type === EventType.Refresh) {
			await refreshCart();
		}
	}
}

export const Chat: FC = () => {
	const sessionId = useSession();
	const { refresh: refreshCart } = useCart();
	const [messages, dispatch] = useReducer(messagesReducer, []);
	const [isLoading, setIsLoading] = useState(false);

	const handleMessageDispatch = useCallback(
		(type: ActionType, payload: any) => {
			dispatch({ type, payload });
		},
		[dispatch],
	);

	const handleSendMessage = useCallback(
		async (message: string) => {
			setIsLoading(true);
			try {
				await doChat(sessionId, message, handleMessageDispatch, refreshCart);
			} finally {
				setIsLoading(false);
			}
		},
		[sessionId, handleMessageDispatch, refreshCart],
	);

	return (
		<div className="flex flex-col h-screen bg-gray-100">
			<div className="bg-white p-2 border-b border-gray-200 text-xs text-gray-500 flex justify-end">
				<span>Session ID: {sessionId}</span>
			</div>
			<div className="flex-1 overflow-y-auto p-4">
				<ChatMessage messages={messages} />
			</div>
			<div className="border-t border-gray-200 p-4 bg-white">
				<ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
			</div>
		</div>
	);
};
