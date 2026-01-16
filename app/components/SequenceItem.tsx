'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SequenceItem as SequenceItemType } from '../types';

interface SequenceItemProps {
  item: SequenceItemType;
  onRemove: (instanceId: string) => void;
  onUpdateDelay?: (instanceId: string, delayMs: number) => void;
}

export function SequenceItem({ item, onRemove, onUpdateDelay }: SequenceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.instanceId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const statusIcon = {
    idle: (
      <div className="w-4 h-4 rounded-full border-2 border-[#3a3a4a]" />
    ),
    running: (
      <div className="w-4 h-4 rounded-full border-2 border-[#00539F] border-t-transparent animate-spin" />
    ),
    success: (
      <div className="w-4 h-4 rounded-full bg-[#00539F] flex items-center justify-center">
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    error: (
      <div className="w-4 h-4 rounded-full bg-[#EE1C2E] flex items-center justify-center">
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ),
  };

  const isDelay = item.type === 'delay';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-[#1a1a24] rounded-lg border ${
        isDelay
          ? 'border-[#00539F]/30'
          : 'border-[#2a2a3a]'
      } ${isDragging ? 'opacity-50 shadow-lg shadow-[#00539F]/20' : ''}`}
    >
      <button
        className="cursor-grab active:cursor-grabbing p-1 text-gray-500 hover:text-gray-300"
        {...attributes}
        {...listeners}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>

      {statusIcon[item.status]}

      {isDelay ? (
        <>
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <svg className="w-4 h-4 text-[#00539F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-white">Delay</span>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0"
              step="100"
              value={item.delayMs}
              onChange={(e) => onUpdateDelay?.(item.instanceId, Math.max(0, parseInt(e.target.value) || 0))}
              className="w-20 px-2 py-1 text-sm text-right border border-[#2a2a3a] rounded bg-[#12121a] text-white focus:border-[#00539F] focus:outline-none"
            />
            <span className="text-xs text-gray-400">ms</span>
          </div>
        </>
      ) : (
        <>
          <div className="flex-1 min-w-0">
            <span className="font-medium text-white truncate block">{item.name}</span>
            {item.error && (
              <span className="text-xs text-[#EE1C2E] truncate block">{item.error}</span>
            )}
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded font-mono ${
              item.request.method === 'GET'
                ? 'bg-[#00539F]/20 text-[#4d9fff]'
                : 'bg-[#EE1C2E]/20 text-[#ff6b6b]'
            }`}
          >
            {item.request.method}
          </span>
        </>
      )}

      <button
        onClick={() => onRemove(item.instanceId)}
        className="p-1 text-gray-500 hover:text-[#EE1C2E] transition-colors"
        aria-label="Remove item"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
