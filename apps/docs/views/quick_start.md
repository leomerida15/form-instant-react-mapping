## Quick start guide

### 1. Installation and dependency order

Install in this order (or all at once in a monorepo):

1. **React** (peer)

   ```bash
   bun add react react-dom
   # or: npm i react react-dom
   ```
2. **Zod** (for defining schemas)

   ```bash
   bun add zod
   # or: npm i zod
   ```
3. **@form-instant/react-input-mapping** (field → component mapping)

   ```bash
   bun add @form-instant/react-input-mapping
   # or: npm i @form-instant/react-input-mapping
   ```
4. **@form-instant/react-resolver-zod** (resolves Zod schema and provides `FormInstantProvider` / `FormInstantElement`)

   ```bash
   bun add @form-instant/react-resolver-zod
   # or: npm i @form-instant/react-resolver-zod
   ```

   This package has as peers: `react`, `@form-instant/react-input-mapping`, and `zod`. Without the mapping installed first, the resolver cannot resolve fields.

**Summary:** `react` → `zod` → `@form-instant/react-input-mapping` → `@form-instant/react-resolver-zod`.
