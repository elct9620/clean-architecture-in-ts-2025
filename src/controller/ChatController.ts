import { ChatWithAssistant } from "@/usecase/ChatWithAssistant";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono<{ Variables: Env }>();

const schema = z.object({
	sessionId: z.string(),
	content: z.string(),
});

const routes = app.post("/", zValidator("json", schema), async (c) => {
	const { sessionId, content } = c.req.valid("json");
	const chatWithAssistant = new ChatWithAssistant();
	await chatWithAssistant.execute(sessionId, content);
	return c.json({ success: true });
});

export default routes;
