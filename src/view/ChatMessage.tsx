import { FC, useEffect, useRef } from "hono/jsx/dom";
import { Message, Role } from "./types/Message";

interface ChatMessageProps {
	messages: Message[];
	loading?: boolean;
}

const LoadingAnimation: FC = () => {
	return (
		<div className="flex space-x-2 p-3 rounded-lg bg-white border border-gray-200 shadow-sm max-w-[80%]">
			<div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
			<div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
			<div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
		</div>
	);
};

export const ChatMessage: FC<ChatMessageProps> = ({ messages, loading = false }) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// 當消息列表更新時，自動滾動到底部
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages, loading]);

	return (
		<div className="space-y-4">
			{messages.length === 0 && !loading ? (
				<div className="text-center py-10 text-gray-500">
					開始與 AI 助手對話吧！
				</div>
			) : (
				<>
					{messages.map((msg, index) => (
						<div
							key={index}
							className={`p-3 rounded-lg max-w-[80%] ${
								msg.role === Role.User
									? "ml-auto bg-blue-500 text-white"
									: "bg-white border border-gray-200 shadow-sm"
							}`}
						>
							<div className="whitespace-pre-wrap">{msg.content}</div>
						</div>
					))}
					{loading && <LoadingAnimation />}
				</>
			)}
			{/* 這個空的 div 用於滾動到底部的參考點 */}
			<div ref={messagesEndRef} />
		</div>
	);
};
