# CLAUDE.md

Guidance for Claude (and humans) working in this repository. Read this before writing code. When a change contradicts something here, update this file in the same PR.

## What this project is

A TypeScript web application split into a Vue front end and an HTTP API, sharing types through a common package. Everything is TypeScript, end to end.

- **Front end** — Vue 3 (`<script setup>`), Vite, Pinia, Vue Router.
- **API** — Express on Node, organised as vertical feature slices: each area of the app owns its routing, request handling, logic, and data access top to bottom.
- **Database** — PostgreSQL accessed through Drizzle ORM, with drizzle-kit migrations.
- **Shared** — Zod schemas and inferred types used by both sides so the contract is defined once.
- **Tooling** — pnpm workspaces, Vitest for unit/integration, Playwright for end-to-end.

## Repository layout

This is a pnpm workspace monorepo. Everything lives under `apps/*` and `packages/*`.

```
.
├── apps/
│   ├── web/                     # Vue front end
│   │   ├── src/
│   │   │   ├── components/       # Reusable presentational components
│   │   │   ├── views/           # Route-level pages
│   │   │   ├── stores/          # Pinia stores
│   │   │   ├── router/          # Vue Router config
│   │   │   ├── composables/     # Reusable composition functions (useX)
│   │   │   ├── styles/          # Design tokens (CSS variables), reset, shared global styles
│   │   │   ├── api/             # Typed client for the API, imports from @app/shared
│   │   │   └── main.ts
│   │   ├── tests/               # Vitest component/unit tests
│   │   ├── e2e/                 # Playwright end-to-end specs
│   │   └── vite.config.ts
│   └── api/                     # Express API, organised by feature (vertical slices)
│       ├── src/
│       │   ├── features/         # One folder per area of the app; each owns its full stack
│       │   │   ├── users/
│       │   │   │   ├── users.routes.ts     # Express router for this feature
│       │   │   │   ├── users.handlers.ts   # Request/response handling + orchestration
│       │   │   │   ├── users.logic.ts      # Business logic; no Express or Drizzle types
│       │   │   │   ├── users.data.ts       # Drizzle queries for this feature only
│       │   │   │   ├── users.table.ts      # Drizzle table(s) this feature owns
│       │   │   │   └── users.test.ts       # Tests colocated with the feature
│       │   │   └── orders/                 # Same shape — another area of the app
│       │   ├── platform/         # Cross-cutting infrastructure shared by every feature
│       │   │   ├── middleware/    # Error handler, auth, request logging, validation
│       │   │   ├── config/        # Env parsing and typed config object
│       │   │   ├── db/
│       │   │   │   ├── client.ts   # Drizzle client / connection pool
│       │   │   │   ├── schema.ts   # Barrel re-exporting every feature's *.table.ts
│       │   │   │   ├── migrations/ # Generated SQL migrations (committed)
│       │   │   │   └── seed.ts     # Idempotent seed data
│       │   │   └── errors.ts      # Domain error types
│       │   └── index.ts          # Bootstrap; mounts each feature's router
│       └── drizzle.config.ts     # Points at platform/db/schema.ts
├── packages/
│   └── shared/                  # @app/shared — Zod schemas + inferred types
│       └── src/
├── pnpm-workspace.yaml
├── package.json                 # Root scripts only, no app code
└── CLAUDE.md
```

### Where new files go

- A new API capability goes inside its feature folder under `features/<area>/`. A whole area of the app lives together: its router, handlers, logic, data access, table definitions, and tests. Adding an endpoint means extending that feature, not threading a change through four shared layers.
- If a capability doesn't belong to an existing feature, create a new `features/<area>/` folder for it. A feature is an area of the app, not a single database table — keep it coarse enough to be meaningful.
- Features do not import from each other's internals. If two features genuinely need the same thing, it belongs in `platform/` (infrastructure) or `@app/shared` (contract types). Where one feature must call another, go through that feature's public entry point, never straight into its `*.data.ts`.
- Keep the separation of concerns _within_ a feature, as files rather than folders: `*.logic.ts` holds business logic and stays free of Express and Drizzle types; `*.data.ts` is the only file that runs Drizzle queries; `*.handlers.ts` is the only file that touches `Request`/`Response`. The discipline that layering gives you is still here — it's just scoped to the feature instead of scattered across the whole app.
- A request or response shape goes in `packages/shared` as a Zod schema. Never redefine the same shape in both apps.
- A Vue page is a `view`; anything reused across pages is a `component` or a `composable`.

## Conventions

