import { useState } from 'react';
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
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { GripVertical, ChevronDown, Trash2, Plus } from 'lucide-react';

import { CMSBlock, CMSBlockCommon, CMSBlockData } from '@maas/core-api-models';
import { extractValueFromPath, reorder, updateObject } from '@maas/core-utils';

import { InputDescriptionExcludeGroup } from '../../types';
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@maas/web-components';

import { EditorPlugin } from '../../types';
import { EditorPluginInput } from '../editor-plugin-input';

// Helper to convert dnd-kit transform to CSS string
function transformToString(transform: { x: number; y: number; scaleX: number; scaleY: number } | null): string | undefined {
  if (!transform) return undefined;
  return `translate3d(${transform.x}px, ${transform.y}px, 0) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})`;
}

type MultiGroupInput = {
  type: 'multi_group';
  name: string;
  titlePath?: string;
  subtitle?: string;
  items: Array<{
    type: 'text' | 'select' | 'rte' | 'date' | 'image';
    name: string;
    label: string;
    required?: boolean;
    condition?: string;
    options?: { label: string; value: string | number }[];
  }>;
  label: string;
  required?: boolean;
  condition?: string;
};

type EditorPluginInputProps = {
  input: MultiGroupInput;
  path?: string;
  blockContent: CMSBlock;
  setBlockContent: (blockContent: CMSBlock) => void;
  selectedPlugin: EditorPlugin<unknown, CMSBlockCommon, unknown>;
};

type SortableItemProps = {
  id: string;
  index: number;
  title: string;
  subtitle?: string;
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  onDelete: () => void;
  children: React.ReactNode;
};

function SortableItem({
  id,
  title,
  subtitle,
  isExpanded,
  onExpandedChange,
  onDelete,
  children,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: transformToString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="w-full">
      <Collapsible open={isExpanded} onOpenChange={onExpandedChange}>
        <div className="border-input flex items-center gap-2 rounded-md border bg-transparent p-2">
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground flex h-9 w-9 cursor-grab items-center justify-center rounded-full border active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-sm font-medium">
              {title || 'Untitled'}
            </span>
            {subtitle && (
              <span className="text-muted-foreground truncate text-xs">
                {subtitle}
              </span>
            )}
          </div>

          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </CollapsibleTrigger>

          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive h-8 w-8 p-0"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <CollapsibleContent className="px-4 pt-4">
          <div className="flex flex-col gap-y-4 pb-4">{children}</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export const EditorMultiGroupInput = (props: EditorPluginInputProps) => {
  const {
    input: groupInput,
    path,
    blockContent,
    setBlockContent,
    selectedPlugin,
  } = props;

  const content = blockContent as unknown as Record<string, unknown>;
  const array =
    (extractValueFromPath<unknown[]>(content, path + groupInput.name) as unknown[]) ?? [];

  const [expandedStates, setExpandedStates] = useState<boolean[]>(
    array?.map(() => false) ?? []
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const items = array.map((_, index) => `item-${index}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);

      setExpandedStates(reorder(expandedStates, oldIndex, newIndex));
      setBlockContent({
        ...updateObject(blockContent, path + groupInput.name, [
          ...reorder(array, oldIndex, newIndex),
        ]),
      });
    }
  };

  const handleAdd = () => {
    const newItems = JSON.parse(
      JSON.stringify(
        extractValueFromPath(selectedPlugin.shape, path + groupInput.name)
      )
    );
    setBlockContent({
      ...updateObject(blockContent, path + groupInput.name, [
        ...array,
        ...newItems,
      ]),
    });
    setExpandedStates([...expandedStates, false]);
  };

  const handleDelete = (index: number) => {
    setBlockContent({
      ...updateObject(blockContent, path + groupInput.name, [
        ...array.filter((_, i) => i !== index),
      ]),
    });
    setExpandedStates(expandedStates.filter((_, i) => i !== index));
  };

  const handleExpandedChange = (index: number, expanded: boolean) => {
    setExpandedStates([
      ...expandedStates.slice(0, index),
      expanded,
      ...expandedStates.slice(index + 1),
    ]);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-y-4">
            {array.map((_, index) => {
              const title = groupInput.titlePath
                ? (extractValueFromPath<string>(
                    content,
                    `${path}${groupInput.name}.${index}.${groupInput.titlePath}`
                  ) ?? '')
                : '';

              return (
                <SortableItem
                  key={items[index]}
                  id={items[index]}
                  index={index}
                  title={title}
                  subtitle={groupInput.subtitle}
                  isExpanded={expandedStates[index] ?? false}
                  onExpandedChange={(expanded) =>
                    handleExpandedChange(index, expanded)
                  }
                  onDelete={() => handleDelete(index)}
                >
                  {groupInput.items.map((input) => (
                    <EditorPluginInput
                      key={input.name}
                      input={input as InputDescriptionExcludeGroup<CMSBlockData>}
                      path={`${path}${groupInput.name}.${index}${
                        input.name ? '.' : ''
                      }`}
                    />
                  ))}
                </SortableItem>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      <Button
        type="button"
        variant="outline"
        className="w-fit"
        onClick={handleAdd}
      >
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un element
      </Button>
    </div>
  );
};
