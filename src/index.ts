import { tsyringe } from "@hono/tsyringe";
import { Hono } from "hono";
import "reflect-metadata";

import ChatController from "@controller/ChatController";

const app = new Hono<{ Variables: Env }>();

app.use(async (c, next) => {
	await tsyringe((container) => {})(c, next);
});

app.get("/", (c) => c.text("Hello World!"));
app.route("/api/chat", ChatController);

export default {
	fetch: app.fetch,
} satisfies ExportedHandler<Env>;
