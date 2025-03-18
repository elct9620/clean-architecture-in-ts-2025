import { Cart } from "@/entity/Cart";
import { Conversation, Message } from "@/entity/Conversation";
import { SessionId } from "@entity/Session";

export interface ConversationRepository {
	find(sessionId: SessionId): Promise<Conversation>;
	save(conversation: Conversation): Promise<void>;
}

export interface CartRepository {
	find(sessionId: SessionId): Promise<Cart>;
	save(cart: Cart): Promise<void>;
}

export interface StreamingEventPresenter {
	messagePartial(chunk: string): Promise<void>;
}

export interface ChatAgent {
	chat(cart: Cart, messages: Message[]): AsyncIterable<string>;
}
