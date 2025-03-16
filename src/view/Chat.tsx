import { FC, useCallback, useReducer, useState } from "hono/jsx/dom";

import { chatWithAssistant } from "@api/chat";

interface Message {
	role: "user" | "assistant";
	content: string;
}

function messagesReducer(
	state: Message[],
	action: { type: string; payload: any },
) {
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
	const [inputValue, setInputValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleMessageDispatch = useCallback(
		(type: string, payload: any) => {
			dispatch({ type, payload });
		},
		[dispatch],
	);

	const handleSubmit = useCallback(
		async (e: Event) => {
			e.preventDefault();
			if (!inputValue.trim() || isLoading) return;

			setIsLoading(true);
			try {
				await doChat(inputValue, handleMessageDispatch);
			} finally {
				setInputValue("");
				setIsLoading(false);
			}
		},
		[inputValue, isLoading, handleMessageDispatch],
	);

	return (
		<div class="chat-container">
			<div class="messages-container">
				{messages.length === 0 ? (
					<div class="empty-state">開始與 AI 助手對話吧！</div>
				) : (
					messages.map((msg, index) => (
						<div key={index} class={`message ${msg.role}`}>
							<div class="message-content">{msg.content}</div>
						</div>
					))
				)}
			</div>

			<form onSubmit={handleSubmit} class="input-form">
				<input
					type="text"
					value={inputValue}
					onInput={(e) => setInputValue((e.target as HTMLInputElement).value)}
					placeholder="輸入訊息..."
					disabled={isLoading}
					class="message-input"
				/>
				<button type="submit" disabled={isLoading} class="send-button">
					{isLoading ? "發送中..." : "發送"}
				</button>
			</form>
		</div>
	);
};
