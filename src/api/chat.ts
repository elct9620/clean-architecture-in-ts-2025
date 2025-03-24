import { hc } from "hono/client";

import chat from "@controller/ChatController";
import { readEvents } from "./sse";

const chatApi = hc<typeof chat>("/api/chat");

export type MessageData = {
	content: string;
};

export enum EventType {
	Message = "message",
	Refresh = "refresh",
}
export type RefreshData = {};
export type EventData = MessageData | RefreshData;
export type Event = {
	type: EventType;
	content?: string;
};

export interface Message {
	role: "user" | "assistant";
	content: string;
}

export interface Conversation {
	messages: Message[];
}

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

export async function getConversation(
	sessionId: string,
): Promise<Conversation> {
	const res = await chatApi[":id"].$get({
		param: {
			id: sessionId,
		},
	});

	return (await res.json()) as Conversation;
}
