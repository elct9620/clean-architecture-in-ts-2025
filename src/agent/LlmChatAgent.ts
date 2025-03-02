import { type LanguageModel, streamText } from "ai";
import { inject, injectable } from "tsyringe-neo";

import { LlmModel } from "@/container";
import { Message } from "@/entity/Conversation";
import { ChatAgent } from "@/usecase/interface";

@injectable()
export class LlmChatAgent implements ChatAgent {
	constructor(@inject(LlmModel) private readonly model: LanguageModel) {}

	async *chat(messages: Message[]): AsyncIterable<string> {
		const { textStream } = await streamText({
			model: this.model,
			messages: messages.map((message) => ({
				role: message.role,
				content: message.content,
			})),
		});

		for await (const chunk of textStream) {
			yield chunk;
		}
	}
}
