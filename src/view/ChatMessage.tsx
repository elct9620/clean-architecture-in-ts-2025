import { FC, useEffect, useRef } from "hono/jsx/dom";
import { Message, Role } from "./types/Message";
import { LoadingAnimation } from "./LoadingAnimation";

interface ChatMessageProps {
	messages: Message[];
	loading?: boolean;
}

export const ChatMessage: FC<ChatMessageProps> = ({
	messages,
	loading = false,
}) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages, loading]);

	return (
		<div className="space-y-4">
			{messages.length === 0 ? (
				<div className="text-center py-10 text-gray-500">
					開始與 AI 助手對話吧！
				</div>
			) : (
				<>
					{messages.map((msg, index) => {
						return (
							<div
								key={index}
								className={`p-3 rounded-lg max-w-[80%] ${
									msg.role === Role.User
										? "ml-auto bg-blue-500 text-white"
										: "bg-white border border-gray-200 shadow-sm"
								}`}
							>
								<div className="whitespace-pre-wrap">
									{msg.role === Role.Assistant && msg.content === "" ? (
										<LoadingAnimation />
									) : (
										msg.content
									)}
								</div>
							</div>
						);
					})}
				</>
			)}
			<div ref={messagesEndRef} />
		</div>
	);
};
