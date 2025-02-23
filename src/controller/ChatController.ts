import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { KvConversationRepository } from "@/repository/KvConversationRepository";
import { ChatWithAssistant } from "@/usecase/ChatWithAssistant";
import { container } from "tsyringe-neo";

const app = new Hono<{ Bindings: Env }>();

const schema = z.object({
	sessionId: z.string(),
	content: z.string(),
});

const routes = app.post("/", zValidator("json", schema), async (c) => {
	const { sessionId, content } = c.req.valid("json");
	const repository = container.resolve(KvConversationRepository);
	const chatWithAssistant = new ChatWithAssistant(repository);
	await chatWithAssistant.execute(sessionId, content);
	return c.json({ success: true });
});

export default routes;
