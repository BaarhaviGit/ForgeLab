export const explanations: Record<string, string> = {
  "db_crash": "The primary database instance has crashed. Requests requiring database reads or writes are failing, leading to a high error rate. If no cache is present, throughput drops significantly. Without replicas, availability hits near zero until the instance restarts.",
  "traffic_spike": "A sudden surge in traffic (10x normal load) has hit the system. The server CPU and RAM limits are being maxed out, causing massive latency as requests queue up. A load balancer and multiple replicas are required to handle this smoothly.",
  "cache_eviction": "The cache layer has gone down or evicted all keys. All read requests are now falling through directly to the database, causing a DB bottleneck and increasing overall latency.",
  "unknown": "An unknown anomaly occurred."
};
