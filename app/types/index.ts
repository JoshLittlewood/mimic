export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
  contentType?: string; // e.g., 'text/plain', 'application/xml' - defaults to 'application/json'
}

export type RequestCategory = 'ui' | 'api' | 'payment';

export interface RequestItem {
  id: string;
  name: string;
  description?: string;
  category: RequestCategory;
  request: RequestConfig;
}

export type ItemStatus = 'idle' | 'running' | 'success' | 'error';

interface BaseSequenceItem {
  instanceId: string;
  status: ItemStatus;
}

export interface SequenceRequestItem extends BaseSequenceItem {
  type: 'request';
  id: string;
  name: string;
  description?: string;
  category: RequestCategory;
  request: RequestConfig;
  result?: unknown;
  error?: string;
}

export interface SequenceDelayItem extends BaseSequenceItem {
  type: 'delay';
  delayMs: number;
}

export type SequenceItem = SequenceRequestItem | SequenceDelayItem;

// Saved flow types - stored without runtime state (status, result, error)
export interface SavedRequestItem {
  type: 'request';
  id: string;
  name: string;
  description?: string;
  category: RequestCategory;
  request: RequestConfig;
}

export interface SavedDelayItem {
  type: 'delay';
  delayMs: number;
}

export type SavedSequenceItem = SavedRequestItem | SavedDelayItem;

export interface SavedFlow {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  items: SavedSequenceItem[];
}
