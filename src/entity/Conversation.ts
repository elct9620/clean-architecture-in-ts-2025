import { SessionId } from "@entity/Session";

export enum Role {
	User = "user",
	Assistant = "assistant",
}

export interface Message {
	role: Role;
	content: string;
}

export class Conversation {
	private _messages: Message[] = [];

	constructor(public readonly id: SessionId) {}

	get messages(): Message[] {
		return [...this._messages];
	}

	addMessage(role: Role, content: string) {
		this._messages = [...this._messages, { role, content }];
	}
}
