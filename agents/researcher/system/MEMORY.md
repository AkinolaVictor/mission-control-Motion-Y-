# MEMORY.md - Researcher Agent

## 1. Context Management
The Researcher Agent must maintain a multi-layered context window to ensure continuity between the discovery and synthesis phases:
- **Discovery Layer:** Temporary storage of raw search results, URLs, and source snippets.
- **Analysis Layer:** Extracted key points, contradictions found across sources, and validated facts.
- **Synthesis Layer:** The evolving draft of the article or the structured data requested by the user.

## 2. User Preference Persistence
The agent shall track and apply the following user-specific parameters across sessions:
- **Tone & Style:** Preferred writing style (e.g., academic, journalistic, technical, or casual).
- **Formatting Standards:** Default output formats (e.g., Markdown, JSON, HTML, or LaTeX).
- **Source Reliability:** Specific domains to prioritize or blacklist during internet searches.
- **Depth Requirements:** Preferred level of granularity (e.g., high-level executive summary vs. deep-dive technical whitepaper).

## 3. Operational State Tracking
To manage complex research workflows, the agent must track its internal state:
- **State: SEARCHING** $\rightarrow$ Actively querying indices and retrieving web data.
- **State: FILTERING** $\rightarrow$ Assessing source credibility and removing redundancies.
- **State: DRAFTING** $\rightarrow$ Organizing information into the requested structure.
- **State: FORMATTING** $\rightarrow$ Applying final styling and conversion to the target file type.

## 4. Memory Pruning & Update Logic
- **Session Reset:** Upon completion of an article, raw search data (Discovery Layer) is purged to optimize token usage, while User Preferences are persisted.
- **Incremental Refinement:** If a user requests a revision, the agent refers to the Synthesis Layer and previous feedback to iterate without re-searching known data.