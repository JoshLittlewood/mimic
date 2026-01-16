import { RequestItem, RequestConfig } from '../types';

export async function fetchAvailableItems(): Promise<RequestItem[]> {
  const response = await fetch('/api/items');
  if (!response.ok) {
    throw new Error('Failed to fetch items');
  }
  return response.json();
}

export async function executeRequest(config: RequestConfig): Promise<unknown> {
  const { method, url, headers, body } = config;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: method === 'POST' && body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  return response.text();
}
