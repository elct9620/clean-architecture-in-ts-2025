import { FC, useEffect, useRef } from "hono/jsx/dom";
import { Message, Role } from "./types/Message";

interface ChatMessageProps {
	messages: Message[];
	loading?: boolean;
}

const LoadingAnimation: FC = () => {
	return (
		<div className="flex space-x-2">
			<div
				className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
				style={{ animationDelay: "0ms" }}
			></div>
			<div
				className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
				style={{ animationDelay: "150ms" }}
			></div>
			<div
				className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
				style={{ animationDelay: "300ms" }}
			></div>
		</div>
	);
};

export const ChatMessage: FC<ChatMessageProps> = ({
	messages,
	loading = false,
}) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// 當消息列表更新時，自動滾動到底部
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages, loading]);

	// 檢查是否需要顯示助手正在輸入的載入動畫
	const shouldShowLoading = loading && messages.length > 0 && messages[messages.length - 1].role === Role.User;

	// 創建一個新的消息數組，如果需要顯示載入動畫，則添加一個助手的空消息
	const displayMessages = shouldShowLoading
		? [...messages, { role: Role.Assistant, content: "" }]
		: messages;

	return (
		<div className="space-y-4">
			{displayMessages.length === 0 ? (
				<div className="text-center py-10 text-gray-500">
					開始與 AI 助手對話吧！
				</div>
			) : (
				<>
					{displayMessages.map((msg, index) => {
						const isLastAssistantMessage = shouldShowLoading && index === displayMessages.length - 1;
						
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
									{isLastAssistantMessage ? <LoadingAnimation /> : msg.content}
								</div>
							</div>
						);
					})}
				</>
			)}
			{/* 這個空的 div 用於滾動到底部的參考點 */}
			<div ref={messagesEndRef} />
		</div>
	);
};
