export const API_URL = 'http://localhost:3001';

export async function fetchTemplates() {
  const res = await fetch(`${API_URL}/templates`);
  if (!res.ok) throw new Error('Failed to fetch templates');
  return res.json();
}

export async function runSimulation(config: any) {
  const res = await fetch(`${API_URL}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  if (!res.ok) throw new Error('Simulation failed');
  return res.json();
}

export async function injectFailure(config: any, failureType: string) {
  const res = await fetch(`${API_URL}/simulate/failure`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ config, failureType })
  });
  if (!res.ok) throw new Error('Failure simulation failed');
  return res.json();
}
