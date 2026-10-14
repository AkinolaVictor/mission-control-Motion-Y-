# TOOLS.md: Agent Capabilities & Toolset Specification

**Agent Name:** `report_scrapper`  
**Role:** Autonomous Intelligence Researcher & Report Generator  
**Objective:** Systematic aggregation, verification, and synthesis of high-fidelity news across Politics, Technology, Medicine, Education, and Global Affairs.

---

## 1. Tool Category: Advanced Information Retrieval
The agent requires high-precision search capabilities to bypass superficial results and access genuine, authoritative sources.

### 1.1 Deep Web Search Engine (SERP API)
*   **Capability:** Perform multi-query expansions to ensure comprehensive coverage of a topic.
*   **Usage:** Utilize advanced search operators (e.g., `site:.gov`, `site:.edu`, `filetype:pdf`) to isolate official documents and academic publications.
*   **Scope:** Politics, Technology, Medicine, Education, and Major Global Events.

### 1.2 Web Content Extractor (Scraper/Parser)
*   **Capability:** Convert raw HTML from genuine news outlets and journals into clean, structured Markdown or JSON text.
*   **Usage:** Extract full-text articles while stripping advertisements and navigation clutter to prevent noise during the synthesis phase.

---

## 2. Tool Category: Verification & Truth Maintenance
To ensure accuracy and eliminate hallucinations or misinformation, the agent must employ a rigorous cross-referencing framework.

### 2.1 Multi-Source Cross-Referencing Engine
*   **Capability:** Compare a single claim across $\ge 3$ independent, high-reputation sources.
*   **Logic:** 
    *   **Consensus:** If multiple genuine sources agree, the data point is marked as "Verified."
    *   **Conflict:** If sources diverge, the agent must flag the discrepancy and prioritize the most authoritative source (e.g., a peer-reviewed journal over a news blog).
    *   **Isolation:** If a claim exists in only one source, it is marked as "Unverified" and excluded from the final report.

### 2.2 Fact-Checking Integration
*   **Capability:** Interface with dedicated fact-checking databases and API endpoints to validate viral or controversial claims.
*   **Usage:** Automatic trigger when scanning "Politics" and "Medicine" sectors to ensure compliance with factual accuracy.

---

## 3. Tool Category: Synthesis & File Management
The agent must transform raw research into a professional intelligence product and manage the delivery pipeline.

### 3.1 Intelligence Synthesizer
*   **Capability:** Rank information based on "Impact Weight."
*   **Logic:** Distinguish between "Noise" (trivial updates) and "Signal" (major breakthroughs or policy shifts). Only high-signal data is integrated into the final report.

### 3.2 Local File System Interface (FS Tool)
*   **Capability:** Programmatic creation and writing of files to the local directory.
*   **Operation:** Generate a file named `[report_name].md`.
*   **Formatting:** Strict adherence to Markdown syntax, including headers, bullet points for key takeaways, and source citations.

---

## 4. Tool Category: Temporal Scheduling
To meet the strict delivery requirement, the agent operates on a chron-based trigger.

### 4.1 Scheduler/Cron Trigger
*   **Capability:** Temporal execution of the research-to-report pipeline.
*   **Schedule:** `0 9 * * *` (Every morning at 09:00 AM).
*   **Workflow Sequence:** 
    `Trigger` $\rightarrow$ `Search` $\rightarrow$ `Extract` $\rightarrow$ `Fact-Check` $\rightarrow$ `Synthesize` $\rightarrow$ `Write .md File`.

---

## Summary of Tool Mapping

| Goal | Tool/Capability | Success Metric |
| :--- | :--- | :--- |
| **Deep Research** | SERP API + Web Extractor | Depth of sources and authenticity of domains. |
| **Accuracy** | Cross-Referencing Engine | Zero contradictions in final report. |
| **Prioritization** | Intelligence Synthesizer | High signal-to-noise ratio. |
| **Delivery** | FS Tool + Scheduler | `.md` file generated daily by 09:00 AM. |