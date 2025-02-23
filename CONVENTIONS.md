Application Development Conventions
===

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
- **tsconfig.json**: The TypeScript configuration file.

## TypeScript

- **Imports**: Use `tsconfig.json` paths to import files, e.g. `import { Product } from '@entity/Product'`.

## Dependency Injection

The application uses the `tsyringe` library for dependency injection, which is configured in the `src/container.ts` file.

- **Container**: Use `tsyringe` as the dependency injection container.
- **Injectable**: Use `@injectable` to mark a class as injectable, only adapters is injectable. e.g. `controller`, `presenter`, `repository`.
- **Inject**: Use `@inject` to inject a dependency into a class, e.g. `@inject('ProductRepository')`. Prefer inject as private property.
- **Singleton**: Avoid using `@singleton` to mark a class as singleton, if needed ask the team for approval.
- **Register**: Use `container.register` to register a dependency in `src/container.ts`.
