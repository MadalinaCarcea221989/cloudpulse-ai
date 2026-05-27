# Tests

## Overview

This project uses:
- Playwright for end-to-end tests in `tests/e2e/`
- Vitest + React Testing Library for unit/component tests in `tests/unit/`

## Required Environment Variables

Set these before running E2E tests:

- `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `E2E_TEST_EMAIL` (optional, defaults to `e2e-test-user@cloudpulse.test`)
- `E2E_TEST_PASSWORD` (optional, defaults to `TestPassword123!`)
- `PLAYWRIGHT_BASE_URL` (optional, defaults to `http://localhost:3000`)
- `PLAYWRIGHT_TEST` (optional, set to `true` to enable test-only config)

The `/__e2e__/error` route is used to validate error boundaries. It throws once per session and then renders a recovery view.

## Running Unit Tests

```bash
npm run test:unit
```

## Running E2E Tests

1. Start the app in another terminal:

```bash
npm run dev
```

2. Run Playwright:

```bash
npm run test:e2e
```

## Running All Tests

```bash
npm run test:all
```
