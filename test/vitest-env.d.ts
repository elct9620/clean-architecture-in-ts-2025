declare module "vitest" {
	export interface TestContext {
		response: Response;
	}
}

declare module "cloudflare:test" {
	export interface ProvidedEnv {
		KV: KVNamespace;
	}
}

export {};
