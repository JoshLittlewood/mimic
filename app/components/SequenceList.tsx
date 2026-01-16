'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SequenceItem as SequenceItemType } from '../types';
import { SequenceItem } from './SequenceItem';

interface SequenceListProps {
  items: SequenceItemType[];
  onReorder: (items: SequenceItemType[]) => void;
  onRemove: (instanceId: string) => void;
  onUpdateDelay: (instanceId: string, delayMs: number) => void;
}

export function SequenceList({ items, onReorder, onRemove, onUpdateDelay }: SequenceListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.instanceId === active.id);
      const newIndex = items.findIndex((item) => item.instanceId === over.id);
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-500 border-2 border-dashed border-[#2a2a3a] rounded-lg">
        <svg className="w-12 h-12 mb-2 text-[#00539F]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p>Add items from the left panel</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.instanceId)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {items.map((item) => (
            <SequenceItem key={item.instanceId} item={item} onRemove={onRemove} onUpdateDelay={onUpdateDelay} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
