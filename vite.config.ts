import build from "@hono/vite-build/cloudflare-workers";
import devServer from "@hono/vite-dev-server";
import cloudflareAdapter from "@hono/vite-dev-server/cloudflare";
import { defineConfig, Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
	if (mode == "client") {
		return {
			build: {
				rollupOptions: {
					input: ["./src/client.tsx"],
					output: {
						entryFileNames: "public/app.js",
						chunkFileNames: "public/assets/[name]-[hash].js",
						assetFileNames: "public/assets/[name].[ext]",
					},
				},
				emptyOutDir: false,
				copyPublicDir: false,
			},
			plugins: [tsconfigPaths()],
		};
	}

	return {
		plugins: [
			devServer({
				entry: "./src/index.tsx",
				adapter: cloudflareAdapter,
			}),
			build({
				entry: "./src/index.tsx",
			}),
			tsconfigPaths(),
		] as Plugin[], // NOTE: Not sure hono plugin is typed correctly
	};
});