- **TypeScript is strict.** `strict: true`, `noUncheckedIndexedAccess: true`, no implicit `any`. Do not use `any` — reach for `unknown` and narrow, or define the type.
- **Never use single-letter variable names.** Name things for what they are: `user`, `index`, `error`, `request` — not `u`, `i`, `e`, `req` abbreviations. This applies to loop counters, callback params, and catch bindings too.
- **No default exports** except where a framework requires them (Vue SFCs, Vite config). Named exports keep imports greppable.
- **Validate at the boundary.** Every request body, query param, and env var is parsed with a Zod schema before use. Trust nothing that crosses the network or process boundary.
- **Errors are typed and centralised.** Throw domain errors (defined in `platform/errors.ts`) from a feature's `*.logic.ts`; a single Express error-handling middleware maps them to status codes. Never send raw error messages or stack traces to clients.
- **Config comes from the environment, parsed once.** `platform/config/` parses `process.env` through Zod at startup and exports a typed object. Read config from there, never `process.env` directly deeper in the code.
- **Formatting and linting are not optional.** ESLint + Prettier run in CI and must pass. Run `pnpm lint` before opening a PR.

## Front end styling

Real, structured CSS — not inline styles, and not a wall of utility classes in the template. Styling lives in CSS; the template stays readable and describes structure.

- **Scoped CSS in the component.** Each single-file component styles itself in a `<style scoped>` block. Genuinely global styling — the reset, design tokens, and a small set of shared utilities — lives in `src/styles/` and nowhere else.
- **Design tokens, not magic values.** Colours, spacing, typography, radii, and breakpoints are CSS custom properties defined once in `src/styles/`. Reference them with `var(--...)`; never paste a raw hex code or an arbitrary pixel value into a component.
- **Semantic class names.** A class names what the thing _is_, not what it looks like: `.invoice-summary`, not `.mt-4` or `.flex-row`. Appearance changes; meaning shouldn't. Use a consistent convention for element and modifier classes — BEM-style `block__element--modifier` is the default.
- **No inline `style` attributes** except for a value that is genuinely dynamic and computed at runtime (for example a progress-bar width bound to data). Everything static is a class.

**Every container gets its own class.** Any element that groups several pieces of data together for display or edit — a card, a detail panel, a form section, a row of related fields — must carry a semantic class on its wrapper. Do not group data inside an unnamed `<div>` and reach it through the parent's styles or nesting. The container is a real, named thing, and its layout and spacing attach to that class.

```vue
<!-- Good: the container is a named thing, styled through its class and tokens -->
<template>
  <section class="customer-card">
    <h2 class="customer-card__name">{{ customer.name }}</h2>
    <dl class="customer-card__details">
      <div class="customer-card__field">
        <dt>Email</dt>
        <dd>{{ customer.email }}</dd>
      </div>
      <div class="customer-card__field">
        <dt>Plan</dt>
        <dd>{{ customer.plan }}</dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
.customer-card {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-surface);
}
.customer-card__field {
  display: flex;
  justify-content: space-between;
}
</style>
```

```vue
<!-- Avoid: anonymous containers, styling by tag and nesting, inline magic values -->
<template>
  <div>
    <div>{{ customer.name }}</div>
    <div style="display:flex; gap:12px;">
      <div>{{ customer.email }}</div>
      <div>{{ customer.plan }}</div>
    </div>
  </div>
</template>
```

## Environments and configuration

Config is per-environment and never committed. Each app has a `.env.example` listing every variable with safe placeholder values; real values live in `.env` (gitignored) locally and in the secrets store in deployed environments.

The database connection is a single `DATABASE_URL`. There is one per environment:

- **local** — your dev database, usually Postgres in Docker.
- **test** — a dedicated, disposable database the test suite owns and is free to wipe. Never point tests at a database with data you care about.
- **staging / production** — deployed databases; only migrations touch their schema.

Never hardcode a connection string. The value always comes from `DATABASE_URL`.

## Database and migrations

Drizzle owns the schema. Each table is defined next to the feature that owns it (`features/<area>/*.table.ts`) and re-exported from a single barrel (`platform/db/schema.ts`) that drizzle-kit reads — so the schema stays vertical while drizzle-kit still sees the whole picture. Migrations are **generated from that combined schema, never hand-written and never edited after generation**. The generated SQL in `platform/db/migrations/` is committed to the repo — it is the history of the schema and must be reviewed like any other code.

Workflow for a schema change:

