'use client';

import { useState, useEffect, useCallback } from 'react';
import { SavedFlow, SavedSequenceItem, SequenceItem } from '../types';

const STORAGE_KEY = 'mimic-saved-flows';

function generateId(): string {
  return `flow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Convert runtime sequence items to saved items (strip runtime state)
export function toSavedItems(items: SequenceItem[]): SavedSequenceItem[] {
  return items.map((item) => {
    if (item.type === 'delay') {
      return {
        type: 'delay' as const,
        delayMs: item.delayMs,
      };
    }
    return {
      type: 'request' as const,
      id: item.id,
      name: item.name,
      description: item.description,
      category: item.category,
      request: item.request,
    };
  });
}

// Convert saved items to runtime sequence items (add runtime state)
export function toSequenceItems(items: SavedSequenceItem[]): SequenceItem[] {
  return items.map((item) => {
    const instanceId = `${item.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    if (item.type === 'delay') {
      return {
        ...item,
        instanceId,
        status: 'idle' as const,
      };
    }
    return {
      ...item,
      instanceId,
      status: 'idle' as const,
    };
  });
}

export function useSavedFlows() {
  const [flows, setFlows] = useState<SavedFlow[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFlows(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load saved flows:', error);
    }
    setIsLoaded(true);
  }, []);

  // Persist to localStorage whenever flows change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(flows));
      } catch (error) {
        console.error('Failed to save flows:', error);
      }
    }
  }, [flows, isLoaded]);

  const saveFlow = useCallback((name: string, items: SequenceItem[]): SavedFlow => {
    const now = Date.now();
    const newFlow: SavedFlow = {
      id: generateId(),
      name,
      createdAt: now,
      updatedAt: now,
      items: toSavedItems(items),
    };
    setFlows((prev) => [...prev, newFlow]);
    return newFlow;
  }, []);

  const updateFlow = useCallback((id: string, name: string, items: SequenceItem[]) => {
    setFlows((prev) =>
      prev.map((flow) =>
        flow.id === id
          ? { ...flow, name, items: toSavedItems(items), updatedAt: Date.now() }
          : flow
      )
    );
  }, []);

  const deleteFlow = useCallback((id: string) => {
    setFlows((prev) => prev.filter((flow) => flow.id !== id));
  }, []);

  const getFlow = useCallback((id: string): SavedFlow | undefined => {
    return flows.find((flow) => flow.id === id);
  }, [flows]);

  return {
    flows,
    isLoaded,
    saveFlow,
    updateFlow,
    deleteFlow,
    getFlow,
  };
}
