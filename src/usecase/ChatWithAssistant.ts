import { Role } from "@/entity/Conversation";
import { ConversationRepository, StreamingEventPresenter } from "./interface";

export class ChatWithAssistant {
	constructor(
		private readonly conversations: ConversationRepository,
		private readonly presenter: StreamingEventPresenter,
	) {}

	async execute(sessionId: string, content: string) {
		const conversation = await this.conversations.find(sessionId);
		conversation.addMessage(Role.User, content);

		this.presenter.emit("message", { content: "Hello World" });

		await this.conversations.save(conversation);
	}
}
