"use client";

import { useState, useCallback } from "react";
import {
  RequestItem,
  SequenceItem,
  SequenceDelayItem,
  SequenceRequestItem,
} from "./types";
import { ItemPicker } from "./components/ItemPicker";
import { SequenceList } from "./components/SequenceList";
import { RunButton } from "./components/RunButton";
import { useSequenceRunner } from "./hooks/useSequenceRunner";

export default function Home() {
  const [sequence, setSequence] = useState<SequenceItem[]>([]);
  const { isRunning, run, reset } = useSequenceRunner();

  const handleAddItem = useCallback((item: RequestItem) => {
    const newItem: SequenceRequestItem = {
      ...item,
      type: "request",
      instanceId: `${item.id}-${Date.now()}`,
      status: "idle",
    };
    setSequence((prev) => [...prev, newItem]);
  }, []);

  const handleAddDelay = useCallback(() => {
    const newDelay: SequenceDelayItem = {
      type: "delay",
      instanceId: `delay-${Date.now()}`,
      status: "idle",
      delayMs: 1000,
    };
    setSequence((prev) => [...prev, newDelay]);
  }, []);

  const handleRemoveItem = useCallback((instanceId: string) => {
    setSequence((prev) =>
      prev.filter((item) => item.instanceId !== instanceId)
    );
  }, []);

  const handleReorder = useCallback((items: SequenceItem[]) => {
    setSequence(items);
  }, []);

  const handleUpdateItem = useCallback(
    (
      instanceId: string,
      update: {
        status?: SequenceItem["status"];
        result?: unknown;
        error?: string;
      }
    ) => {
      setSequence((prev) =>
        prev.map((item) => {
          if (item.instanceId !== instanceId) return item;
          if (item.type === "delay") {
            return { ...item, status: update.status ?? item.status };
          }
          return {
            ...item,
            status: update.status ?? item.status,
            result: update.result,
            error: update.error,
          };
        })
      );
    },
    []
  );

  const handleUpdateDelay = useCallback(
    (instanceId: string, delayMs: number) => {
      setSequence((prev) =>
        prev.map((item) =>
          item.instanceId === instanceId && item.type === "delay"
            ? { ...item, delayMs }
            : item
        )
      );
    },
    []
  );

  const handleRun = useCallback(() => {
    run(sequence, handleUpdateItem);
  }, [run, sequence, handleUpdateItem]);

  const handleReset = useCallback(() => {
    reset(handleUpdateItem, sequence);
  }, [reset, handleUpdateItem, sequence]);

  const hasCompletedItems = sequence.some(
    (item) => item.status === "success" || item.status === "error"
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#EE1C2E] rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">
            Mimic <span className="text-[#00539F]">2.0</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Available Actions
            </h2>
            <ItemPicker onAddItem={handleAddItem} />
          </div>

          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Action Sequence
              </h2>
              <button
                onClick={handleAddDelay}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#00539F] hover:bg-[#00539F]/10 rounded-lg transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Add Delay
              </button>
            </div>
            <SequenceList
              items={sequence}
              onReorder={handleReorder}
              onRemove={handleRemoveItem}
              onUpdateDelay={handleUpdateDelay}
            />

            <div className="mt-6 space-y-3">
              <RunButton
                onClick={handleRun}
                disabled={sequence.length === 0 || isRunning}
                isRunning={isRunning}
              />
              {hasCompletedItems && !isRunning && (
                <button
                  onClick={handleReset}
                  className="w-full py-2 px-4 rounded-lg font-medium text-gray-400 hover:bg-[#1e1e2e] transition-colors"
                >
                  Reset Status
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
