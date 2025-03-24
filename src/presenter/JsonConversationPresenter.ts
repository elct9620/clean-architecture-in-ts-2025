import { ConversationPresenter } from "@/usecase/interface";

export class JsonConversationPresenter implements ConversationPresenter {
	private messages: Array<{ role: "user" | "assistant"; content: string }> = [];

	async addMessage(role: "user" | "assistant", content: string): Promise<void> {
		this.messages.push({ role, content });
	}

	async render() {
		return {
			messages: this.messages.map((message) => ({
				role: message.role,
				content: message.content,
			})),
		};
	}
}
