import { type LanguageModel, generateText } from "ai";
import { inject, injectable } from "tsyringe-neo";

import { LlmModel } from "@/container";
import { Message } from "@/entity/Conversation";
import { ChatAgent } from "@/usecase/interface";

@injectable()
export class LlmChatAgent implements ChatAgent {
	constructor(@inject(LlmModel) private readonly model: LanguageModel) {}

	async chat(messages: Message[]): Promise<string> {
		const { text } = await generateText({
			model: this.model,
			messages: messages.map((message) => ({
				role: message.role,
				content: message.content,
			})),
		});

		return text;
	}
}
