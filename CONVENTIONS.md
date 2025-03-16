# Coding Guidelines

These are coding guidelines that should be followed when writing code for the application.

## Introduction

This a ecommerce application example that uses Clean Architecture in TypeScript.

## Technologies

- **Cloudflare Workers**: Use Cloudflare Workers to deploy the application.
- **Cloudflare KV**: Use Cloudflare KV to store the application data, with prefix e.g. `user:{id}`, `session:{id}`.
- **Hono**: Use Hono as the web framework.
- **TailwindCSS 4**: Use TailwindCSS 4 as the CSS framework.
- **AI SDK**: Use Vercel AI SDK to interact with Language Model.

## Naming

- Use PascalCase for file names, e.g. `MyFile.ts`, `App.tsx`.
- Use PascalCase for `type` names.
- Use PascalCase for `enum` values.
- Use camelCase for `function` and `method` names.
- Use camelCase for `property` names and `local variable`.
- Use whole words in names when possible.

## Types

- Do not export `types` or `functions` unless you need share it across multiple files.
- Do not introduce new `types` or `values` to global namespace.

## Comments

- Do not use comments to explain what the code does, write code that is self-explanatory.
- Only use comments use JSDoc to document the public API of a module.

## Source Code Organization

The source code are put in the `src` directory, and the files are organized as follows:

- The `entity` contains the core business rules, always read-only.
- The `usecase` contains the application rules, always read-only.
- The `controller` contains the adapter to call the usecase, use Hono controller style.
- The `presenter` implements the interface defined in the `usecase` to handle the output.
- The `repository` implements the interface defined in the `usecase` to handle the data access.
- The `agent` implements the interface defined in the `usecase` to interact with Language Model.
- The `api` use `controller` to implement the Hono RPC api client.
- The `view` contains the JSX files for the UI.

When importing files, use the `tsconfig.json`defined paths to import files, e.g. `import { Product } from '@entity/Product'`.

## Dependency Injection

The dependency is managed by `tsyringe-neo` which is a fork of `tsyringe`.

- Use `@injectable` decorator to make a class injectable, only `presenter`, `repository`, `agent` is injectable.
- Use `@inject` decorator to inject a dependency into a class, e.g. `@inject(ProductRepository)`.
- Use Symbol to define the interface as a token, e.g. `const ProductRepository = Symbol('ProductRepository')`.

## Hono Controller

The controller in the `src/controller` isn't a class, it should be a Hono routes.

This is example of a controller:

```typescript
import { Hono } from "hono";

const app = new Hono<{ Variables: Env }>();

// Chain the routes that can be use `route("/api/chat", ChatController)` in the `src/index.ts`
const routes = app.post("/", async (c) => {
	return c.text("Hello World!");
});

export default routes;
```

## Language Model

### Mocking in Tests

We use `vitest` to mock the Language Model in tests which is `jest` based.

```typescript
import { container } from "tsyringe-neo";

// Get Language Model Provider
import { openai } from "@ai-sdk/openai";

// Get `vitest` to use `vi.spyOn()` to mock the Language Model
import { afterEach, beforeEach, vi } from "vitest";

// Ensure the mock is restored after each test
afterEach(() => {
	vi.restoreAllMocks();
});

// Mock the Language Model
beforeEach(() => {
	// Prepare the model to be mocked
	const model = openai("gpt-4o-mini");

	// Mock the `doGenerate` method to return a specific output
	vi.spyOn(model, "doGenerate").mockImplementation(async () => ({
		rawCall: { rawPrompt: null, rawSettings: {} },
		finishReason: "stop",
		usage: { promptTokens: 10, completionTokens: 20 },
		text: "Hello World",
	}));

	// Register the model in the container to be used in the tests
	container.register(LlmModel, {
		useValue: model,
	});
});
```
