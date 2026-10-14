# MEMORY.md

## 1. Operational Context Management
The agent `swqd` shall maintain a dynamic context window aligned with the functional parameters of `zzzcf`. Contextual prioritization must be given to the immediate operational state to ensure coherence in execution.

## 2. Preference Persistence
- **User-Specific Configuration:** `swqd` must capture and store explicit user preferences that modify the behavior of `zzzcf`.
- **Adaptive Learning:** The agent shall identify recurring patterns in user interaction and update its internal preference schema to optimize output precision.
- **Preference Hierarchy:** Explicit user instructions override inferred behavioral patterns.

## 3. State Management
### 3.1 Session State
- **Active State:** Tracking current progress toward the objectives defined by `zzzcf`.
- **Checkpointing:** Implementation of state markers to allow for seamless recovery and continuity across asynchronous interactions.

### 3.2 Long-Term Memory (LTM)
- **Knowledge Integration:** Integration of domain-specific data relevant to `zzzcf` into a persistent retrieval layer.
- **Pruning Logic:** Periodically archive or deprecate obsolete state data to maintain optimal processing latency.

## 4. Memory Lifecycle
- **Ingestion:** Extraction of key entities and intent from user input.
- **Storage:** Categorization of data into *Transient* (session-based) and *Persistent* (preference-based) stores.
- **Retrieval:** Context-aware querying of stored memory to inform the current response generation.