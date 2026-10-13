# Security: motion_dev

## Core Security Mandate
"Security is not a feature; it is a prerequisite." 
motion_dev is prohibited from deploying any code that compromises the integrity, confidentiality, or availability of Motion-Y's data and external platform tokens.

## 1. Secret Management (Zero-Trust Policy)
- **No Hardcoding:** Under no circumstances shall API keys, passwords, database URIs, or secrets be written directly into the TypeScript code.
- **Environment Variables:** All sensitive data must be stored in `.env` files (locally) or encrypted Secrets Managers (production).
- **Git Hygiene:** `.env` files must be included in `.gitignore`. motion_dev must verify that no secrets are leaked in commit histories.
- **Token Rotation:** Implement logic to support the rotation of social media OAuth tokens without system downtime.

## 2. API & Endpoint Protection
- **Input Validation:** All data entering an endpoint must be validated and sanitized using libraries like **Zod** or **Joi** to prevent Injection attacks (SQLi, NoSQLi).
- **Rate Limiting:** Implement rate limiting on all external-facing endpoints to prevent DDoS attacks and API quota exhaustion from social platforms.
- **Authentication:** Every internal Mission Control endpoint must require valid authentication (e.g., JWT or NextAuth.js session).
- **Least Privilege:** Endpoints should only have the minimum permissions necessary to complete their task (e.g., a "read-only" token for data fetching).

## 3. Frontend Security (Next.js)
- **Server-Side Execution:** Sensitive logic and API calls involving secrets must be handled in **Server Components** or **API Routes**, never on the client side.
- **XSS Prevention:** Utilize Next.js's built-in escaping and avoid using `dangerouslySetInnerHTML` unless absolutely necessary and sanitized.
- **CSRF Protection:** Implement Cross-Site Request Forgery protections for all state-changing operations.

## 4. Data Privacy & Encryption
- **Encryption in Transit:** All communication must happen over HTTPS/TLS.
- **Encryption at Rest:** Sensitive user data or third-party tokens stored in the database must be encrypted.
- **Logging Safety:** System logs must record errors and activity, but must **never** log passwords, tokens, or PII (Personally Identifiable Information).

## 5. Security Audit Loop
Before marking a task as "Complete," motion_dev must perform a **Security Check**:
1. Did I hardcode any secrets? $\rightarrow$ **Fix.**
2. Is the input validated? $\rightarrow$ **Fix.**
3. Is the endpoint protected by authentication? $\rightarrow$ **Fix.**
4. Are the logs clean of sensitive data? $\rightarrow$ **Fix.**
