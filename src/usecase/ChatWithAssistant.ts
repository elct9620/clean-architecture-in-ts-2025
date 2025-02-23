import { Role } from "@/entity/Conversation";
import { ConversationRepository } from "./interface";

export class ChatWithAssistant {
	constructor(private readonly conversations: ConversationRepository) {}

	async execute(sessionId: string, content: string) {
		const conversation = await this.conversations.find(sessionId);
		conversation.addMessage(Role.User, content);
		await this.conversations.save(conversation);
	}
}
