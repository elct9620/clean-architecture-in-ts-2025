import { render } from "hono/jsx/dom";

import { App } from "@view/App";

// @ts-ignore - This is a client-side only file
const root = document.getElementById("root");
if (root) {
	render(<App />, root);
}
