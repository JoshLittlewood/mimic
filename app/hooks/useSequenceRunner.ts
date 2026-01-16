'use client';

import { useState, useCallback } from 'react';
import { SequenceItem } from '../types';
import { executeRequest } from '../lib/api';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type ItemUpdate = { status?: SequenceItem["status"]; result?: unknown; error?: string };

interface UseSequenceRunnerResult {
  isRunning: boolean;
  run: (
    items: SequenceItem[],
    onUpdate: (instanceId: string, update: ItemUpdate) => void
  ) => Promise<void>;
  reset: (onUpdate: (instanceId: string, update: ItemUpdate) => void, items: SequenceItem[]) => void;
}

export function useSequenceRunner(): UseSequenceRunnerResult {
  const [isRunning, setIsRunning] = useState(false);

  const run = useCallback(
    async (
      items: SequenceItem[],
      onUpdate: (instanceId: string, update: ItemUpdate) => void
    ) => {
      if (items.length === 0) return;

      setIsRunning(true);

      for (const item of items) {
        onUpdate(item.instanceId, { status: 'running' });

        if (item.type === 'delay') {
          await delay(item.delayMs);
          onUpdate(item.instanceId, { status: 'success' });
        } else {
          try {
            const result = await executeRequest(item.request);
            onUpdate(item.instanceId, { status: 'success', result, error: undefined });
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            onUpdate(item.instanceId, { status: 'error', error: errorMessage });
          }
        }
      }

      setIsRunning(false);
    },
    []
  );

  const reset = useCallback(
    (
      onUpdate: (instanceId: string, update: ItemUpdate) => void,
      items: SequenceItem[]
    ) => {
      for (const item of items) {
        onUpdate(item.instanceId, { status: 'idle' });
      }
    },
    []
  );

  return { isRunning, run, reset };
}
