# TOOLS.md: read_and_document Agent

## 1. Architectural Overview
The `read_and_document` agent is engineered to automate the ingestion, synthesis, and formal documentation of emerging research updates. To achieve high-fidelity output, the agent requires a specialized toolset capable of traversing academic repositories, parsing complex document formats, and managing structured knowledge bases.

## 2. Tool Categories & Capability Requirements

### 2.1 Data Acquisition Tools (Ingestion)
The agent must interface with external research sources to identify and retrieve new publications.
- **Academic API Connectors**: Integration with APIs such as arXiv, PubMed, IEEE Xplore, or Semantic Scholar for real-time query execution and metadata retrieval.
- **Web Scrapers/Crawlers**: Headless browser capabilities to extract content from research blogs, university press releases, and pre-print servers.
- **PDF Parser**: High-precision OCR and layout-aware parsing tools to convert academic PDFs into structured Markdown or JSON, preserving citations, tables, and mathematical notation.

### 2.2 Information Processing Tools (Synthesis)
To transform raw research data into documentation, the agent utilizes cognitive processing tools.
- **Summarization Engine**: LLM-driven modules designed for "Abstractive Summarization" to distill complex methodology and results into concise updates.
- **Entity Extraction**: Named Entity Recognition (NER) to identify key researchers, institutions, specific algorithms, and newly defined terminology.
- **Cross-Reference Engine**: A tool to compare new findings against existing internal documentation to identify contradictions, validations, or evolutionary leaps in the research.

### 2.3 Documentation & Output Tools (Persistence)
The final phase requires tools to commit the synthesized data into a permanent, readable format.
- **Markdown Generator**: A templating engine to ensure all research updates follow a standardized architectural format (e.g., Summary $\rightarrow$ Methodology $\rightarrow$ Key Findings $\rightarrow$ Impact).
- **Knowledge Base Interface**: Read/Write access to the system's central documentation repository (e.g., Notion API, Obsidian vault, or Git-based Wiki).
- **Version Control Integration**: Capabilities to commit updates via Git, ensuring a traceable history of how research understanding has evolved over time.

## 3. Operational Workflow Mapping

| Phase | Tool Required | Input | Output |
| :--- | :--- | :--- | :--- |
| **Discovery** | Academic API Connector | Search Keywords | List of URLs/DOIs |
| **Extraction** | PDF Parser | Raw PDF/HTML | Structured Text |
| **Analysis** | Summarization Engine | Structured Text | Key Insights/Bullet Points |
| **Documentation**| Markdown Generator | Key Insights | Final `.md` Research Note |
| **Persistence** | Knowledge Base Interface| Final `.md` Note | Updated Documentation Repository |

## 4. Constraint & Safety Parameters
- **Source Verification**: The agent must utilize a tool to verify the peer-review status of a paper before flagging it as "Verified Research."
- **Token Management**: For exceptionally long research papers, the agent must utilize a "Chunking & Map-Reduce" strategy to avoid context window overflow.
- **Deduping Logic**: A hashing tool must be employed to check if a research update has already been documented to prevent redundant entries.