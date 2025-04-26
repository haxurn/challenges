# Haxurn - Core

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) <!-- Choose your license -->
<!-- Add other badges as needed: build status, code coverage, etc. -->
<!-- ![Build Status](...) -->

**Haxurn Core serves as the central monorepo and foundational codebase for developing a suite of cybersecurity-focused tools, applications, and reusable packages under the Haxurn umbrella. It aims to promote code reuse, standardized architecture, and efficient development within a unified TypeScript environment.**

---

## Current Status & Initial Application: CTF Platform

As the first major application built on this foundation, Haxurn Core currently hosts a complete **CTF Flag Submission Platform**. This platform provides essential infrastructure for running Capture The Flag events, featuring:

*   🚩 **Telegram Bot (`apps/bot`):**
    *   Built with **Telegraf**.
    *   Handles player interaction via Telegram.
    *   Provides commands like `/start` (welcome/instructions) and `/submit` (flag submission).
    *   Communicates securely with the backend API for logic processing.
*   ⚙️ **Backend API (`apps/api`):**
    *   Built with **Hono** (running on Node.js).
    *   Provides RESTful endpoints for the Telegram bot and Admin UI.
    *   Handles user validation, flag checking logic (future), submission storage, and challenge data management.
    *   Uses **Zod** for robust request validation.
*   📝 **Web Admin Panel (`apps/admin-web`):**
    *   Built with **Next.js** and styled with **Tailwind CSS**.
    *   Allows administrators to perform CRUD (Create, Read, Update, Delete) operations on CTF challenges.
    *   Features a Markdown editor (`@uiw/react-md-editor`) for rich challenge descriptions.
    *   Interacts with the backend API.
*   💾 **Database Package (`packages/database`):**
    *   Uses **PostgreSQL** as the database.
    *   Managed with **Drizzle ORM** for type-safe schema definition, migrations, and queries.
    *   Provides shared data access functions for users, challenges, and flag submissions.

---

## Architecture & Tech Stack

This project is structured as a **monorepo** managed by **pnpm workspaces**.

*   **Core Language:** TypeScript
*   **Backend API:** Hono, Node.js
*   **Telegram Bot:** Telegraf
*   **Admin Frontend:** Next.js, React, Tailwind CSS
*   **Database:** PostgreSQL
*   **ORM & Migrations:** Drizzle ORM, Drizzle Kit
*   **HTTP Client (Bot):** Axios
*   **Validation (API):** Zod
*   **Package Manager:** pnpm
*   **Development Tools:** ts-node-dev, ESLint (optional)

---

## Directory Structure

```
haxurn-core/
├── apps/ # Contains deployable applications
│ ├── api/ # Hono backend API (core + bot modules)
│ ├── bot/ # Telegraf Telegram bot application
│ └── admin-web/ # Next.js admin panel application
├── packages/ # Contains shared libraries/packages
│ └── database/ # Drizzle ORM schema, client, migrations, DB functions
├── .env # Local environment variables (!!! DO NOT COMMIT !!!)
├── .env.example # Example environment file
├── .gitignore
├── drizzle.config.ts # Drizzle Kit configuration (for migrations)
├── pnpm-workspace.yaml # Defines the monorepo structure for pnpm
├── package.json # Root package configuration and scripts
└── tsconfig.base.json # Base TypeScript configuration
```
---

## Getting Started

### Prerequisites

