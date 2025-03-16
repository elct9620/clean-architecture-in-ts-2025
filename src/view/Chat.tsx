import { FC, useCallback, useReducer, useState } from "hono/jsx/dom";

import { chatWithAssistant } from "@api/chat";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

interface Message {
	role: "user" | "assistant";
	content: string;
}

function messagesReducer(
	state: Message[],
	action: { type: string; payload: any },
): Message[] {
	switch (action.type) {
		case "ADD_USER_MESSAGE":
			return [...state, { role: "user", content: action.payload }];
		case "ADD_ASSISTANT_MESSAGE":
			return [...state, { role: "assistant", content: "" }];
		case "UPDATE_LAST_MESSAGE":
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
	message: string,
	dispatcher: (type: string, payload: any) => void,
) {
	dispatcher("ADD_USER_MESSAGE", message);
	dispatcher("ADD_ASSISTANT_MESSAGE", "");

	const events = chatWithAssistant("1", message);
	for await (const event of events) {
		dispatcher("UPDATE_LAST_MESSAGE", event.content);
	}
}

export const Chat: FC = () => {
	const [messages, dispatch] = useReducer(messagesReducer, []);
	const [isLoading, setIsLoading] = useState(false);

	const handleMessageDispatch = useCallback(
		(type: string, payload: any) => {
			dispatch({ type, payload });
		},
		[dispatch],
	);

	const handleSendMessage = useCallback(
		async (message: string) => {
			setIsLoading(true);
			try {
				await doChat(message, handleMessageDispatch);
			} finally {
				setIsLoading(false);
			}
		},
		[handleMessageDispatch],
	);

	return (
		<div className="flex flex-col h-screen bg-gray-100">
			<div className="flex-1 overflow-y-auto p-4">
				<ChatMessage messages={messages} />
			</div>
			<div className="border-t border-gray-200 p-4 bg-white">
				<ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
			</div>
		</div>
	);
};
