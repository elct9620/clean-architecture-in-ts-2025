import { Conversation, Message } from "@/entity/Conversation";
import { SessionId } from "@entity/Session";

export interface ConversationRepository {
	find(sessionId: SessionId): Promise<Conversation>;
	save(conversation: Conversation): Promise<void>;
}

export interface StreamingEventPresenter {
	messagePartial(chunk: string): Promise<void>;
}

export interface ChatAgent {
	chat(messages: Message[]): Promise<string>;
}
