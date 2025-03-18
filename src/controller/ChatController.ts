import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { z } from "zod";

import { LlmChatAgent } from "@/agent/LlmChatAgent";
import { HonoServerEventPresenter } from "@/presenter/StreamingEventPresenter";
import { KvCartRepository } from "@/repository/KvCartRepository";
import { KvConversationRepository } from "@/repository/KvConversationRepository";
import { InlineProductQuery } from "@/service/InlineProductQuery";
import { ChatWithAssistant } from "@/usecase/ChatWithAssistant";
import { container } from "tsyringe-neo";

const app = new Hono<{ Bindings: Env }>();

const schema = z.object({
	sessionId: z.string(),
	content: z.string(),
});

const routes = app.post("/", zValidator("json", schema), async (c) => {
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
