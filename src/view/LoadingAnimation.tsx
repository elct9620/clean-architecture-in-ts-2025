import { FC } from "hono/jsx/dom";

export const LoadingAnimation: FC = () => {
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
