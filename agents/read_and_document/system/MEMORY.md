# MEMORY.md: State & Context Management Protocol

## 1. Purpose
This document defines the architectural framework for how the `read_and_document` agent manages short-term operational state, long-term knowledge retention, and user-specific documentation preferences. The primary objective is to ensure continuity across multiple research sessions and maintain high fidelity in the documentation of research updates.

## 2. Context Management Hierarchy

### 2.1. Short-Term Operational State (Session Memory)
The agent shall maintain a volatile state during a single research cycle to track:
- **Source Queue:** List of research papers, articles, or updates currently being processed.
- **Extraction Progress:** Tracking of specific data points extracted vs. pending requirements.
- **Cross-Reference Buffer:** Temporary storage of overlapping concepts between different sources within the same session.

### 2.2. Long-Term Knowledge Base (Persistent Memory)
The agent shall interface with a persistent store to track:
- **Domain Taxonomy:** A structured map of the research fields encountered to ensure consistent terminology across documents.
- **Citation Index:** A history of previously documented sources to prevent redundancy and enable longitudinal tracking of research evolution.
- **Entity Mapping:** Tracking of key researchers, institutions, and specific theories discovered over time.

## 3. User Preference Framework

The agent must store and adhere to the following configurable user preferences:

| Preference Category | Description | Default State |
| :--- | :--- | :--- |
| **Documentation Style** | Tone (e.g., Academic, Executive Summary, Technical) | Technical |
| **Granularity Level** | Depth of detail (e.g., High-level overview vs. Deep-dive analysis) | Comprehensive |
| **Formatting Standards** | Specific Markdown structures, LaTeX requirements, or template adherence | Standard MD |
| **Priority Filters** | Specific keywords or research themes that trigger high-priority documentation | User-Defined |

## 4. Operational State Transitions

### 4.1. Initialization Phase
- Retrieve the latest `Domain Taxonomy` and `User Preferences`.
- Load the current `Citation Index` to identify gaps in existing research documentation.

### 4.2. Processing Phase
- **Ingestion:** Update `Source Queue`.
- **Analysis:** Map new findings against the `Long-Term Knowledge Base` to determine if the update is a novel discovery or an iteration of an existing concept.
- **Documentation:** Apply `User Preferences` to the formatting and synthesis of the output.

### 4.3. Finalization Phase
- Commit new research findings to the `Long-Term Knowledge Base`.
- Archive the `Source Queue` for auditability.
- Update the `Citation Index` with the newly documented sources.

## 5. Conflict Resolution & Pruning
- **Contradiction Handling:** If a new research update contradicts a previously documented finding, the agent must flag the discrepancy in the documentation rather than overwriting the prior state.
- **Memory Pruning:** Periodically archive outdated research updates that have been superseded by more recent, peer-reviewed findings to maintain context window efficiency.