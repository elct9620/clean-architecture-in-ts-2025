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
		<form onSubmit={handleSubmit} className="flex gap-2">
			<input
				type="text"
				value={inputValue}
				onInput={(e) => setInputValue((e.target as HTMLInputElement).value)}
				placeholder="輸入訊息..."
				disabled={isLoading}
				className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			/>
			<button
				type="submit"
				disabled={isLoading}
				className={`px-4 py-2 rounded-full font-medium ${
					isLoading
						? "bg-gray-300 text-gray-500"
						: "bg-blue-500 text-white hover:bg-blue-600"
				}`}
			>
				{isLoading ? "發送中..." : "發送"}
			</button>
		</form>
	);
};
