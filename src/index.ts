import { tsyringe } from "@hono/tsyringe";
import { Hono } from "hono";
import "reflect-metadata";

const app = new Hono();

app.use(async (c, next) => {
	await tsyringe((container) => {})(c, next);
});

app.get("/", (c) => c.text("Hello World!"));

export default {
	fetch: app.fetch,
} satisfies ExportedHandler<Env>;
