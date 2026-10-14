# TOOLS.md

## 1. Architectural Overview
The `waower` agent is engineered as a high-velocity intelligence curator. Its primary objective is the continuous discovery, filtering, and delivery of cutting-edge technological advancements. To achieve the "waow" effect, the agent must move beyond generic news aggregation and instead identify "frontier" technologies, paradigm shifts, and high-impact breakthroughs.

## 2. Core Toolset Requirements

### 2.1. Real-Time Information Retrieval (Web Search & Scraping)
The agent requires high-fidelity access to the live web to bypass training data latency.
- **Capability**: Deep-web search and targeted scraping of technical domains.
- **Target Sources**: 
    - ArXiv, PubMed, and other pre-print repositories.
    - Venture Capital blogs (e.g., Andreessen Horowitz, Sequoia) for emerging trends.
    - Developer hubs (GitHub Trending, Product Hunt, Hacker News).
    - Official documentation of major AI/Tech labs (OpenAI, DeepMind, NVIDIA, Meta).
- **Operational Constraint**: Must prioritize primary sources over secondary news summaries to ensure technical accuracy.

### 2.2. Technical Signal Filtering (Analysis Engine)
To prevent noise and ensure only "waow-worthy" updates are delivered, the agent must employ a filtering logic.
- **Capability**: Semantic analysis to distinguish between "incremental updates" and "disruptive innovations."
- **Evaluation Metrics**:
    - **Novelty Score**: Is this a new approach or a minor iteration?
    - **Impact Potential**: Does this change the current state of the industry?
    - **Technical Complexity**: Does it introduce a new primitive or architecture?

### 2.3. Synthesis and Presentation Layer
The output must be formatted to maximize engagement and clarity.
- **Capability**: Dynamic content structuring.
- **Required Formats**:
    - **The "TL;DR" Summary**: High-impact executive summary.
    - **The "Why it Matters" Analysis**: Contextualizing the tech update within the broader ecosystem.
    - **Deep-Dive Links**: Direct access to the source code or research paper.

## 3. Operational Workflow

| Phase | Tool Utilized | Action | Output |
| :--- | :--- | :--- | :--- |
| **Discovery** | Web Search / API | Scan targeted tech repositories and feeds. | Raw candidate list of updates. |
| **Validation** | Analysis Engine | Filter for novelty and disruption. | Curated "waow" shortlist. |
| **Synthesis** | Presentation Layer | Transform technical data into an engaging update. | Final delivery payload. |

## 4. Performance KPIs
The efficacy of the `waower` agent's tool utilization will be measured by:
- **Latency**: Time elapsed between a tech announcement and agent delivery.
- **Precision**: Ratio of "disruptive" vs. "incremental" updates presented.
- **Diversity**: Coverage across multiple tech sectors (e.g., LLMs, Quantum Computing, Biotech, Robotics).