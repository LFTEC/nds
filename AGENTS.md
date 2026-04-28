# AGENTS.md

This file provides guidance for AI coding agents working in this repository.

## Project Overview

NDS (紫菜营养评价系统) - A Next.js 15 application for nori (seaweed) nutrition evaluation. Uses TypeScript, PostgreSQL/Prisma, NextAuth.js v5, Radix UI, and Tailwind CSS.

---

## Build / Lint / Test Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint on entire codebase |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma migrate dev` | Run database migrations |

ESLint configuration is in `eslint.config.mjs`. No test framework is currently configured.

---

## TypeScript Configuration

- **Strict mode enabled** (`"strict": true` in tsconfig.json)
- Path alias: `@/*` maps to `./src/*`
- JSX: `react-jsx`
- Module resolution: `bundler`

---

## Code Style Guidelines

### Imports

```typescript
// Use @/ alias for internal imports
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

// External packages
import { z } from "zod";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
```

**Import ordering pattern:**
1. External packages (React, Radix UI, etc.)
2. Internal @/ imports (lib, components, services)
3. Types from generated Prisma client

### File Naming

- **React components**: `PascalCase.tsx` (e.g., `DataTable.tsx`, `AppSidebar.tsx`)
- **Services / utilities**: `camelCase.ts` (e.g., `noriService.ts`, `utils.ts`)
- **Route handlers**: `route.ts`
- **Data schemas**: `*Data.ts` (e.g., `registryData.ts`)

### Component Patterns

**Server Components** (default):
```typescript
// src/app/main/page.tsx
export default async function Page() {
  // async allowed for server components
}
```

**Client Components** (when needed):
```typescript
"use client";
import * as React from "react";
```

**Server Actions**:
```typescript
// src/services/noriService.ts
"use server";
export async function someAction(data: SomeType) { ... }
```

### Class Name Merging

Always use `cn()` utility from `@/lib/utils` for conditional class names:

```typescript
import { cn } from "@/lib/utils";

<div className={cn("base-class", condition && "conditional-class", className)}>
```

### Types and Interfaces

```typescript
// Interface naming: PascalCase, no "I" prefix
interface RegistryDataType {
  nori_id: string;
  vendor: string;
}

// Error state interface (standard pattern)
export interface errorState {
  state: "error" | "warning" | "success";
  message?: string | null;
  data?: any;
}
```

### Zod Schemas

Use Zod for validation, especially in forms and API routes:

```typescript
import { z } from "zod";

export const formSchema = z.object({
  vendor: z.string().min(1, "请录入厂家"),
  exhibitionDate: z.coerce.date(),
});
```

### Prisma Usage

```typescript
// Import Prisma client singleton from lib/prisma
import prisma from "@/lib/prisma";
import { Prisma } from "generated/prisma";

// Check for known Prisma errors with helper
import { isPrismaClientKnownError } from "@/lib/prisma";

if (isPrismaClientKnownError(error)) {
  if (error.code === "P2002") { /* handle unique constraint */ }
}
```

### Error Handling Pattern

**For service functions** (return errorState):
```typescript
export async function updateNori(id: string, data: SomeType): Promise<errorState & { data?: any }> {
  try {
    // do work
    return { state: "success", data: result };
  } catch (error) {
    logger.error("描述操作失败", { error });
    return { state: "error", message: "用户友好的错误信息" };
  }
}
```

**For API routes** (return NextResponse):
```typescript
export async function POST(request: Request) {
  try {
    // do work
    return NextResponse.json({ state: "success" });
  } catch (error: any) {
    logger.error("操作描述", { error });
    return NextResponse.json({ state: "error", message: "错误信息" }, { status: 500 });
  }
}
```

### Logging

Use Winston logger from `@/lib/logger` instead of `console.log`:

```typescript
import logger from "@/lib/logger";

logger.debug("调试信息", { context: data });
logger.info("操作信息");
logger.warn("警告信息");
logger.error("错误信息", { error });
```

### UI Components

UI components are in `src/components/ui/` based on Shadcn/radix-ui patterns:

```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
```

**Button variants** use `class-variance-authority` (cva):
```typescript
<Button variant="default" size="default">
<Button variant="destructive" size="sm">
<Button variant="ghost" size="icon">
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| React components | PascalCase | `DataTable`, `AppSidebar` |
| Functions/variables | camelCase | `getNoriList`, `totalPages` |
| Database fields | snake_case | `batch_no`, `exhibition_date` |
| Prisma schema | PascalCase | `batchNo`, `exhibitionDate` |
| CSS classes | kebab-case | `bg-primary`, `text-destructive` |
| Files | kebab/ Pascal | `data-table.tsx`, `registryData.ts` |

### Database Field Mapping

Raw SQL results use snake_case; Prisma models use camelCase:

```typescript
// Raw SQL result
const result = await prisma.$queryRaw<registryDataType[]>`SELECT * FROM t_nori_info`;

// Map to Prisma model
const nori = {
  id: r.nori_id,           // snake_case -> camelCase
  vendor: r.vendor,
  exhibitionDate: r.exhibition_date,
};
```

---

## Directory Structure

```
src/
├── app/           # Next.js App Router pages and API routes
│   ├── api/       # API route handlers
│   ├── login/     # Authentication pages
│   └── main/      # Main application pages
├── components/    # Shared React components
│   └── ui/        # Shadcn/radix-ui base components
├── hooks/         # Custom React hooks
├── lib/           # Utilities (prisma, logger, utils)
├── services/      # Business logic and data access
└── data/          # Zod schemas and data types
```

---

## ESLint Rules

The following rules are customized in `eslint.config.mjs`:

```javascript
'react-hooks/exhaustive-deps': 'off'
'@typescript-eslint/no-explicit-any': 'off'
'@typescript-eslint/no-non-null-asserted-optional-chain': 'off'
```

---

## Environment Variables

Required for development:
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - NextAuth.js secret
- `AUTH_URL` - Auth base URL
- `ELASTICSEARCH_*` - Elasticsearch logging config (optional for dev)

---

## Common Tasks

**Adding a new UI component:**
1. Create file in `src/components/ui/` following existing patterns
2. Use `cn()` for class merging
3. Export both component and variants (if applicable)

**Adding a new API route:**
1. Create `route.ts` in `src/app/api/[resource]/`
2. Use `NextResponse.json()` for responses
3. Use `logger` for error logging
4. Validate input with Zod schemas

**Adding a database table:**
1. Update `prisma/schema.prisma`
2. Run `npx prisma generate` to update types
3. Generated client is in `node_modules/generated/prisma`
