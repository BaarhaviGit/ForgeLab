import { Router, Request, Response } from 'express';
import { calculateMetrics } from '../simulation/engine';
import { injectFailure } from '../simulation/failures';
import { explanations } from '../simulation/explanations';
import { ArchitectureConfig, FailureSimulationRequest } from '../types';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  try {
    const config: ArchitectureConfig = req.body;
    if (!config || !config.components) {
      return res.status(400).json({ error: 'Invalid configuration' });
    }
    
    const metrics = calculateMetrics(config);
    res.json(metrics);
  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({ error: 'Simulation failed' });
  }
});

router.post('/failure', (req: Request, res: Response) => {
  try {
    const { config, failureType }: FailureSimulationRequest = req.body;
    if (!config || !failureType) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const degradedConfig = injectFailure(config, failureType);
    const metrics = calculateMetrics(degradedConfig);
    const explanation = explanations[failureType] || explanations['unknown'];

    res.json({ metrics, explanation });
  } catch (error) {
    console.error('Failure simulation error:', error);
    res.status(500).json({ error: 'Failure simulation failed' });
  }
});

export default router;
