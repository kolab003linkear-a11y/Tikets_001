<!--
Sync Impact Report:
- Version Change: Template (Unpopulated) -> 1.0.0
- Modified Principles:
  - [PRINCIPLE_1_NAME] -> I. Full-Stack Type Safety & Wasp-First Architecture
  - [PRINCIPLE_2_NAME] -> II. Modular & Provider-Agnostic Service Integration
  - [PRINCIPLE_3_NAME] -> III. Automated Verification & Test Discipline
  - [PRINCIPLE_4_NAME] -> IV. Code Quality, Formatting & Static Analysis Compliance
  - [PRINCIPLE_5_NAME] -> V. Spec-Driven & AI-Ready Development
- Added Sections:
  - Technical Stack & Architectural Constraints
  - Quality Assurance & Workflow
- Removed Sections: None
- Templates Requiring Updates:
  - .specify/templates/plan-template.md: ✅ Up to date
  - .specify/templates/spec-template.md: ✅ Up to date
  - .specify/templates/tasks-template.md: ✅ Up to date
- Follow-up TODOs: None
-->

# Open SaaS Constitution

## Core Principles

### I. Full-Stack Type Safety & Wasp-First Architecture
All backend operations, database schemas (Prisma), and frontend components MUST maintain end-to-end type safety. Wasp's RPC declarations, entity models, and type-safe routing MUST serve as the single source of truth for full-stack data flow. Manual type assertions or untyped API bridges are strictly prohibited.

### II. Modular & Provider-Agnostic Service Integration
Third-party integrations—including payment processors (Stripe, Polar, Lemon Squeezy), authentication providers, file storage (AWS S3), and transactional email services (SendGrid, MailGun, SMTP)—MUST be decoupled behind modular adapter interfaces. Extending or swapping external services MUST NOT require modifying core business logic.

### III. Automated Verification & Test Discipline
Core domain logic, payment handling, and user authentication workflows MUST be validated via automated testing (including Playwright E2E suites and unit tests). Pull requests containing modified business logic MUST NOT be merged without passing test suites.

### IV. Code Quality, Formatting & Static Analysis Compliance
All JavaScript, TypeScript, CSS, and configuration files MUST pass strict linting (`npm run lint`) and Prettier formatting checks (`npm run prettier:check`). Code style deviations MUST be resolved prior to merging PRs or committing changes to main branches.

### V. Spec-Driven & AI-Ready Development
Feature additions and refactoring MUST follow spec-driven development practices utilizing structured `.specify/` artifacts (spec, plan, tasks). Codebases, component interfaces, and documentation MUST remain clean and structured to maximize developer velocity and AI-assisted pair programming effectiveness.

## Technical Stack & Architectural Constraints
- **Framework & Backend**: Wasp full-stack framework with Node.js and Prisma ORM.
- **Frontend & Styling**: React, Tailwind CSS, and ShadCN UI for accessible, modular user interfaces.
- **Documentation**: Starlight / Astro framework for project documentation and developer guides.
- **Tooling Standards**: Node.js ES Modules, TypeScript (strict mode), ESLint v9+, and Prettier v3+.

## Quality Assurance & Workflow
- **Static Analysis Gate**: Every contribution MUST pass `npm run prettier:check` and `npm run lint`.
- **Testing Gate**: Critical workflows (auth, checkout, user management) MUST have covering Playwright end-to-end tests.
- **Code Reviews**: Code changes MUST undergo peer review verifying compliance with core architecture principles before deployment.

## Governance
- **Supremacy**: This Constitution supersedes all informal or ad-hoc development guidelines within this repository.
- **Amendments**: Amendments to this Constitution require a documented Pull Request, explicit rationale, and a Sync Impact Report update.
- **Versioning Policy**:
  - MAJOR version bump: Backward-incompatible principle modifications or redefinitions.
  - MINOR version bump: Addition of new principles or significant structural additions.
  - PATCH version bump: Wording clarifications, typo fixes, or non-semantic formatting updates.
- **Compliance Review**: All feature design plans (`plan.md`) MUST include a Constitution Check gate verifying alignment with these principles before implementation begins.

**Version**: 1.0.0 | **Ratified**: 2026-08-06 | **Last Amended**: 2026-08-06
