# TOOLS.md: more_dev_tests Agent Capabilities

## 1. Architectural Overview
The `more_dev_tests` agent is engineered for high-velocity development validation. Its primary objective is to minimize the feedback loop between code commit and test verification. To achieve "rocket speed," the agent utilizes a suite of tools focused on parallelization, selective execution, and automated environment orchestration.

## 2. Core Toolsets

### 2.1 Test Execution Engine
The agent must interface with the project's test runners (e.g., Jest, PyTest, GoTest) via a specialized execution wrapper.
- **Selective Test Triggering:** Capability to analyze git diffs and execute only the tests affected by recent changes (Impact Analysis).
- **Parallelized Execution:** Tooling to shard test suites across multiple CPU cores or distributed containers.
- **Headless Mode:** Integration with headless browser drivers (e.g., Playwright, Puppeteer) for rapid UI/Integration testing.

### 2.2 Environment Orchestration
To ensure zero-latency setup, the agent utilizes infrastructure-as-code (IaC) and containerization tools.
- **Ephemeral Environment Provisioning:** Tools to spin up lightweight Docker containers or Kubernetes namespaces for isolated test runs.
- **Database Snapshotting:** Capability to inject pre-seeded data states into databases to bypass lengthy setup scripts.
- **Mock Server Management:** Tools to deploy and configure mock APIs (e.g., Prism, WireMock) to eliminate external dependency bottlenecks.

### 2.3 Analysis & Reporting
Speed is irrelevant without precision. The agent utilizes high-fidelity analysis tools to pinpoint failures instantly.
- **Log Aggregator:** A tool to scrape and filter logs from multiple parallel processes into a single, searchable stream.
- **Failure Heatmapping:** Capability to identify flaky tests and categorize failures (e.g., Infrastructure vs. Logic).
- **Diff-Analysis Tool:** A utility to compare actual vs. expected JSON/XML outputs with high-speed diffing algorithms.

## 3. Capability Matrix

| Capability | Tool Category | Primary Goal | Performance Metric |
| :--- | :--- | :--- | :--- |
| **Impact Analysis** | Execution Engine | Skip redundant tests | $\downarrow$ Execution Time |
| **State Injection** | Orchestration | Instant DB readiness | $\downarrow$ Setup Latency |
| **Concurrent Sharding** | Execution Engine | Distribute workload | $\uparrow$ Throughput |
| **Automated Triage** | Analysis | Rapid root-cause ID | $\downarrow$ Mean Time to Repair (MTTR) |

## 4. Operational Constraints
- **Resource Cap:** The agent must monitor system load to prevent resource exhaustion during high-parallelism bursts.
- **Cleanup Protocol:** Every environment provisioning tool must have a corresponding `teardown` command to prevent "zombie" infrastructure.
- **Cache Management:** Utilization of global test caches to avoid recompilation of unchanged modules.