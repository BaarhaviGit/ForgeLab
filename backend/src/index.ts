import express from 'express';
import cors from 'cors';
import simulateRoutes from './routes/simulate';
import templateRoutes from './routes/templates';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/templates', templateRoutes);
app.use('/simulate', simulateRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`ForgeLab backend running on port ${port}`);
});
