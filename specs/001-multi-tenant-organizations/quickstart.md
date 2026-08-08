# Quickstart & Validation Guide: Multi-Tenancy & Organizations

**Feature**: Multi-Tenancy & Organizations (`001-multi-tenant-organizations`)  
**Date**: 2026-08-06  

## Overview

This guide describes how to run and manually/automatically validate the multi-tenancy and organization workflows.

## Prerequisites

1. Active development server running (`wasp db migrate-dev` applied).
2. Local database initialized.
3. Test user accounts created (User A and User B).

## Runnable Scenarios

### Scenario 1: Create Organization & Workspace Switching

1. Sign in as **User A**.
2. Navigate to Dashboard -> Click workspace selector dropdown -> Click "Create New Organization".
3. Enter Name: `Acme Corp`.
4. **Verification**: 
   - Organization `Acme Corp` is created.
   - User A is assigned role `OWNER`.
   - UI workspace context switches to `Acme Corp`.

---

### Scenario 2: Inviting Team Members & Joining

1. As **User A** (Owner of Acme Corp), navigate to Settings -> Members -> Click "Invite Member".
2. Enter email: `userB@example.com`, Role: `Admin`.
3. Copy generated invite link or inspect invitation token in DB/console logs.
4. Sign out of User A, sign in as **User B** (or open incognito browser tab).
5. Open invite URL: `http://localhost:3000/invite/<token>`.
6. Click "Accept Invitation".
7. **Verification**:
   - User B is added to `Acme Corp` with role `ADMIN`.
   - Active workspace for User B switches to `Acme Corp`.
