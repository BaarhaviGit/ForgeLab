export interface ComponentConfig {
  type: string;
  config: {
    cpu?: number;
    ram?: number;
    replicas?: number;
    cacheEnabled?: boolean;
    capacity?: number;
  };
}

export interface ArchitectureConfig {
  templateId: string;
  components: ComponentConfig[];
  trafficLoad: number; // requests per second
}

export interface MetricsResult {
  latency: number; // in milliseconds
  throughput: number; // requests per second successfully handled
  errorRate: number; // percentage (0 - 100)
  availability: number; // percentage (0 - 100)
  cost: number; // estimated monthly cost in dollars
}

export interface FailureSimulationRequest {
  config: ArchitectureConfig;
  failureType: string;
}

export interface FailureSimulationResult {
  metrics: MetricsResult;
  explanation: string;
}
