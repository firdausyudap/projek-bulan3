# NestJS Monorepo Boilerplate 🚀

A high-performance, structured, and production-ready NestJS Monorepo Boilerplate built with **pnpm Workspaces**, **Turborepo**, and **Biome**. Designed for high scalability, rapid development, and strict code quality consistency.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [NestJS](https://nestjs.com/) (Modular, Dependency Injection, Swagger)
- **Monorepo Management**: [pnpm Workspaces](https://pnpm.io/workspaces) & [Turborepo](https://turbo.build/) (Fast, cached, parallel builds)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) (PostgreSQL with modular multi-file schema pattern)
- **Validation & DTOs**: [Zod](https://zod.dev/) via [nestjs-zod](https://github.com/risen7/nestjs-zod)
- **Code Quality**: [Biome](https://biomejs.dev/) (Sub-millisecond linter, formatter, and import organizer)
- **Hooks**: [Husky](https://typicode.github.io/husky/) (Strict pre-commit quality gate)
- **Testing**: [Jest](https://jestjs.io/) with `ts-jest` for rigorous unit testing with full mocking support

---

## 📁 Repository Structure

```
├── apps/
│   ├── api/               # NestJS API application (HTTP Services, Routing, Swagger)
│   ├── schedulers/        # Plain TypeScript background cron jobs (No NestJS, lightweight)
│   └── workers/           # Plain TypeScript background queue workers
├── packages/
│   ├── shared/            # Monorepo core shared library
│   │   ├── src/
│   │   │   ├── docs/      # Static API response JSON examples
│   │   │   ├── entities/  # Business / Response Entities
│   │   │   ├── http/      # Custom HTTP helpers (ResponseHelper, etc.)
│   │   │   ├── infrastructure/
│   │   │   │   ├── database/    # Prisma Client Initialization
│   │   │   │   └── repository/  # Prisma Repositories (CRUD operations)
│   │   │   ├── prisma/    # Multi-file Prisma schemas & migrations
│   │   │   ├── schemas/   # Strict Zod schemas & DTOs
│   │   │   └── selects/   # Prisma database selection filters
│   └── biome-config/      # Shared Biome styling configurations
│   └── typescript-config/ # Shared TypeScript tsconfig base bases
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js (v20+)** and **pnpm (v10+)** installed on your system.

### 2. Installation
Install all monorepo dependencies in parallel:
```bash
pnpm install
```

### 3. Database Configuration
1. Create a local PostgreSQL database named `boilerplate_db`.
2. Configure your environment credentials in `packages/shared/.env`:
```env
DATABASE_URL="postgresql://postgres:root@localhost:5432/boilerplate_db?schema=public"
```
3. Run database migrations to sync your schema and generate the Prisma Client:
```bash
pnpm prisma:migrate
```

### 4. Running Locally
Run all workspace applications in parallel development mode:
```bash
pnpm dev
```
The NestJS API will be available at: `http://localhost:3000`.

---

## 🔌 API Documentation (RapiDoc)

We use **RapiDoc** for clean, fast, and structured API documentation.
- **Interactive UI**: `http://localhost:3000/api`
- **JSON Specification**: `http://localhost:3000/api-json`

*Note: All endpoints are documented utilizing DTOs powered by Zod `.describe()`, ensuring exact, self-updating type schemas.*

---

## 🛡️ Code Quality & Pre-commit Hooks

This project enforces a **zero-tolerance policy** for linter warnings and format discrepancies through a strict **Husky pre-commit gate**.

### Daily Development Commands:

- **Check Linter & Formatting** (Whole Project):
  ```bash
  pnpm lint
  ```
- **Auto-Fix & Format** (Instantaneous Biome processing):
  ```bash
  pnpm format
  ```
- **Run Unit Tests**:
  ```bash
  pnpm --filter @repo/api test
  ```

---

## 📜 Development Guidelines

Before writing any code, **AI Agents** and **Developers** must read the comprehensive instructions in [**`agent.md`**](./agent.md). Key rules include:
1. **Strict TypeScript**: The `any` keyword is **forbidden** under all circumstances. Use precise typing.
2. **Layered Pattern**: Always implement changes in the defined sequence: `Schema` ➡️ `Repository` ➡️ `Zod Schema` ➡️ `Selects` ➡️ `Controller/Service` ➡️ `Unit Testing`.
3. **No ImportType for NestJS DI**: Never import NestJS classes or DTOs as `import type` to avoid stripping runtime tokens needed by NestJS Dependency Injection.
4. **Rigorous Tests**: Every feature must have extensive unit testing (covering boundary limits, null scenarios, and database transaction failures).
5. **Frontend Handoff**: After implementing a feature, you **MUST** create a comprehensive implementation Markdown guide under the `docs/` folder.

---

## ⚡ Production Build

To compile all TypeScript projects into highly optimized production builds:
```bash
pnpm build
```
Outputs will be built into the `./dist` folders of the respective applications.
