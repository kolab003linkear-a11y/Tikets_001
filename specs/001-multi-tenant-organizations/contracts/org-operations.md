# Interface Contract: Organization Operations & Wasp RPCs

**Feature**: Multi-Tenancy & Organizations (`001-multi-tenant-organizations`)  
**Date**: 2026-08-06  

## Operations Overview

All operations are defined as Wasp Queries (read) or Wasp Actions (write) with full TypeScript static typing.

---

### 1. `createOrganization` (Action)

Creates a new organization workspace and assigns the current user as `OWNER`.

- **Input**:
  ```ts
  type CreateOrganizationInput = {
    name: string;
    slug?: string;
  }
  ```
- **Output**:
  ```ts
  type CreateOrganizationPayload = {
    id: string;
    name: string;
    slug: string;
    role: "OWNER";
  }
  ```

---

### 2. `switchActiveOrganization` (Action)

Updates user session context to target an active workspace.

- **Input**:
  ```ts
  type SwitchActiveOrganizationInput = {
    organizationId: string;
  }
  ```
- **Output**:
  ```ts
  type SwitchActiveOrganizationPayload = {
    activeOrganizationId: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
  }
  ```

---

### 3. `getUserOrganizations` (Query)

Retrieves all organizations the current user belongs to.

- **Input**: `void`
- **Output**:
  ```ts
  type OrganizationListItem = {
    id: string;
    name: string;
    slug: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
    memberCount: number;
  }[]
  ```

---

### 4. `sendOrganizationInvite` (Action)

Sends an email invitation to join the specified organization.

- **Input**:
  ```ts
  type SendInviteInput = {
    organizationId: string;
    email: string;
    role: "ADMIN" | "MEMBER";
  }
  ```
- **Output**:
  ```ts
  type SendInvitePayload = {
    inviteId: string;
    token: string;
    expiresAt: string;
  }
  ```

---

### 5. `acceptOrganizationInvite` (Action)

Validates an invite token and adds the user to the organization.

- **Input**:
  ```ts
  type AcceptInviteInput = {
    token: string;
  }
  ```
- **Output**:
  ```ts
  type AcceptInvitePayload = {
    organizationId: string;
    organizationName: string;
    role: "ADMIN" | "MEMBER";
  }
  ```
