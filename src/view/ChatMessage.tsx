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
		<div className="space-y-4">
			{messages.length === 0 ? (
				<div className="text-center py-10 text-gray-500">
					開始與 AI 助手對話吧！
				</div>
			) : (
				messages.map((msg, index) => (
					<div
						key={index}
						className={`p-3 rounded-lg max-w-[80%] ${
							msg.role === "user"
								? "ml-auto bg-blue-500 text-white"
								: "bg-white border border-gray-200 shadow-sm"
						}`}
					>
						<div className="whitespace-pre-wrap">{msg.content}</div>
					</div>
				))
			)}
		</div>
	);
};
