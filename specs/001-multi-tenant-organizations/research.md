# Research: Multi-Tenancy & Organizations

**Feature**: Multi-Tenancy & Organizations (`001-multi-tenant-organizations`)  
**Date**: 2026-08-06  
**Status**: Complete  

## Research Topics & Decisions

### 1. Multi-Tenant Context & Data Isolation Strategy

- **Decision**: Multi-tenancy will be implemented using a shared database, schema-per-tenant isolation approach via explicit `organizationId` scoping on all tenant-specific Prisma models.
- **Rationale**:
  - Open SaaS utilizes Wasp and Prisma ORM with PostgreSQL.
  - Adding `organizationId` foreign keys to tenant-owned entities with compound indices (`[organizationId, id]`) provides row-level isolation.
  - Server-side Wasp operations (Queries & Actions) will extract the current user from context (`context.user`), query `OrganizationMember` to confirm membership, and restrict Prisma queries to the active `organizationId`.
- **Alternatives Considered**:
  - *Database-per-tenant*: Unnecessary operational overhead for early and mid-stage SaaS applications.
  - *Client-driven filtering*: High risk of data leaks if client forgets to pass tenant ID or tampers with requests.

---

### 2. Role-Based Access Control (RBAC) Architecture

- **Decision**: Define a three-tier hierarchical role structure (`OWNER`, `ADMIN`, `MEMBER`) as an enum on the `OrganizationMember` entity, paired with backend authorization guard functions.
- **Rationale**:
  - `OWNER`: Full administrative access + ability to transfer ownership, delete organization, and manage billing.
  - `ADMIN`: Ability to invite members, update roles, and manage workspace resources (except ownership transfer and billing destruction).
  - `MEMBER`: Access to standard workspace features and resources; restricted from settings and member management.
  - Centralizing permissions in re-usable guard functions (`assertOrgRole(user, orgId, minRole)`) ensures consistent security policy enforcement across all Wasp operations.
- **Alternatives Considered**:
  - *Fine-grained permission strings (e.g., `org:members:write`)*: Over-engineered for standard SaaS team management MVP.

---

### 3. Invitation Token & Acceptance Workflow

- **Decision**: Implement time-bound, single-use invitation records (`OrganizationInvite`) with 256-bit cryptographically secure tokens, dispatched via Wasp mailer integration.
- **Rationale**:
  - Expiration period set to 7 days by default.
  - Unauthenticated users clicking the link enter a sign-up/sign-in flow with the invite token preserved in session query params, automatically adding them to the organization upon successful authentication.
  - Existing users clicking the link immediately accept the invite and switch active workspace context.
- **Alternatives Considered**:
  - *Public join links without email restriction*: High security risk of unauthorized workspace joining.
