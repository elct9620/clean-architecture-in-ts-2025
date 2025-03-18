import { inject, injectable } from "tsyringe-neo";

import { KvStore } from "@/container";
import { Conversation, Role } from "@/entity/Conversation";
import { ConversationRepository } from "@/usecase/interface";

interface ConversationSchema {
	id: string;
	messages: Array<{
		role: Role;
		content: string;
	}>;
}

@injectable()
export class KvConversationRepository implements ConversationRepository {
	constructor(@inject(KvStore) private readonly kv: KVNamespace) {}

	async find(sessionId: string): Promise<Conversation> {
		const key = `conversation:${sessionId}`;
		const data = await this.kv.get<ConversationSchema>(key, "json");
		if (!data) {
			return new Conversation(sessionId);
		}
		const conversation = new Conversation(sessionId);
		for (const message of data.messages) {
			conversation.addMessage(message.role, message.content);
		}
		return conversation;
	}

	async save(conversation: Conversation): Promise<void> {
		const key = `conversation:${conversation.id}`;
		const schema: ConversationSchema = {
			id: conversation.id,
			messages: conversation.messages.map((message) => ({
				role: message.role,
				content: message.content,
			})),
		};
		// 設置對話在 1 小時後過期 (3600 秒)
		await this.kv.put(key, JSON.stringify(schema), { expirationTtl: 3600 });
	}
}
