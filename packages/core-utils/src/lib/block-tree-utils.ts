/**
 * Utilities for working with nested block trees (CMS blocks with children)
 */

// Generic block interface for tree operations
interface BlockWithChildren {
  id: string;
  type: string;
  data: {
    children?: BlockWithChildren[];
    [key: string]: unknown;
  };
}

/**
 * Find a block by ID in a tree structure (recursive search)
 */
export function findBlockInTree<T extends BlockWithChildren>(
  blocks: T[],
  id: string
): T | null {
  for (const block of blocks) {
    if (block.id === id) {
      return block;
    }
    // Search in children if this is a container block (frame)
    const children = block.data?.children as T[] | undefined;
    if (children && children.length > 0) {
      const found = findBlockInTree(children, id);
      if (found) {
        return found as T;
      }
    }
  }
  return null;
}

/**
 * Update a block by ID in a tree structure (immutable)
 */
export function updateBlockInTree<T extends BlockWithChildren>(
  blocks: T[],
  id: string,
  updater: (block: T) => T
): T[] {
  return blocks.map((block) => {
    if (block.id === id) {
      return updater(block);
    }
    // Check children if this is a container block
    const children = block.data?.children as T[] | undefined;
    if (children && children.length > 0) {
      const updatedChildren = updateBlockInTree(children, id, updater);
      if (updatedChildren !== children) {
        return {
          ...block,
          data: {
            ...block.data,
            children: updatedChildren,
          },
        };
      }
    }
    return block;
  });
}

/**
 * Delete a block by ID from a tree structure (immutable)
 */
export function deleteBlockFromTree<T extends BlockWithChildren>(
  blocks: T[],
  id: string
): T[] {
  // First, try to delete from root level
  const filtered = blocks.filter((block) => block.id !== id);
  if (filtered.length !== blocks.length) {
    return filtered;
  }

  // If not found at root, search in children
  return blocks.map((block) => {
    const children = block.data?.children as T[] | undefined;
    if (children && children.length > 0) {
      const updatedChildren = deleteBlockFromTree(children, id);
      if (updatedChildren.length !== children.length) {
        return {
          ...block,
          data: {
            ...block.data,
            children: updatedChildren,
          },
        };
      }
    }
    return block;
  });
}

/**
 * Add a block as a child of a parent block (immutable)
 * If index is provided, insert at that position; otherwise append at end
 */
export function addBlockToParent<T extends BlockWithChildren>(
  blocks: T[],
  parentId: string,
  newBlock: T,
  index?: number
): T[] {
  return blocks.map((block) => {
    if (block.id === parentId) {
      const children = (block.data?.children as T[]) || [];
      const insertIndex = index ?? children.length;
      const newChildren = [
        ...children.slice(0, insertIndex),
        newBlock,
        ...children.slice(insertIndex),
      ];
      return {
        ...block,
        data: {
          ...block.data,
          children: newChildren,
        },
      };
    }
    // Recursively search in children (for deeper nesting if ever needed)
    const children = block.data?.children as T[] | undefined;
    if (children && children.length > 0) {
      const updatedChildren = addBlockToParent(children, parentId, newBlock, index);
      if (updatedChildren !== children) {
        return {
          ...block,
          data: {
            ...block.data,
            children: updatedChildren,
          },
        };
      }
    }
    return block;
  });
}

/**
 * Get the path (array of IDs) from root to a block
 * Returns empty array if block not found
 */
export function getBlockPath<T extends BlockWithChildren>(
  blocks: T[],
  targetId: string,
  currentPath: string[] = []
): string[] {
  for (const block of blocks) {
    if (block.id === targetId) {
      return [...currentPath, block.id];
    }
    const children = block.data?.children as T[] | undefined;
    if (children && children.length > 0) {
      const path = getBlockPath(children, targetId, [...currentPath, block.id]);
      if (path.length > 0) {
        return path;
      }
    }
  }
  return [];
}

/**
 * Get the parent ID of a block (returns null if block is at root level)
 */
export function getParentBlockId<T extends BlockWithChildren>(
  blocks: T[],
  targetId: string
): string | null {
  const path = getBlockPath(blocks, targetId);
  if (path.length <= 1) {
    return null; // Block is at root level or not found
  }
  return path[path.length - 2];
}

/**
 * Check if a block is nested inside another block
 */
export function isBlockNested<T extends BlockWithChildren>(
  blocks: T[],
  blockId: string
): boolean {
  return getParentBlockId(blocks, blockId) !== null;
}

/**
 * Reorder blocks within a container (move from one index to another)
 */
export function reorderBlocksInParent<T extends BlockWithChildren>(
  blocks: T[],
  parentId: string | null,
  fromIndex: number,
  toIndex: number
): T[] {
  if (parentId === null) {
    // Reorder at root level
    const result = [...blocks];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
  }

  // Reorder within a parent block
  return blocks.map((block) => {
    if (block.id === parentId) {
      const children = [...((block.data?.children as T[]) || [])];
      const [removed] = children.splice(fromIndex, 1);
      children.splice(toIndex, 0, removed);
      return {
        ...block,
        data: {
          ...block.data,
          children,
        },
      };
    }
    return block;
  });
}

/**
 * Move a block from one location to another (potentially across containers)
 */
export function moveBlock<T extends BlockWithChildren>(
  blocks: T[],
  blockId: string,
  targetParentId: string | null,
  targetIndex: number
): T[] {
  // Find and remove the block from its current location
  const block = findBlockInTree(blocks, blockId);
  if (!block) {
    return blocks;
  }

  let result = deleteBlockFromTree(blocks, blockId);

  // Add to new location
  if (targetParentId === null) {
    // Add to root level
    result = [
      ...result.slice(0, targetIndex),
      block,
      ...result.slice(targetIndex),
    ];
  } else {
    result = addBlockToParent(result, targetParentId, block, targetIndex);
  }

  return result;
}
