import { FC } from "hono/jsx/dom";

interface Message {
	role: "user" | "assistant";
	content: string;
}

interface ChatMessageProps {
	messages: Message[];
}

export const ChatMessage: FC<ChatMessageProps> = ({ messages }) => {
	return (
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
	);
};
