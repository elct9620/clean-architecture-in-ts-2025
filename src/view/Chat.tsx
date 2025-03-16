import { FC, useCallback, useEffect, useReducer } from "hono/jsx/dom";

import { chatWithAssistant } from "@api/chat";

function concatMessage(prev: string, next: string): string {
	return prev + next;
}

async function doChat(dispatcher: (message: string) => void) {
	const events = chatWithAssistant("1", "Hello, world!");
	for await (const event of events) {
		dispatcher(event.content);
	}
}

export const Chat: FC = () => {
	const [message, dispatchMessage] = useReducer(concatMessage, "");

	const onMessage = useCallback(
		(message: string) => {
			dispatchMessage(message);
		},
		[dispatchMessage],
	);

	useEffect(() => {
		doChat(onMessage);
	}, [onMessage]);

	return <div>{message}</div>;
};
