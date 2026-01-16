'use client';

import { useState } from 'react';
import { SavedFlow } from '../types';

interface SavedFlowsProps {
  flows: SavedFlow[];
  onLoad: (flow: SavedFlow) => void;
  onRun: (flow: SavedFlow) => void;
  onDelete: (id: string) => void;
}

export function SavedFlows({ flows, onLoad, onRun, onDelete }: SavedFlowsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (flows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-gray-500 border-2 border-dashed border-[#2a2a3a] rounded-lg">
        <svg className="w-8 h-8 mb-2 text-[#00539F]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <p className="text-sm">No saved flows yet</p>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-2">
      {flows.map((flow) => {
        const isExpanded = expandedId === flow.id;
        const itemCount = flow.items.length;
        const delayCount = flow.items.filter((i) => i.type === 'delay').length;
        const requestCount = itemCount - delayCount;

        return (
          <div
            key={flow.id}
            className="border border-[#2a2a3a] rounded-lg overflow-hidden"
          >
            <div
              className="flex items-center justify-between p-3 bg-[#1a1a24] hover:bg-[#22222e] transition-colors cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : flow.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white truncate">{flow.name}</span>
                  <span className="text-xs text-gray-500 bg-[#2a2a3a] px-2 py-0.5 rounded">
                    {requestCount} request{requestCount !== 1 ? 's' : ''}
                    {delayCount > 0 && `, ${delayCount} delay${delayCount !== 1 ? 's' : ''}`}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatDate(flow.updatedAt)}
                </p>
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ml-2 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {isExpanded && (
              <div className="border-t border-[#2a2a3a] p-3 bg-[#12121a]">
                <div className="space-y-1.5 mb-3 max-h-40 overflow-y-auto">
                  {flow.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-400"
                    >
                      <span className="text-gray-600 w-5">{index + 1}.</span>
                      {item.type === 'delay' ? (
                        <>
                          <svg className="w-3.5 h-3.5 text-[#00539F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Delay {item.delayMs}ms</span>
                        </>
                      ) : (
                        <>
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                              item.request.method === 'GET'
                                ? 'bg-[#00539F]/20 text-[#4d9fff]'
                                : 'bg-[#EE1C2E]/20 text-[#ff6b6b]'
                            }`}
                          >
                            {item.request.method}
                          </span>
                          <span className="truncate">{item.name}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRun(flow);
                    }}
                    className="flex-1 py-2 px-3 bg-[#EE1C2E] hover:bg-[#d91828] text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                    Run
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLoad(flow);
                    }}
                    className="flex-1 py-2 px-3 bg-[#00539F] hover:bg-[#004080] text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Load
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete "${flow.name}"?`)) {
                        onDelete(flow.id);
                      }
                    }}
                    className="py-2 px-3 text-gray-400 hover:text-[#EE1C2E] hover:bg-[#EE1C2E]/10 text-sm font-medium rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
