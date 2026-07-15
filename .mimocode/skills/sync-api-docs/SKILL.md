---
name: sync-api-docs
description: Sync application code with API_DOCS.md changes. Reads the updated doc, compares against existing implementation, and applies all necessary code changes.
---

# Sync App with API_DOCS.md

When the user updates `API_DOCS.md` and asks to sync the app, follow this workflow:

## Steps

1. **Read API_DOCS.md** — parse all endpoints, request/response schemas, field names, and types.
2. **Identify affected files** — scan `src/` for:
   - Type/interface definitions matching doc schemas
   - API client functions calling documented endpoints
   - Components rendering documented fields
   - Forms handling documented request bodies
3. **Diff and update** — for each discrepancy:
   - Update TypeScript interfaces to match doc field names and types
   - Update API client functions for new/changed endpoints
   - Update component props, state, and rendering for changed fields
   - Update form fields and validation for changed request bodies
4. **Verify** — run `npx tsc --noEmit` (or project's type check command) to catch type errors.
5. **Report** — summarize all changes made, grouped by file.

## Rules

- Never guess field types — always read the doc's JSON examples.
- Preserve existing logic; only change what the doc changed.
- If a field was renamed, update all references (types, API calls, components).
- If a new endpoint was added, add the API client function and note it for UI implementation.
- If a field was removed, remove it from types and all references.
