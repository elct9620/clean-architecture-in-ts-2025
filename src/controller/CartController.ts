import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { JsonCartPresenter } from "@/presenter/JsonCartPresenter";
import { KvCartRepository } from "@/repository/KvCartRepository";
import { GetCart } from "@/usecase/GetCart";
import { container } from "tsyringe-neo";

const app = new Hono<{ Bindings: Env }>();

const schema = z.object({
	sessionId: z.string().optional(),
});

// 鏈式路由定義
const routes = app.get("/", zValidator("query", schema), async (c) => {
	const { sessionId = "default-session" } = c.req.valid("query");

	const carts = container.resolve(KvCartRepository);
	const presenter = new JsonCartPresenter();
	const getCart = new GetCart(carts, presenter);

	await getCart.execute(sessionId);

	return c.json(presenter.render());
});

export default routes;
