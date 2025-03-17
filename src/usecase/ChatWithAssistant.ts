import { Role } from "@/entity/Conversation";
import {
	ChatAgent,
	ConversationRepository,
	StreamingEventPresenter,
} from "./interface";

export class ChatWithAssistant {
	constructor(
		private readonly conversations: ConversationRepository,
		private readonly presenter: StreamingEventPresenter,
		private readonly agent: ChatAgent,
	) {}

	async execute(sessionId: string, content: string) {
		const conversation = await this.conversations.find(sessionId);
		conversation.addMessage(Role.User, content);

		const reply = await this.agent.chat(conversation.messages);

		let assistantMessage = "";
		for await (const chunk of reply) {
			assistantMessage += chunk;
			await this.presenter.messagePartial(chunk);
		}
		conversation.addMessage(Role.Assistant, assistantMessage);

		await this.conversations.save(conversation);
	}
}
