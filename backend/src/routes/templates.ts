import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const templatesPath = path.join(__dirname, '../data/templates.json');
    const templatesData = fs.readFileSync(templatesPath, 'utf8');
    res.json(JSON.parse(templatesData));
  } catch (error) {
    console.error('Error reading templates:', error);
    res.status(500).json({ error: 'Failed to load templates' });
  }
});

export default router;
