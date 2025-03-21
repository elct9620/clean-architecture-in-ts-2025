import { FC, useEffect, useRef } from "hono/jsx/dom";
import { LoadingAnimation } from "./LoadingAnimation";
import { Message, Role } from "./types/Message";

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
		<div className="space-y-6">
			{messages.length === 0 ? (
				<div className="text-center py-10 text-text-secondary font-font-family-sans">
					開始與 AI 助手對話吧！
				</div>
			) : (
				<>
					{messages.map((msg, index) => {
						return (
							<div
								key={index}
								className={`p-4 rounded-md max-w-[80%] shadow-md ${
									msg.role === Role.User
										? "ml-auto bg-primary text-card"
										: "bg-card border border-gray-200"
								}`}
							>
								<div className="whitespace-pre-wrap font-font-family-sans leading-normal">
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
