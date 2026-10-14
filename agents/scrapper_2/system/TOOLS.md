# TOOLS.md - System Capabilities Specification: scrapper_2

## 1. Overview
`scrapper_2` is an autonomous Intelligence Gathering and Reporting Agent designed for high-fidelity data acquisition across specific vertical domains: Politics, Technology, Medicine, and Education. The agent's operational core relies on a cycle of deep discovery, rigorous verification, and automated documentation.

## 2. Toolset Requirements

### 2.1. Advanced Web Search & Discovery
To satisfy the requirement for "deep and detailed search," the agent must utilize tools capable of bypassing surface-level results.
- **Search Engine API (e.g., Serper.dev, Google Custom Search):** Ability to execute complex boolean queries and filter by time (Last 24 hours) to ensure news is "latest."
- **Domain-Specific Crawlers:** Capabilities to target high-authority domains (Government portals, Academic journals, Official Tech press) to ensure "genuine sources."
- **Recursive Scraping:** A tool to follow lead links within a primary article to trace information back to the original source.

### 2.2. Verification & Fact-Checking Engine
To fulfill the "fact check every detail" mandate, the agent must implement a cross-referencing logic.
- **Triangulation Tool:** A logic-gate tool that requires a piece of information to be present in at least three independent, high-reputation sources before being flagged as "Verified."
- **Conflict Detection Module:** A tool to identify discrepancies between sources. When a conflict is detected, the agent must prioritize sources based on a predefined Authority Matrix (e.g., Peer-reviewed journals > Mainstream news > Blogs).
- **Truth-Score Heuristics:** A capability to assign a confidence score to a piece of information based on source reliability and consistency across the web.

### 2.3. Information Synthesis & Prioritization
To distinguish "which one is more important," the agent requires analytical capabilities.
- **Relevance Scoring Tool:** An LLM-driven evaluator that ranks news items based on impact, urgency, and alignment with the core categories (Politics, Tech, Medicine, Education).
- **Noise Filter:** A tool to strip redundant information and "clickbait" summaries to maintain report density and accuracy.

### 2.4. File System & Automation
To handle the daily 9:00 AM delivery requirement.
- **Chron Scheduler:** A system-level trigger (Cron job) set to execute the full pipeline daily, ensuring completion by 09:00.
- **Markdown Generator:** A formatting tool to structure the synthesized data into a professional `.md` layout.
- **FileSystem Writer:** Permission-based access to create and save the `[report_name].md` file in the designated directory.

## 3. Operational Workflow (Tool Chain)

1.  **Trigger:** `Chron Scheduler` $\rightarrow$ 08:00 AM.
2.  **Discovery:** `Search Engine API` $\rightarrow$ `Recursive Scraping` $\rightarrow$ Raw Data Collection.
3.  **Validation:** `Triangulation Tool` $\rightarrow$ `Conflict Detection` $\rightarrow$ `Truth-Score Heuristics`.
4.  **Curation:** `Relevance Scoring` $\rightarrow$ `Noise Filter` $\rightarrow$ High-Priority Intel.
5.  **Output:** `Markdown Generator` $\rightarrow$ `FileSystem Writer` $\rightarrow$ `[report_name].md` (by 09:00 AM).

## 4. Success Metrics for Tool Performance
- **Source Integrity:** 0% reliance on unverified social media aggregators.
- **Temporal Accuracy:** All news items must be dated within the last 24–48 hours.
- **Report Consistency:** Strict adherence to the `.md` format and the 09:00 AM deadline.