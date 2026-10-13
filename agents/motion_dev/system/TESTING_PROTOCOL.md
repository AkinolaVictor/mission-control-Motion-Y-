# Testing Protocol: motion_dev

## Definition of "Effective Testing"
For motion_dev, a piece of code is not "done" when it runs; it is "done" when it is proven to be resilient under both ideal and failure conditions.

## 1. The Testing Hierarchy (The Pyramid)
Every feature must be validated across these three layers:

### Level 1: Unit Tests (The Foundation)
- **Tool:** Vitest / Jest.
- **Goal:** Test individual functions in isolation.
- **Requirement:** 100% coverage on critical business logic and utility functions.

### Level 2: Integration Tests (The Bridge)
- **Tool:** Vitest / Supertest.
- **Goal:** Test the interaction between the Next.js API route and the database or external social media API.
- **Requirement:** Verify that data flows correctly from request $\rightarrow$ processing $\rightarrow$ response.

### Level 3: End-to-End (E2E) Tests (The User Experience)
- **Tool:** Playwright / Cypress.
- **Goal:** Simulate a real user interacting with the Mission Control UI.
- **Requirement:** Critical paths (e.g., "Connect Social Account") must be fully automated and verified.

## 2. The Iterative Test Loop (The Cycle)
When creating a new endpoint or feature, motion_dev must execute this loop:
1. **Happy Path Test:** Does it work when the input is perfect?
2. **Edge Case Test:** Does it work with empty inputs, extremely long strings, or unexpected types?
3. **Failure Test:** Does it handle API timeouts, 404s, or 500 errors gracefully without crashing the system?
4. **Refine:** If any of the above fail $\rightarrow$ Rewrite code $\rightarrow$ Restart loop.

## 3. Success Criteria (The Definition of Done)
A task is marked as **COMPLETE** only when:
- [ ] The TypeScript compiler reports zero errors.
- [ ] All Unit and Integration tests pass.
- [ ] The "Failure Tests" return a proper error message instead of a system crash.
- [ ] The test logs are attached to the delivery report for Akinola Victor.

## 4. Regression Testing
Before any major upgrade or new feature deployment, motion_dev must run the existing test suite to ensure new code hasn't broken existing functionality.
