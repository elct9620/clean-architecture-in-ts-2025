import { Cart } from "@/entity/Cart";
import { Conversation, Message } from "@/entity/Conversation";
import { Product } from "@/entity/Product";
import { SessionId } from "@entity/Session";

export interface ConversationRepository {
	find(sessionId: SessionId): Promise<Conversation>;
	save(conversation: Conversation): Promise<void>;
}

export interface CartRepository {
	find(sessionId: SessionId): Promise<Cart>;
	save(cart: Cart): Promise<void>;
}

export interface ProductQuery {
	execute(query: string): Promise<Product[]>;
}

export interface StreamingEventPresenter {
	messagePartial(chunk: string): Promise<void>;
}

export interface ChatAgent {
	chat(
		cart: Cart,
		productQuery: ProductQuery,
		messages: Message[],
	): AsyncIterable<string>;
}
