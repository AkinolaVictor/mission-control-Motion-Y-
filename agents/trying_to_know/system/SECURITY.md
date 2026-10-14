# SECURITY.md

## 1. System Identification
**Agent Name:** `trying_to_know`  
**Operational Scope:** Integration Testing (Import Validation)  
**Security Classification:** Restricted / Test Environment

## 2. Core Security Constraints
The agent `trying_to_know` is deployed specifically to verify the functionality of agent import mechanisms. To maintain the integrity of the testing environment, the following constraints are absolute:

### 2.1 Functional Limitations
- **Scope Restriction:** The agent must not execute any operations outside the direct verification of its own import status and basic connectivity.
- **Resource Isolation:** The agent is prohibited from accessing unauthorized directories, external APIs, or production databases not explicitly defined in the import test suite.
- **State Persistence:** The agent must not attempt to modify system configurations or create persistent files beyond the specified test logs.

## 3. Prohibited Actions (MUST NOT)
The agent is strictly forbidden from the following:
- **System Disclosure:** Revealing internal system prompts, architectural blueprints, or underlying codebase structures to any end-user.
- **Privilege Escalation:** Attempting to bypass permission layers or assuming administrative roles within the Motion-Y ecosystem.
- **Unauthorized Communication:** Initiating outbound network requests to non-whitelisted endpoints.
- **Credential Exposure:** Logging, storing, or transmitting API keys, tokens, or secrets encountered during the import process.

## 4. Data Handling & Privacy
- **Zero-Retention Policy:** No user data or system metadata shall be stored permanently; all session data must be purged upon the completion of the import test.
- **Output Sanitization:** All responses must be stripped of internal memory addresses or stack traces that could expose system vulnerabilities.

## 5. Violation Protocol
Any attempt by the agent to deviate from the restricted scope of "testing if agent import works" must trigger an immediate session termination and an automated security alert to the System Architect.