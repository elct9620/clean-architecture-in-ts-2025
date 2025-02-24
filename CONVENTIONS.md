# Application Development Conventions

These conventions are used to guide the development of the application which is built using the Clean Architecture principles.

## General

- **File Naming**: Use PascalCase for file names, e.g. `MyFile.ts`.
- **Directory Naming**: Use snake_case for directory names, e.g. `my_directory`.

## Technologies

- **Cloudflare Workers**: Use Cloudflare Workers to deploy the application.
- **Cloudflare KV**: Use Cloudflare KV to store the application data, with prefix e.g. `user:{id}`, `session:{id}`.

## Structure

The project is structured as follows:

- **src**: Contains the source code of the application.
  - **entity**: The core business rules, the files is maintained by humans.
  - **usecase**: The application rules, the files is maintained by humans.
  - **controller**: The adapter to convert http request to usecase input.
  - **presenter**: The adapter to convert usecase output to http response.
  - **repository**: The adapter to convert database query to entity.
  - **agent**: The adapter to interact with Language Model.
- **tsconfig.json**: The TypeScript configuration file.

## TypeScript

- **Imports**: Use `tsconfig.json` paths to import files, e.g. `import { Product } from '@entity/Product'`.

## Dependency Injection

The application uses the `tsyringe-neo` library for dependency injection, which is configured in the `src/container.ts` file.

- **Container**: Use `tsyringe-neo` as the dependency injection container.
- **Injectable**: Use `@injectable` to mark a class as injectable, only adapters is injectable. e.g. `controller`, `presenter`, `repository`.
- **Inject**: Use `@inject` to inject a dependency into a class, e.g. `@inject('ProductRepository')`. Prefer inject as private property.
- **Singleton**: Avoid using `@singleton` to mark a class as singleton, if needed ask the team for approval.
- **Register**: Use `container.register` to register a dependency in `src/container.ts`.

## Controller

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
