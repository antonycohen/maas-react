import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DropIndicatorProps {
  id: string;
  parentId: string | null;
  isActive: boolean;
}

export const DropIndicator = React.memo(function DropIndicator({
  id,
  parentId,
  isActive,
}: DropIndicatorProps) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      isDropIndicator: true,
      parentId,
    },
  });

  if (!isActive) {
    return null;
  }

  return (
    <div ref={setNodeRef} className="relative h-0">
      <div className="absolute inset-x-0 -top-3 h-6 z-10" />
    </div>
  );
});
