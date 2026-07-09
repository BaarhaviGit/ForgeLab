import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();
const configPath = path.join(__dirname, '../data/project-config.json');

// In-memory cache for fast retrieval
let currentConfig: any = null;

// Initialize in-memory cache from persisted file on start if it exists
try {
  if (fs.existsSync(configPath)) {
    const data = fs.readFileSync(configPath, 'utf8');
    currentConfig = JSON.parse(data);
  }
} catch (err) {
  console.error('Error loading config from file on startup:', err);
}

// GET /config
router.get('/', (req: Request, res: Response) => {
  try {
    if (currentConfig) {
      return res.json(currentConfig);
    }
    
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      currentConfig = JSON.parse(data);
      return res.json(currentConfig);
    }
    
    // Fallback: return null if no config is stored yet
    return res.json(null);
  } catch (error) {
    console.error('Error reading current config:', error);
    res.status(500).json({ error: 'Failed to load project config' });
  }
});

// POST /config
router.post('/', (req: Request, res: Response) => {
  try {
    const config = req.body;
    if (!config) {
      return res.status(400).json({ error: 'Invalid config payload' });
    }
    
    currentConfig = config;
    
    // Ensure the data directory exists
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    res.json({ status: 'success', config: currentConfig });
  } catch (error) {
    console.error('Error saving current config:', error);
    res.status(500).json({ error: 'Failed to save project config' });
  }
});

export default router;
