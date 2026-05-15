const BASE = 'http://localhost:8000/api/v1';

async function handleResponse(r) {
  if (!r.ok) {
    const err = await r.json().catch(() => ({ detail: r.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  if (r.status === 204) return null;
  return r.json();
}

export const api = {
  get: (path) => fetch(`${BASE}${path}`).then(handleResponse),
  post: (path, body) => fetch(`${BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(handleResponse),
  put: (path, body) => fetch(`${BASE}${path}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(handleResponse),
  del: (path) => fetch(`${BASE}${path}`, { method: 'DELETE' }).then(handleResponse),
};