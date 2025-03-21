import { FC, useCallback, useState } from "hono/jsx/dom";

interface ChatInputProps {
	onSendMessage: (message: string) => Promise<void>;
	isLoading: boolean;
}

export const ChatInput: FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
	const [inputValue, setInputValue] = useState("");

	const handleSubmit = useCallback(
		async (e: Event) => {
			e.preventDefault();
			if (!inputValue.trim() || isLoading) return;

			try {
				await onSendMessage(inputValue);
			} finally {
				setInputValue("");
			}
		},
		[inputValue, isLoading, onSendMessage],
	);

	return (
		<form onSubmit={handleSubmit} className="flex gap-4">
			<input
				type="text"
				value={inputValue}
				onInput={(e) => setInputValue((e.target as HTMLInputElement).value)}
				placeholder="輸入訊息..."
				disabled={isLoading}
				className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary font-font-family-sans"
			/>
			<button
				type="submit"
				disabled={isLoading}
				className={`px-6 py-3 rounded-md font-font-weight-medium shadow-md ${
					isLoading
						? "bg-secondary text-card"
						: "bg-primary text-card hover:bg-opacity-90 transition-colors"
				}`}
			>
				{isLoading ? "發送中..." : "發送"}
			</button>
		</form>
	);
};
