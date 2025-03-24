import { ConversationPresenter, ConversationRepository } from "./interface";

export class GetChat {
	constructor(
		private readonly conversations: ConversationRepository,
		private readonly presenter: ConversationPresenter,
	) {}

	async execute(sessionId: string): Promise<void> {
		const conversation = await this.conversations.find(sessionId);

		for (const message of conversation.messages) {
			await this.presenter.addMessage(message.role, message.content);
		}
	}
}
