import { ArchitectureConfig, MetricsResult } from "../types";

export function calculateMetrics(config: ArchitectureConfig): MetricsResult {
  let totalCapacity = 0;
  let totalCost = 0;
  let hasCache = false;
  let dbCapacity = 0;

  // 1. Calculate base capacities and costs based on configuration
  for (const component of config.components) {
    const replicas = component.config.replicas || 1;
    const cpu = component.config.cpu || 1;
    const ram = component.config.ram || 1;
    
    // Base capacity per unit
    const compCapacity = (cpu * 50 + ram * 20) * replicas;
    
    if (component.type === 'server') {
      totalCapacity += compCapacity;
      totalCost += (cpu * 5 + ram * 2) * replicas; // Cost per replica
    } else if (component.type === 'database') {
      dbCapacity += compCapacity;
      totalCost += (cpu * 10 + ram * 5) * replicas; // DB is more expensive
    } else if (component.type === 'cache') {
      hasCache = component.config.cacheEnabled ?? false;
      if (hasCache) {
        totalCost += (ram * 3);
        totalCapacity += 600; // Cache absorbs a huge chunk of read traffic
      }
    } else if (component.type === 'load-balancer') {
      totalCapacity += 1500 * replicas; // LBs are highly efficient at routing
      totalCost += 20 * replicas;
    }
  }

  // 2. Identify bottlenecks (The weakest link determines true capacity)
  // If cache is present, the DB doesn't get hit as hard.
  const dbEffectiveCapacity = dbCapacity * (hasCache ? 4 : 1);
  const systemCapacity = Math.min(totalCapacity, dbEffectiveCapacity + 100); 
  const safeCapacity = Math.max(systemCapacity, 1); // Prevent division by zero

  const trafficLoad = config.trafficLoad;
  const loadFactor = trafficLoad / safeCapacity;

  // 3. Calculate Latency (dramatic exponential curve)
  let baseLatency = hasCache ? 25 : 60; // Cache significantly drops base latency
  
  // latency = baseLatency + (trafficLoad / capacity) * exponential multiplier
  let latencyMultiplier = 1;
  if (loadFactor > 0.7) latencyMultiplier = 2;
  if (loadFactor > 0.9) latencyMultiplier = 5;
  if (loadFactor > 1.1) latencyMultiplier = 15; // Massive queuing delay

  let latency = baseLatency + (trafficLoad / safeCapacity) * (100 * latencyMultiplier);

  // 4. Calculate Error Rate (rises sharply when capacity is exceeded)
  let errorRate = 0;
  if (loadFactor > 0.85) {
    // Starts dropping requests linearly
    errorRate = (loadFactor - 0.85) * 60; 
  }
  if (loadFactor > 1.2) {
    // Cascading failure
    errorRate += 40; 
  }
  // Hard caps
  errorRate = Math.min(Math.max(errorRate, 0), 100); 
  
  // If the DB is completely dead (0 capacity), everything errors out except maybe some cached hits
  if (dbCapacity === 0) {
    errorRate = hasCache ? 40 : 100;
    latency = hasCache ? latency : 5000; // Timeout range
  }

  // 5. Calculate Throughput & Availability
  // Throughput is successful requests per second
  const throughput = trafficLoad * (1 - (errorRate / 100));
  const availability = 100 - errorRate;

  return {
    latency: Math.round(latency),
    throughput: Math.round(throughput),
    errorRate: Number(errorRate.toFixed(2)),
    availability: Number(availability.toFixed(2)),
    cost: Math.round(totalCost)
  };
}
