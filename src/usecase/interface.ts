import { Conversation, Message } from "@/entity/Conversation";
import { SessionId } from "@entity/Session";

export interface ConversationRepository {
	find(sessionId: SessionId): Promise<Conversation>;
	save(conversation: Conversation): Promise<void>;
}

export interface StreamingEventPresenter {
	emit(event: string, data: any): Promise<void>;
}

export interface ChatAgent {
	chat(messages: Message[]): Promise<string>;
}
