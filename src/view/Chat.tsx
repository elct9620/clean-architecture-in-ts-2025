import { FC, useCallback, useReducer, useState } from "hono/jsx/dom";

import { chatWithAssistant } from "@api/chat";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
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
) {
	dispatcher(ActionType.AddUserMessage, message);
	dispatcher(ActionType.AddAssistantMessage, "");

	const events = chatWithAssistant(sessionId, message);
	for await (const event of events) {
		dispatcher(ActionType.UpdateLastMessage, event.content);
	}
}

export const Chat: FC = () => {
	const sessionId = useSession();
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
				await doChat(sessionId, message, handleMessageDispatch);
			} finally {
				setIsLoading(false);
			}
		},
		[sessionId, handleMessageDispatch],
	);

	return (
		<div className="flex flex-col h-screen bg-gray-100">
			<div className="bg-white p-2 border-b border-gray-200 text-xs text-gray-500 flex justify-end">
				<span>會話 ID: {sessionId.substring(0, 8)}...</span>
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
