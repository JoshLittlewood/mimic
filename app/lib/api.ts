import { RequestItem, RequestConfig } from '../types';

export async function fetchAvailableItems(): Promise<RequestItem[]> {
  const response = await fetch('/api/items');
  if (!response.ok) {
    throw new Error('Failed to fetch items');
  }
  return response.json();
}

export async function executeRequest(config: RequestConfig): Promise<unknown> {
  const { method, url, headers, body, contentType } = config;

  // Use proxy to avoid CORS issues
  const response = await fetch('/api/proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ method, url, headers, body, contentType }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }

  // Unwrap raw text responses
  if (data._rawText !== undefined) {
    return data._rawText;
  }

  return data;
}
