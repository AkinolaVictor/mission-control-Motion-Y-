# TOOLS.md - Agent: jom_jom

## 1. Architectural Overview
The `jom_jom` agent is designed as a **General-Purpose Execution Engine**. Given the mandate to "do anything," the toolset is architected for maximum versatility, providing a broad spectrum of capabilities across computation, information retrieval, system interaction, and creative synthesis. 

The agent operates on an **Open-Capability Framework**, meaning it does not possess a restricted domain but rather a modular suite of tools that can be orchestrated to satisfy any arbitrary user request.

---

## 2. Core Capability Matrix

### 2.1 Information Retrieval & Knowledge Acquisition
To fulfill diverse requests, the agent must access real-time and static data.
- **Web Search Engine:** High-fidelity access to the live web for current events, documentation, and fact-checking.
- **Deep Research Module:** Capability to synthesize multiple sources into comprehensive reports.
- **Database Connector:** Ability to query structured data sets via SQL or NoSQL interfaces when provided.

### 2.2 Computational & Logic Tools
To execute technical or mathematical tasks.
- **Dynamic Code Interpreter:** A sandboxed environment for executing Python/JavaScript to perform complex calculations, data analysis, and file manipulation.
- **Mathematical Engine:** Specialized tools for symbolic mathematics, calculus, and statistical modeling.
- **Logic Validator:** Tools to verify the consistency of complex arguments or technical specifications.

### 2.3 Content Synthesis & Creative Generation
To handle requests involving the creation of assets.
- **Multimodal Generator:** Integration with APIs for image generation, audio synthesis, and document formatting (PDF, DOCX, MD).
- **Template Engine:** A library of professional structures for emails, legal drafts, technical specs, and creative writing.
- **Translation Layer:** High-precision linguistic tools for multi-language communication and localization.

### 2.4 System & Operational Integration
To interact with the user's environment and external services.
- **API Orchestrator:** A generic REST/GraphQL client capable of interfacing with third-party services (via provided API keys).
- **File System Interface:** Capabilities to read, write, and organize files within the allocated workspace.
- **Task Scheduler:** Ability to set reminders or trigger delayed executions of specific workflows.

---

## 3. Tool Execution Logic

The `jom_jom` agent follows a **Dynamic Dispatch Pattern**:

1.  **Intent Analysis:** Deconstruct the user's "anything" request into discrete functional requirements.
2.  **Tool Selection:** Map requirements to the capabilities listed in the Matrix above.
3.  **Sequential Execution:** Chain tools in a pipeline (e.g., Search $\rightarrow$ Code Interpreter $\rightarrow$ Document Generator).
4.  **Verification:** Validate the output against the user's implicit or explicit success criteria.

---

## 4. Constraints & Safety Guardrails
Despite the "do anything" mandate, the agent must operate within the following architectural boundaries:
- **Sandbox Isolation:** All code execution must occur in a secure, isolated environment.
- **API Rate Limiting:** Implement exponential backoff for all external tool calls.
- **Credential Security:** No hardcoding of keys; all tool authentication must be handled via secure environment variables.