*   **Node.js:** v18.x or later recommended.
*   **pnpm:** The package manager used for this monorepo (`npm install -g pnpm`).
*   **PostgreSQL:** A running PostgreSQL server instance.
*   **Telegram Bot Token:** Obtain one from [@BotFather](https://t.me/BotFather) on Telegram.
*   **Git:** For cloning the repository.
*   **(Optional) Docker & Docker Compose:** Can be used to easily run PostgreSQL.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/haxurn-core.git # Replace with your repo URL
    cd haxurn-core
    ```

2.  **Install dependencies:**
    *   pnpm will install dependencies for all applications and packages and link them correctly within the workspace.
    ```bash
    pnpm install
    ```

### Environment Setup

1.  **Create `.env` file:** Copy the example environment file to create your local configuration.
    ```bash
    cp .env.example .env
    ```
2.  **Edit `.env`:** Open the `.env` file in the root directory and fill in your specific configuration details:
    *   `POSTGRES_URL`: Your full PostgreSQL connection string (e.g., `postgres://user:password@host:port/database`).
    *   `BOT_TOKEN`: Your Telegram Bot Token from BotFather.
    *   `BOT_API_PORT`: The port the Hono API will run on (e.g., `3001`).
    *   `BOT_API_URL`: The full URL the Telegram Bot will use to reach the API (e.g., `http://localhost:3001`).

    **Important:** Never commit your `.env` file to version control!

### Database Setup

1.  **Ensure PostgreSQL is running** and accessible using the connection string in your `.env` file.
2.  **Generate Migrations (if schema changed):**
    *   If you modify the schema in `packages/database/src/schema.ts`, generate the SQL migration files:
    ```bash
    pnpm db:generate
    ```
    *   Review the generated SQL files in `packages/database/drizzle`.
3.  **Apply Migrations:**
    *   Run this command to apply the migrations and create/update your database tables:
    ```bash
    pnpm db:migrate
    ```

### Running the Applications

You need to run the API, Bot, and optionally the Admin Web UI concurrently. Open separate terminal windows/tabs for each:

1.  **Run the Backend API (`apps/api`):**
    ```bash
    # From the root directory
    pnpm --filter @ctf-submitter/api run dev
    ```
    *Wait for the "API server listening" message.*

2.  **Run the Telegram Bot (`apps/bot`):**
    ```bash
    # From the root directory
    pnpm --filter @ctf-submitter/bot run dev
    ```
    *Wait for the "Bot started successfully" message.*

3.  **Run the Admin Web Panel (`apps/admin-web`) (Optional):**
    ```bash
    # From the root directory
    pnpm --filter @ctf-submitter/admin-web run dev
    ```
    *Access the admin panel at `http://localhost:3000` (or the port shown).*

---

## Key Scripts (Run from Root)

*   `pnpm install`: Install all dependencies across the monorepo.
*   `pnpm dev`: (If defined in root `package.json`) Run all apps concurrently (requires `concurrently` or similar).
*   `pnpm --filter <app_or_package_name> run dev`: Run the development server for a specific app/package (e.g., `pnpm --filter @ctf-submitter/api run dev`).
*   `pnpm build`: Build all applications and packages.
*   `pnpm --filter <app_or_package_name> run build`: Build a specific app/package.
*   `pnpm db:generate`: Generate SQL migration files based on schema changes.
*   `pnpm db:migrate`: Apply pending database migrations.
*   `pnpm db:studio`: Open Drizzle Studio (web UI) to inspect your database.
*   `pnpm lint`: (If configured) Run the linter across the codebase.
*   `pnpm typecheck`: (If configured) Perform static type checking across the codebase.

---

## Environment Variables Reference

Make sure these are set in your root `.env` file:

*   `POSTGRES_URL`: Full PostgreSQL connection string.
*   `BOT_TOKEN`: Your Telegram Bot token.
*   `BOT_API_PORT`: Port for the Hono backend API (e.g., 3001).
*   `BOT_API_URL`: Full URL for the backend API (e.g., `http://localhost:3001`), used by the bot.
*   `NODE_ENV`: Set to `development` or `production`.

---

## Roadmap & Future Goals

*   ✨ **More Haxurn Tools:** Integrate other cybersecurity tools (scanners, recon tools, vulnerability management dashboards).
*   📦 **Shared Packages:** Extract reusable logic/UI components into `packages/` (e.g., `@haxurn/ui`, `@haxurn/auth-utils`).
*   🔐 **Authentication:** Implement robust authentication for the Admin Panel and potentially API keys for tools.
*   📊 **CTF Features:** Add leaderboards, user profiles, solve tracking, hints system to the CTF platform.
*   🐳 **Dockerization:** Provide `docker-compose.yml` for easier setup and deployment.
*   🚀 **CI/CD:** Set up automated testing, building, and deployment pipelines.
*   🧪 **Testing:** Add unit, integration, and end-to-end tests.

---

## Contributing

Contributions are welcome! Please read the (upcoming) `CONTRIBUTING.md` guidelines before submitting pull requests.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## License

Distributed under the MIT License. See `LICENSE` file for more information.