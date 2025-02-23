import "reflect-metadata";

import { Hono } from "hono";
import { container } from "tsyringe-neo";

import ChatController from "@controller/ChatController";
import { KvStore } from "./container";

const app = new Hono<{ Bindings: Env }>();

app.use(async (c, next) => {
	container.register(KvStore, {
		useValue: c.env.KV,
	});

	return next();
});

app.get("/", (c) => c.text("Hello World!"));
app.route("/api/chat", ChatController);

export default {
	fetch: app.fetch,
} satisfies ExportedHandler<Env>;
