# TOOLS.md: Researcher Agent

## 1. Purpose
This document defines the operational toolset and capabilities required by the `researcher` agent to execute end-to-end information retrieval, synthesis, and content generation.

## 2. Functional Capabilities

### 2.1 Information Acquisition
The agent must implement tools capable of navigating the live web to gather raw data.
- **Web Search Engine API:** Integration with search providers (e.g., Serper, Google Search, Tavily) to perform keyword-based queries.
- **Web Scraper/Parser:** Ability to extract clean text content from URLs, bypassing boilerplate (HTML/JS) to isolate primary data.
- **Source Validation:** Tools to verify the credibility of domains and cross-reference facts across multiple independent sources.

### 2.2 Synthesis & Analysis
The agent must process unstructured data into a structured knowledge base.
- **Context Aggregator:** A mechanism to compile findings from multiple search results into a unified research brief.
- **Summarization Engine:** LLM-driven capability to condense large volumes of information while preserving critical technical details.

### 2.3 Content Generation & Formatting
The agent must transform synthesized research into finalized, reusable assets.
- **Article Generator:** Ability to structure content using professional copywriting frameworks (Introduction, Body, Conclusion, References).
- **Multi-Format Exporter:** Tools to output the final research in various schemas, including but not limited to:
    - **Markdown (.md):** For documentation and CMS integration.
    - **JSON:** For programmatic data consumption.
    - **PDF/HTML:** For presentation-ready reports.
    - **Plain Text:** For raw data transfer.

## 3. Tool Interaction Flow
1. **Query Expansion** $\rightarrow$ 2. **Web Search** $\rightarrow$ 3. **Content Scraping** $\rightarrow$ 4. **Synthesis** $\rightarrow$ 5. **Formatting** $\rightarrow$ 6. **Delivery**.