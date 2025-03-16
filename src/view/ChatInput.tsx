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
	);
};
