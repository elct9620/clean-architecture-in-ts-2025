import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { z } from "zod";

import { LlmChatAgent } from "@/agent/LlmChatAgent";
import { JsonConversationPresenter } from "@/presenter/JsonConversationPresenter";
import { HonoServerEventPresenter } from "@/presenter/StreamingEventPresenter";
import { KvCartRepository } from "@/repository/KvCartRepository";
import { KvConversationRepository } from "@/repository/KvConversationRepository";
import { InlineProductQuery } from "@/service/InlineProductQuery";
import { ChatWithAssistant } from "@/usecase/ChatWithAssistant";
import { GetChat } from "@/usecase/GetChat";
import { container } from "tsyringe-neo";

const app = new Hono<{ Bindings: Env }>();

const schema = z.object({
	sessionId: z.string(),
	content: z.string(),
});

const getSchema = z.object({
	id: z.string(),
});

const routes = app
	.get("/:id", zValidator("param", getSchema), async (c) => {
		const { id } = c.req.valid("param");
		const conversations = container.resolve(KvConversationRepository);
		const presenter = new JsonConversationPresenter();
		const getChat = new GetChat(conversations, presenter);
		
		await getChat.execute(id);
		
		return c.json(await presenter.render());
	})
	.post("/", zValidator("json", schema), async (c) => {
		return streamSSE(c, async (stream) => {
			const { sessionId, content } = c.req.valid("json");
			const conversations = container.resolve(KvConversationRepository);
			const carts = container.resolve(KvCartRepository);
			const productQuery = container.resolve(InlineProductQuery);
			const presenter = new HonoServerEventPresenter(stream);
			const agent = container.resolve(LlmChatAgent);
			const chatWithAssistant = new ChatWithAssistant(
				conversations,
				carts,
				productQuery,
				presenter,
				agent,
			);
			await chatWithAssistant.execute(sessionId, content);
		});
	});

export default routes;