1. Edit the table definition in the owning feature's `*.table.ts`, and make sure it is exported from `platform/db/schema.ts`.
2. Generate the migration: `pnpm --filter api db:generate`. This diffs the schema against the last migration and writes a new SQL file.
3. Review the generated SQL. If it does something destructive or unexpected, fix the schema and regenerate — do not edit the SQL by hand.
4. Apply it locally: `pnpm --filter api db:migrate`.
5. Commit the schema change and the generated migration together.

Applying migrations is always `db:migrate`, which runs every pending migration in order and records which have run. It is idempotent — running it twice is a no-op. **Never use `drizzle-kit push` (which syncs schema directly without a migration file) outside throwaway local experiments; deployed environments only ever move forward through committed migrations.**

### Migrating the test server

The test server is migrated exactly the same way as any other environment — the only difference is which `DATABASE_URL` it points at. Nothing about the migration mechanism changes per environment; that is the point.

To migrate the test database, set `DATABASE_URL` to the test server and run the migrate command:

```bash
DATABASE_URL="$TEST_DATABASE_URL" pnpm --filter api db:migrate
```

There is a convenience script for it:

```bash
pnpm db:migrate:test        # loads the test env and runs db:migrate against it
```

This runs as a step before the integration and e2e suites, so the test database schema is always current before tests execute. In CI the same command runs against a freshly provisioned Postgres service container, so every run starts from an empty database migrated up to `HEAD` and seeded — no state carries between runs.

Seeding is separate and idempotent: `pnpm db:seed:test` populates reference/fixture data. Tests that need their own data create it in setup and clean it up in teardown rather than relying on global seed state.

## Testing

Three layers, each with a clear job. A change is not done until the relevant layers are green.

- **Unit (Vitest)** — pure logic in a feature's `*.logic.ts`, composables, and helpers, with dependencies mocked. Fast, no database, no network. This is where most tests live. API unit and integration tests are colocated with their feature as `*.test.ts`.
- **Integration (Vitest)** — a feature exercised through its router down to real Drizzle queries against a Postgres test database. These run against the migrated test database described above and are responsible for their own data.
- **End-to-end (Playwright)** — the Vue app driving real user flows against a running API and test database. Lives in `apps/web/e2e/`. Kept to the critical paths, since these are the slowest and most brittle.

Commands:

```bash
pnpm test              # unit + integration across the workspace
pnpm test:unit         # unit only, no db needed
pnpm test:integration  # requires the test database to be migrated first
pnpm test:e2e          # Playwright; starts the app and runs against the test db
pnpm test:coverage     # coverage report
```

Rules of thumb:

- Every bug fix comes with a test that fails before the fix and passes after.
- Test behaviour, not implementation. Assert on outputs and side effects, not on how a function is structured.
- Integration and e2e tests must be able to run repeatedly without manual cleanup — they migrate, seed, create their own data, and tear it down.
- Do not weaken or skip a test to make CI pass. Fix the code or fix the test deliberately.

## Common commands

Run from the repo root unless noted. `--filter` targets one workspace.

```bash
pnpm install                     # install everything
pnpm dev                         # run web + api together in watch mode
pnpm --filter web dev            # front end only
pnpm --filter api dev            # api only
pnpm build                       # build all workspaces
pnpm lint                        # eslint across the workspace
pnpm typecheck                   # tsc --noEmit across the workspace
pnpm --filter api db:generate    # generate a migration from schema changes
pnpm --filter api db:migrate     # apply pending migrations (local)
pnpm db:migrate:test             # apply pending migrations to the test server
pnpm db:seed:test                # seed the test database
```

## Definition of done

Before a change is considered complete:

- `pnpm typecheck`, `pnpm lint`, and `pnpm test` all pass.
- Any schema change has a committed, reviewed migration generated from the schema.
- New behaviour has tests at the appropriate layer; the bug-fix test demonstrably fails without the fix.
- Request/response shapes that crossed the wire are defined in `@app/shared`, not duplicated.
- Front-end markup follows the styling conventions: scoped CSS, design tokens instead of magic values, and every data container carries its own semantic class.
- No secrets, connection strings, or real credentials are committed; `.env.example` is updated if a new variable was introduced.
- This file is updated if a convention changed.

## Git and PRs

- Branch from `main`; do not commit directly to `main`.
- Keep commits focused; schema changes and their generated migrations belong in the same commit.
- Do not commit only when work is unfinished — commit and push when the user asks, or at a sensible checkpoint they have agreed to.
- PRs describe what changed and why, and note any migration that reviewers must run locally (`pnpm --filter api db:migrate`) after pulling.
