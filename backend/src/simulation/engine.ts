import { ArchitectureConfig, MetricsResult } from "../types";

export function calculateMetrics(config: ArchitectureConfig): MetricsResult {
  // TODO: These formulas are very basic stubs. The simulation developer 
  // should refine these to be more realistic and take into account 
  // different component combinations (e.g. cache reducing DB load).

  let totalCapacity = 0;
  let totalCost = 0;
  let hasCache = false;
  let dbCapacity = 0;

  // Simple capacity and cost calculation
  for (const component of config.components) {
    const replicas = component.config.replicas || 1;
    const cpu = component.config.cpu || 1;
    const ram = component.config.ram || 1;
    
    // Each cpu/ram unit adds some capacity
    const compCapacity = (cpu * 50 + ram * 20) * replicas;
    
    if (component.type === 'server') {
      totalCapacity += compCapacity;
      totalCost += (cpu * 5 + ram * 2) * replicas;
    } else if (component.type === 'database') {
      dbCapacity += compCapacity;
      totalCost += (cpu * 10 + ram * 5) * replicas;
    } else if (component.type === 'cache') {
      hasCache = component.config.cacheEnabled ?? false;
      if (hasCache) {
        totalCost += (ram * 3);
        totalCapacity += 500; // cache gives a flat boost
      }
    } else if (component.type === 'load-balancer') {
      totalCapacity += 1000 * replicas; // LBs can handle a lot
      totalCost += 20 * replicas;
    }
  }

  // Base metrics
  let baseLatency = 50; // ms
  
  // If cache is enabled, lower base latency
  if (hasCache) {
    baseLatency -= 20;
  }

  const load = config.trafficLoad;
  
  // Calculate load factor (0 to >1)
  const effectiveCapacity = Math.min(totalCapacity, dbCapacity * (hasCache ? 3 : 1) + 100);
  
  // Prevent division by zero
  const safeCapacity = Math.max(effectiveCapacity, 1);
  const loadFactor = load / safeCapacity;

  // Latency spikes if load exceeds capacity
  let latency = baseLatency + Math.pow(Math.max(0, loadFactor - 0.5), 2) * 500;
  
  // Error rate starts climbing when load > 80% capacity
  let errorRate = 0;
  if (loadFactor > 0.8) {
    errorRate = (loadFactor - 0.8) * 50; 
  }
  if (loadFactor > 1.2) {
    errorRate += 40; // steep drop off
  }
  errorRate = Math.min(Math.max(errorRate, 0), 100); // cap 0-100

  // Throughput is load minus errors
  const throughput = load * (1 - (errorRate / 100));

  // Availability drops as errors rise
  const availability = 100 - errorRate;

  return {
    latency: Math.round(latency),
    throughput: Math.round(throughput),
    errorRate: Number(errorRate.toFixed(2)),
    availability: Number(availability.toFixed(2)),
    cost: Math.round(totalCost)
  };
}
