import { FC, useCallback, useEffect, useReducer, useState } from "hono/jsx/dom";

import { chatWithAssistant, EventType, getConversation } from "@api/chat";
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
	const [isInitializing, setIsInitializing] = useState(true);

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

	// 在頁面加載時獲取對話歷史
	useEffect(() => {
		async function loadConversation() {
			try {
				const conversation = await getConversation(sessionId);

				// 將歷史消息添加到狀態中
				if (conversation.messages.length > 0) {
					conversation.messages.forEach((msg) => {
						dispatch({
							type:
								msg.role === Role.User
									? ActionType.AddUserMessage
									: ActionType.AddAssistantMessage,
							payload: msg.content,
						});
					});
				}
			} catch (error) {
				console.error("Failed to load conversation:", error);
			} finally {
				setIsInitializing(false);
			}
		}

		loadConversation();
	}, [sessionId]);

	return (
		<div className="flex flex-col h-screen bg-background font-font-family-sans">
			<div className="bg-card p-3 border-b border-gray-200 text-xs text-text-secondary flex justify-end">
				<span>Session ID: {sessionId}</span>
			</div>
			<div className="flex-1 overflow-y-auto p-6">
				<ChatMessage
					messages={messages}
					loading={isLoading || isInitializing}
				/>
			</div>
			<div className="border-t border-gray-200 p-6 bg-card shadow-md">
				<ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
			</div>
		</div>
	);
};
