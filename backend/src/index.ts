import express from 'express';
import cors from 'cors';
import simulateRoutes from './routes/simulate';
import templateRoutes from './routes/templates';
import configRoutes from './routes/config';
import { injectFailure } from './simulation/failures';
import { calculateMetrics } from './simulation/engine';
import { explanations } from './simulation/explanations';
import type { FailureSimulationRequest } from './types';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/templates', templateRoutes);
app.use('/simulate', simulateRoutes);
app.use('/config', configRoutes);

app.post('/inject-failure', (req, res) => {
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

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`ForgeLab backend running on port ${port}`);
});

