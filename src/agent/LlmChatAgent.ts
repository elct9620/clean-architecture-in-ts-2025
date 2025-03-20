import { type LanguageModel, streamText } from "ai";
import { inject, injectable } from "tsyringe-neo";

import { createCartTools } from "@/agent/CartTool";
import { createProductTools } from "@/agent/ProductTool";
import { LlmModel } from "@/container";
import { Cart } from "@/entity/Cart";
import { Message } from "@/entity/Conversation";
import { ChatAgent, ProductQuery } from "@/usecase/interface";

const system = `
Your mission is to help customers find the product they want and provide them with the information they need.
Use simple and clear language to communicate with customers, and provide them with the best service.
Always use Traditional Chinese to communicate with customers no matter what language they use.

## Examples

### Good, clear communication.
<example>
Customer: 你好，我想問一下這個商品的尺寸。
Assistant: 請問你想知道哪個商品的尺寸呢？
</example>

### Good, did not repeat the same answer.
<example>
Customer: 我可以協助您搜尋商品資訊。您想找什麼商品呢？
Assistant: 您想找的電腦資訊，目前搜尋到「筆記型電腦散熱墊」。請問您是要找其他類型的電腦嗎？
Customer: 是
Assistant: 沒有找到其他類型的電腦。
</example>

### Bad, the answer not use Traditional Chinese only.
<example>
Customer: Hi
Assistant: 您好，請問有什麼我可以幫您的嗎？(Hello, how can I help you?)
</example>

### Bad, repeated the same answer.
<example>
Customer: 我可以協助您搜尋商品資訊。您想找什麼商品呢？
Assistant: 您想找的電腦資訊，目前搜尋到「筆記型電腦散熱墊」。請問您是要找其他類型的電腦嗎？
Customer: 是
Assistant: 您想找的電腦資訊，目前搜尋到「筆記型電腦散熱墊」。請問您是要找其他類型的電腦嗎？
</example>

## Cart

Make sure to call the tools to update the cart if the customer adds or removes items from the cart.

## Rules

If you cannot find the answer using the tools provided, tell the customer that you cannot help them with this question.
Never give customers false information, no need to give technical details, and do not provide personal opinions.
`;

@injectable()
export class LlmChatAgent implements ChatAgent {
	constructor(@inject(LlmModel) private readonly model: LanguageModel) {}

	async *chat(
		cart: Cart,
		productQuery: ProductQuery,
		messages: Message[],
	): AsyncIterable<string> {
		const productTools = createProductTools(productQuery);
		const cartTools = createCartTools(cart);

		const { textStream, toolCalls, toolResults } = await streamText({
			model: this.model,
			system,
			messages: messages.map((message) => ({
				role: message.role,
				content: message.content,
			})),
			maxSteps: 15,
			tools: {
				...productTools,
				...cartTools,
			},
		});

		for await (const chunk of textStream) {
			yield chunk;
		}
	}
}
