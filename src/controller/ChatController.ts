import { Hono } from "hono";

const app = new Hono<{ Variables: Env }>();

const routes = app.post("/", (c) => c.text("Hello World!"));

export default routes;
