"use client";

import { useState, useCallback } from "react";
import {
  RequestItem,
  SequenceItem,
  SequenceDelayItem,
  SequenceRequestItem,
  SavedFlow,
} from "./types";
import { ItemPicker } from "./components/ItemPicker";
import { SequenceList } from "./components/SequenceList";
import { RunButton } from "./components/RunButton";
import { SavedFlows } from "./components/SavedFlows";
import { useSequenceRunner } from "./hooks/useSequenceRunner";
import { useSavedFlows, toSequenceItems } from "./hooks/useSavedFlows";

export default function Home() {
  const [sequence, setSequence] = useState<SequenceItem[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [flowName, setFlowName] = useState("");
  const { isRunning, run, reset } = useSequenceRunner();
  const { flows, saveFlow, deleteFlow } = useSavedFlows();

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

  const handleSaveFlow = useCallback(() => {
    if (flowName.trim() && sequence.length > 0) {
      saveFlow(flowName.trim(), sequence);
      setFlowName("");
      setShowSaveDialog(false);
    }
  }, [flowName, sequence, saveFlow]);

  const handleLoadFlow = useCallback((flow: SavedFlow) => {
    setSequence(toSequenceItems(flow.items));
  }, []);

  const handleRunSavedFlow = useCallback(
    (flow: SavedFlow) => {
      const items = toSequenceItems(flow.items);
      setSequence(items);
      // Small delay to ensure state is updated before running
      setTimeout(() => {
        run(items, handleUpdateItem);
      }, 50);
    },
    [run, handleUpdateItem]
  );

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
              <div className="flex items-center gap-2">
                {sequence.length > 0 && (
                  <button
                    onClick={() => setShowSaveDialog(true)}
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
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                    Save
                  </button>
                )}
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

        {/* Saved Flows Section */}
        <div className="mt-6 bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Saved Flows
          </h2>
          <SavedFlows
            flows={flows}
            onLoad={handleLoadFlow}
            onRun={handleRunSavedFlow}
            onDelete={deleteFlow}
          />
        </div>
      </div>

      {/* Save Flow Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Save Flow</h3>
            <input
              type="text"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              placeholder="Enter flow name..."
              className="w-full px-4 py-3 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-white placeholder-gray-500 focus:border-[#00539F] focus:outline-none mb-4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveFlow();
                if (e.key === "Escape") setShowSaveDialog(false);
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 py-2 px-4 rounded-lg font-medium text-gray-400 hover:bg-[#1e1e2e] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFlow}
                disabled={!flowName.trim()}
                className="flex-1 py-2 px-4 rounded-lg font-medium bg-[#00539F] hover:bg-[#004080] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
