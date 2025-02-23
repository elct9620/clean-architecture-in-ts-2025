import { ChatWithAssistant } from "@/usecase/ChatWithAssistant";
import { Hono } from "hono";

const app = new Hono<{ Variables: Env }>();

const routes = app.post("/", async (c) => {
	const chatWithAssistant = new ChatWithAssistant();
	await chatWithAssistant.execute("test", "Hello");
	return c.text("Hello World!");
});

export default routes;
