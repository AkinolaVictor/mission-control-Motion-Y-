# impact of system RAM vs VRAM on LLM inference latency, LLM quantization effects on output quality and precision, KV cache memory calculation and requirements for large language models, relationship between memory bandwidth and LLM tokens per second

The deployment of Large Language Models (LLMs) is governed by a strict hierarchy of hardware constraints. While raw computational power (FLOPs) is often the focus of marketing, the actual performance of an LLM during inference is primarily dictated by memory architecture: specifically, the capacity and bandwidth of Video RAM (VRAM) and system RAM, and the efficient management of the Key-Value (KV) cache.

## Memory Architecture: VRAM vs. System RAM

In the context of LLM inference, VRAM (GDDR/HBM) and system RAM (DDR4/5) serve distinct functional roles, with a vast disparity in performance capabilities.

### Performance and Bandwidth Disparity
The most critical difference between the two is memory bandwidth—the speed at which data can be moved from memory to the GPU cores. According to [martinuke0's Blog](https://martinuke0.github.io/posts/2026-01-06-ram-vs-vram-a-deep-dive-for-large-language-model-training-and-inference/), VRAM typically provides bandwidth ranging from **700 to 3,000+ GB/s**, whereas system RAM is limited to approximately **50-100 GB/s**.

Because LLM inference requires the massive movement of model weights and activations for every single token generated, this bandwidth gap directly translates to latency. VRAM's proximity to GPU cores minimizes the time spent waiting for data, which is essential for maintaining a responsive "tokens per second" rate.

### Functional Roles and Constraints
*   **VRAM:** Acts as the primary "hard constraint." It stores model weights and activations. If the model exceeds the available VRAM capacity, the system will trigger an Out-of-Memory (OOM) error unless offloading is implemented.
*   **System RAM:** Manages orchestration, tokenization, and data loading. While it can be used for CPU offloading (e.g., via Hugging Face `accelerate`) to run models that are too large for VRAM, this comes at a severe performance cost due to the lower bandwidth mentioned above. Insufficient system RAM leads to disk swapping (virtual memory), causing extreme performance degradation.

## The Relationship Between Memory Bandwidth and Throughput

In production environments, LLM inference speed is rarely limited by raw GPU compute; instead, it is a **memory-bandwidth-bound** process.

### The Bandwidth Bottleneck
As noted by [Yotta Labs](https://www.yottalabs.ai/post/what-actually-limits-llm-inference-speed-gpu-vs-memory-vs-kv-cache-explained), the primary bottleneck is the speed of data movement between memory and compute units for weights, activations, and the KV cache. This explains why GPUs with similar compute specifications can exhibit vastly different real-world performance; the differentiator is often the memory access speed.

Consequently, upgrading hardware (e.g., from an A100 to an H100) does not always result in linear performance gains if the memory bandwidth does not scale proportionally or if the memory demands of the KV cache increase. This saturation leads to low GPU utilization, where the compute cores sit idle while waiting for data from memory.

### Tokens per Second and Latency
Throughput (total tokens per second across multiple requests) and latency (the sum of Time to First Token [TTFT] and total response time) are both sensitive to this bandwidth. [Rost Glukhov](https://www.glukhov.org/llm-performance/) identifies the constraint hierarchy as: **VRAM Capacity $\rightarrow$ Memory Bandwidth $\rightarrow$ Runtime Scheduling $\rightarrow$ Context Window Size $\rightarrow$ CPU Overhead**.

## KV Cache: Memory Calculation and Requirements

The KV (Key-Value) cache is a mechanism used to store the keys and values of previous tokens to avoid recomputing them at every step of the auto-regressive generation process. While it accelerates inference, it introduces significant memory overhead.

### Scaling and Consumption
The KV cache is the primary consumer of GPU memory during long-context inference, and its requirements increase linearly (and in some cases quadratically) with context length. 

*   **Example (Qwen3-8B):** At a 32K token context, an FP16 KV cache requires approximately **4.5 GiB**, which is nearly equal to the memory required for the model's int4 weights (~5 GiB) ([doi.org/10.21203/rs.3.rs-10297225/v1](https://doi.org/10.21203/rs.3.rs-10297225/v1)).
*   **Long-Context Impact:** In scenarios reaching 128k tokens, the KV cache can occupy 50% or more of the available VRAM ([martinuke0's Blog](https://martinuke0.github.io/posts/2026-01-06-ram-vs-vram-a-deep-dive-for-large-language-model-training-and-inference/)).

### Memory-Induced Bottlenecks
As concurrency and sequence lengths increase, the KV cache creates heightened memory pressure and fragmentation. This degrades memory access efficiency, increasing latency and reducing overall throughput ([Yotta Labs](https://www.yottalabs.ai/post/what-actually-limits-llm-inference-speed-gpu-vs-memory-vs-kv-cache-explained)).

## LLM Quantization: Effects on Quality, Precision, and Latency

Quantization reduces the precision of model weights and the KV cache to fit larger models into limited memory and increase throughput.

### Weight Quantization and Memory Savings
Reducing precision allows for significant reductions in VRAM footprints:
*   **FP16:** Reduces memory by 50% compared to full precision.
*   **INT4 (AWQ/GPTQ):** Offers up to 4x memory savings. For example, a Llama 3 70B model requires ~140GB in FP16 but only ~35GB in 4-bit quantization ([martinuke0's Blog](https://martinuke0.github.io/posts/2026-01-06-ram-vs-vram-a-deep-dive-for-large-language-model-training-and-inference/)).
*   **Extreme Quantization:** Methods like **ARB-LLM** aim for 1-bit binarization to minimize overhead, with some variants claiming to outperform FP16 models of the same size ([arXiv:2410.03129v3](https://arxiv.org/abs/2410.03129v3)).

### KV Cache Quantization and Efficiency
Beyond weights, quantizing the KV cache itself is a primary strategy for increasing concurrency and context length.

1.  **Capacity Gains:** Implementing 4-bit (Q4) quantization of the KV cache increases agent context capacity by **4x** compared to FP16 within the same memory footprint ([arXiv:2603.04428v1](https://arxiv.org/abs/2603.04428v1)).
2.  **Concurrency Gains:** The use of a layer-adaptive GQA-to-MLA transition framework can increase maximum concurrency by 2.43x to 2.69x for models in the 7B–14B range ([arXiv:2606.05868v1](https://arxiv.org/abs/2606.05868v1)).
3.  **Advanced Compression:** The **Tamarin (HSQ)** architecture uses a three-tier compression scheme (Focal, Summary, and Archive tiers) to reduce GPU-resident KV cache by **12–28x**, offloading compressed originals to CPU RAM ([doi.org/10.21203/rs.3.rs-10297225/v1](https://doi.org/10.21203/rs.3.rs-10297225/v1)).

### Impact on Output Quality and Precision
The relationship between quantization and quality is not uniform and depends on the model and the specific precision used.

*   **Minimal Impact:** Some studies show minimal variance in output quality between FP16 and NF4 (4-bit NormalFloat), with differences as low as 0.19 points ([doi.org/10.48550/arxiv.2603.20223](https://doi.org/10.48550/arxiv.2603.20223)). Tamarin's compression for 4B–14B models showed a perplexity overhead of only 0.1–0.4%.
*   **Model-Specific Degradation:** Q4 KV cache quantization showed varying results: Gemma saw a 0.7% improvement, while Llama and DeepSeek experienced degradations of 2.8% and 3.0%, respectively ([arXiv:2603.04428v1](https://arxiv.org/abs/2603.04428v1)).
*   **Asymmetric Quantization:** To maintain stability, some frameworks use asymmetric precision. For instance, **PolyKV** quantizes "Keys" at int8 to preserve softmax stability while compressing "Values" to 3-bit, resulting in a negligible perplexity degradation of +0.57% ([arXiv:2604.24971v1](https://arxiv.org/abs/2604.24971v1)).

## Latency and Energy Trade-offs

Quantization does not always lead to faster inference; it is contingent upon the hardware and the inference regime.

### The Quantization Latency Paradox
In a study using a Microsoft Phi-3 Mini on an NVIDIA T4 GPU, NF4 (4-bit) quantization was actually **slower** (13.4 s) than FP16 (9.2 s), despite being more energy-efficient (329 J vs 369 J) ([doi.org/10.48550/arxiv.2603.20223](https://doi.org/10.48550/arxiv.2603.20223)). This suggests that on certain hardware, the overhead of dequantizing weights during computation can outweigh the benefits of reduced data movement.

### TTFT and Cache Persistence
The most dramatic latency reductions come from avoiding the "prefill" stage. Without a persisted KV cache, evicting a cache requires a full re-prefill, which can take ~15.7 seconds for a 4K context. By restoring a persisted Q4 KV cache, the Time-to-First-Token (TTFT) can be reduced by:
*   **Gemma 3 12B:** 22x to 136x reduction.
*   **Llama 3.1 8B:** 24x to 111x reduction ([arXiv:2603.04428v1](https://arxiv.org/abs/2603.04428v1)).

## Summary of Findings

| Factor | Primary Impact | Key Trade-off |
| :--- | :--- | :--- |
| **VRAM** | Model fit & Base Latency | Capacity is a "hard" limit; HBM/GDDR is essential for speed. |
| **System RAM** | Orchestration & Offloading | Allows larger models to run, but bandwidth is $10\text{--}30\times$ slower than VRAM. |
| **Memory Bandwidth** | Tokens per Second | Primary bottleneck in production; compute (FLOPs) is often secondary. |
| **KV Cache** | Long-context Latency | Increases linearly with context; consumes VRAM rapidly. |
| **Quantization** | VRAM Footprint | Reduces memory usage (up to $4\times$ or more) but may slightly degrade perplexity. |

In conclusion, optimizing LLM inference requires a balanced approach to memory management. While weight quantization allows larger models to fit into VRAM, KV cache compression and persistence are the primary drivers for reducing latency and increasing concurrency in long-context or multi-agent applications. The transition from FP16 to lower precisions generally offers significant memory and energy gains, though the impact on absolute latency can vary depending on the specific GPU architecture.
