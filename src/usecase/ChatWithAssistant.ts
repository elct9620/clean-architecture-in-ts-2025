import { Role } from "@/entity/Conversation";
import {
	CartRepository,
	ChatAgent,
	ConversationRepository,
	ProductQuery,
	StreamingEventPresenter,
} from "./interface";

export class ChatWithAssistant {
	constructor(
		private readonly conversations: ConversationRepository,
		private readonly carts: CartRepository,
		private readonly productQuery: ProductQuery,
		private readonly presenter: StreamingEventPresenter,
		private readonly agent: ChatAgent,
	) {}

	async execute(sessionId: string, content: string) {
		const cart = await this.carts.find(sessionId);
		const conversation = await this.conversations.find(sessionId);
		conversation.addMessage(Role.User, content);

		const reply = await this.agent.chat(
			cart,
			this.productQuery,
			conversation.messages,
		);

		let assistantMessage = "";
		for await (const chunk of reply) {
			assistantMessage += chunk;
			await this.presenter.messagePartial(chunk);
		}
		conversation.addMessage(Role.Assistant, assistantMessage);

		await this.conversations.save(conversation);
		await this.carts.save(cart);

		if (cart.isDirty) {
			await this.presenter.refreshCart();
		}
	}
}
