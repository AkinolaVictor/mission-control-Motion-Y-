# TOOLS.md

## Agent: ddse
**Role:** General Purpose Autonomous Agent
**Scope:** Universal Task Execution

---

### 1. Architectural Overview
The `ddse` agent is designed as a flexible, general-purpose entity. Given the open-ended nature of its description ("anything"), the agent must be equipped with a modular toolset that allows it to pivot between diverse operational domains—ranging from data analysis and creative synthesis to technical execution and information retrieval.

The tool architecture is based on a **Dynamic Capability Framework**, allowing the agent to select the most appropriate tool based on the real-time intent of the user request.

---

### 2. Core Capability Modules

#### 2.1 Information Retrieval & Knowledge Acquisition
To handle "anything," the agent requires a robust mechanism for sourcing external data.
*   **Web Search Engine:** Ability to perform real-time queries to retrieve current events, documentation, and factual data.
*   **Document Parser:** Tools for reading and analyzing PDFs, CSVs, TXT, and Markdown files to extract structured information from unstructured sources.
*   **API Connector:** A generic interface to fetch data from third-party RESTful services.

#### 2.2 Computation & Logic Execution
To ensure precision in technical tasks, the agent utilizes isolated execution environments.
*   **Code Interpreter (Python Sandbox):** A secure environment for executing complex calculations, data manipulation, and algorithmic problem solving.
*   **Mathematical Solver:** Integration with symbolic math libraries for high-precision algebraic and calculus operations.
*   **Data Visualization Suite:** Capabilities to generate charts, graphs, and diagrams to represent complex data sets.

#### 2.3 Content Synthesis & Generation
To fulfill creative or administrative requirements, the agent employs generative utility tools.
*   **Multi-Format Exporter:** Tools to output results in specific formats (JSON, XML, HTML, Markdown, LaTeX).
*   **Text Refinement Engine:** Specialized prompts/tools for adjusting tone, style, and length based on the target audience.
*   **Structuring Tool:** Ability to convert raw brainstormed data into formal frameworks (e.g., SWOT analysis, Gantt charts, Project Charters).

---

### 3. Tool Integration Matrix

| Capability | Tool Name | Primary Use Case | Output Type |
| :--- | :--- | :--- | :--- |
| **Discovery** | `web_search` | Real-time factual verification | Text/URL |
| **Analysis** | `py_executor` | Data processing & Logic | Value/Plot |
| **Synthesis** | `fmt_generator` | Document creation | File/String |
| **Extraction** | `doc_reader` | Knowledge ingestion | Structured Text |

---

### 4. Operational Constraints & Safety
*   **Sandbox Isolation:** All code execution must occur in a containerized environment to prevent system-level interference.
*   **Verification Loop:** When utilizing `web_search`, the agent must cross-reference multiple sources to ensure factual accuracy.
*   **Rate Limiting:** API calls must adhere to the specified provider quotas to maintain service stability.
*   **Permissioning:** Any tool that modifies external state (Write access) requires explicit user confirmation.