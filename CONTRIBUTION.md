# Contribution Guidelines for HireCore OS

Thank you for your interest in contributing to HireCore OS. We welcome contributions from developers of all skill levels to help build and refine our institutional AI candidate evaluation system.

---

## 1. Code of Conduct & Standards

To maintain high technical standards across the codebase, all contributors must adhere to the following rules:

1. **Zero Informal Emojis Policy**: System logs, user interfaces, documentation, commit messages, and AI client responses must remain strictly zero-emoji and formatted professionally.
2. **Strict 0px Border Radius**: All new UI components in `client/` must adhere to the zero-radius academic paper design language (`border-radius: 0px`).
3. **Typography Standard**: Use `Libertinus Serif` for primary headings/body text and `JetBrains Mono` for monospaced metadata, code frames, and technical tags.
4. **Security First**: Never check in API keys, secret credentials, `.env` files, or production Mongo URIs.

---

## 2. Getting Started

### Prerequisites
* Node.js v22.0.0 or higher (LTS)
* Docker & Docker Compose (optional for containerized setup)
* Git

### Local Development Setup

1. **Fork & Clone the Repository**:
   ```bash
   git clone https://github.com/rishhbh/hirecore-os.git
   cd hirecore-os
   ```

2. **Setup Backend Server**:
   ```bash
   cd server
   npm install
   cp .env.example .env   # Populate local variables
   npm run dev
   ```

3. **Setup Frontend Client**:
   ```bash
   cd ../client
   npm install
   cp .env.example .env   # Populate local variables
   npm run dev
   ```

4. **Run via Docker Compose (Alternative)**:
   ```bash
   docker compose up --build
   ```

---

## 3. Development & Pull Request Workflow

1. **Create a Feature Branch**:
   ```bash
   git checkout -b feat/your-feature-name
   # or for bug fixes:
   git checkout -b fix/your-bug-description
   ```

2. **Code Linting & Verification**:
   Before submitting a Pull Request, ensure that all linting rules and production builds pass cleanly:
   ```bash
   cd client
   npm run lint
   npm run build
   ```

3. **Commit Conventions**:
   Follow Conventional Commits format:
   * `feat: add new technical domain to interview simulator`
   * `fix: correct z-index elevation on custom cursor`
   * `docs: update API endpoints reference in README`
   * `refactor: optimize cerebras inference response parser`

4. **Submit a Pull Request**:
   * Open a PR against the `main` branch.
   * Provide a concise description of the changes made, tests performed, and any breaking API updates.
   * Tag core maintainers for review.

---

## 4. Reporting Issues & Security Vulnerabilities

If you discover a bug or security vulnerability, please open an issue on the GitHub repository detailing:
* Operating System & Node runtime environment.
* Steps to reproduce the issue.
* Expected vs actual behavior.
* Relevant terminal output or error logs.

---

## 5. Engineering Leads & Maintainers

* **Rishabh Sharma** ([@rishhbh](https://github.com/rishhbh)) — Backend & AI Systems Lead
* **Ayush Soni** ([@ayushsoni30](https://github.com/ayushsoni30)) — Full Stack & GenAI Lead
