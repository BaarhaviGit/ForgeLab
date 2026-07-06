import { ArchitectureConfig } from "../types";

export function injectFailure(config: ArchitectureConfig, failureType: string): ArchitectureConfig {
  // Clone the config to avoid mutating original
  const newConfig: ArchitectureConfig = JSON.parse(JSON.stringify(config));

  switch (failureType) {
    case 'db_crash':
      // Find database and set replicas/capacity to 0
      newConfig.components.forEach(comp => {
        if (comp.type === 'database') {
          comp.config.replicas = 0;
          comp.config.cpu = 0;
          comp.config.ram = 0;
        }
      });
      break;

    case 'traffic_spike':
      // Multiply traffic load by 10
      newConfig.trafficLoad *= 10;
      break;

    case 'cache_eviction':
      // Turn off cache
      newConfig.components.forEach(comp => {
        if (comp.type === 'cache') {
          comp.config.cacheEnabled = false;
        }
      });
      break;
      
    default:
      // No-op
      break;
  }

  return newConfig;
}
