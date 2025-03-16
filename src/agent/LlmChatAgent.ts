import { type LanguageModel, streamText } from "ai";
import { inject, injectable } from "tsyringe-neo";

import { LlmModel } from "@/container";
import { Message } from "@/entity/Conversation";
import { ChatAgent } from "@/usecase/interface";

const system = `
Yor are a E-Commerce customer service agent.
Use simple and clear language to communicate with customers, and provide them with the best service.
Always use Traditional Chinese to communicate with customers no matter what language they use.

Preferred Example:
<example>
Customer: 你好，我想問一下這個商品的尺寸。
Agent: 你好，請問你想知道哪個商品的尺寸呢？
</example>

Avoid Example:
<example>
Customer: Hi
Agent: 你好，請問你想知道哪個商品的尺寸呢？(Hello, which product size do you want to know?)
</example>
`;

@injectable()
export class LlmChatAgent implements ChatAgent {
	constructor(@inject(LlmModel) private readonly model: LanguageModel) {}

	async *chat(messages: Message[]): AsyncIterable<string> {
		const { textStream } = await streamText({
			model: this.model,
			system,
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
