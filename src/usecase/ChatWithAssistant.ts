import { Conversation, Role } from "@/entity/Conversation";

export class ChatWithAssistant {
	async execute(sessionId: string, content: string) {
		const conversation = new Conversation(sessionId);
		conversation.addMessage(Role.User, content);
	}
}
