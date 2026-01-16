export interface RequestConfig {
  method: 'GET' | 'POST';
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
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
