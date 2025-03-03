import { hc } from "hono/client";

import chat from "@controller/ChatController";
import { readEvents } from "./sse";

const chatApi = hc<typeof chat>("/api/chat");

export type MessageData = {
	content: string;
};

export enum EventType {
	Message = "message",
}
export type EventData = MessageData;
export type Event = {
	type: EventType;
} & EventData;

export async function* chatWithAssistant(
	sessionId: string,
	content: string,
): AsyncGenerator<Event> {
	const res = await chatApi.index.$post({
		json: {
			sessionId,
			content,
		},
	});

	const events = readEvents(res.body!);

	for await (const event of events) {
		yield {
			type: event.event,
			...JSON.parse(event.data),
		};
	}
}
