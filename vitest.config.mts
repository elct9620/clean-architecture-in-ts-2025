import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineWorkersConfig({
	plugins: [tsconfigPaths()],
	test: {
		setupFiles: ["vitest.setup.ts"],
		poolOptions: {
			workers: {
				singleWorker: true,
				isolatedStorage: false,
				wrangler: { configPath: "./wrangler.jsonc" },
			},
		},
	},
});
