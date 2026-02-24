import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { CMSBlock } from '@maas/core-api-models';
import {
    findBlockInTree,
    updateBlockInTree,
    deleteBlockFromTree,
    addBlockToParent as addBlockToParentUtil,
} from '@maas/core-utils';

import { EditorPlugin, EditorSettings } from '../types';
import { generateBlockId } from '../utils/create-block';
import { defaultEditorSettings, EditorContext } from './editor-context';

type EditorProviderProps = React.PropsWithChildren<{
    plugins: EditorPlugin<any, any, any>[];
    field: {
        data: CMSBlock[];
        errors: string[] | undefined;
        onSave: (content: CMSBlock[]) => void;
    };
    context: any;
}>;

export function EditorProvider(props: EditorProviderProps) {
    const { children, plugins, field, context } = props;

    // Track the last saved version — captured when editor opens so cancel restores correctly
    const lastSavedVersionRef = useRef<CMSBlock[]>(field?.data ?? []);

    const [selectedBlockId, setSelectedBlockIdState] = useState<string | null>(null);
    const [parentBlockId, setParentBlockId] = useState<string | null>(null);
    const [selectedPlugin, setSelectedPlugin] = useState<EditorPlugin<any, any, any> | null>(null);
    const [settings, setSettings] = useState<EditorSettings>(defaultEditorSettings);

    // Wrapper to set both selectedBlockId and parentBlockId
    const setSelectedBlockId = useCallback((id: string | null, parentId?: string | null) => {
        setSelectedBlockIdState(id);
        setParentBlockId(parentId ?? null);
    }, []);

    // Capture content snapshot when editor opens, so cancel restores to pre-edit state
    const prevVisibleRef = useRef(settings.visible);
    useEffect(() => {
        if (!prevVisibleRef.current && settings.visible) {
            // Editor just opened — snapshot current content for cancel/reset
            lastSavedVersionRef.current = field?.data ?? [];
        }
        prevVisibleRef.current = settings.visible;
    }, [settings.visible, field?.data]);

    const content = field.data as CMSBlock[];

    const setContent = useCallback(
        (editorContent: CMSBlock[]) => {
            field?.onSave([...editorContent]);
        },
        [field]
    );

    const deleteBlockById = useCallback(
        (id: string) => {
            // Use recursive delete to handle nested blocks
            setContent(deleteBlockFromTree(content, id));
        },
        [content, setContent]
    );

    const addBlock = useCallback(
        (block: CMSBlock) => {
            setContent([...content, { ...block, id: generateBlockId() }]);
        },
        [content, setContent]
    );

    const addBlockToParent = useCallback(
        (block: CMSBlock, parentId: string, index?: number) => {
            const newBlock = { ...block, id: generateBlockId() };
            setContent(addBlockToParentUtil(content, parentId, newBlock, index));
        },
        [content, setContent]
    );

    // Reset de l'éditeur avec le contenu initial qui est le contenu du field
    const resetEditor = useCallback(() => {
        setContent(lastSavedVersionRef.current);
        setSettings(defaultEditorSettings);
        setSelectedBlockId(null);
    }, [setContent, setSelectedBlockId]);

    const getPluginFromBlockType = useCallback(
        (blockType: string): EditorPlugin<any, any, any> | null => {
            return plugins?.find((plugin) => plugin.blockType === blockType) || null;
        },
        [plugins]
    );

    // Get plugins available for a given context (nested blocks exclude containers)
    const getPluginsForContext = useCallback(
        (isNested: boolean): EditorPlugin<any, any, any>[] => {
            if (isNested) {
                // Exclude plugins that cannot be nested (e.g., containers like frame)
                return plugins?.filter((plugin) => plugin.dragDrop?.canBeNested !== false) || [];
            }
            return plugins || [];
        },
        [plugins]
    );

    const selectedBlockContent = useMemo(() => {
        if (!selectedBlockId) return null;
        // Use recursive search to find blocks at any nesting level
        const selectedBlock = findBlockInTree(content, selectedBlockId);
        if (!selectedBlock) return null;

        return selectedBlock as CMSBlock;
    }, [content, selectedBlockId]);

    const setSelectedBlockContent = useCallback(
        (newContent: CMSBlock) => {
            if (!selectedBlockContent) return;
            // Use recursive update to handle nested blocks
            setContent(updateBlockInTree(content, selectedBlockContent.id, () => newContent));
        },
        [content, selectedBlockContent, setContent]
    );

    const ctx = React.useMemo(() => {
        return {
            content,
            selectedPlugin,
            selectedBlockId,
            selectedBlockContent,
            parentBlockId,
            plugins,
            settings,
            setSelectedBlockId,
            deleteBlockById,
            addBlock,
            addBlockToParent,
            setSelectedBlockContent,
            setContent,
            getPluginFromBlockType,
            getPluginsForContext,
            setSettings,
            resetEditor,
            setSelectedPlugin,
            context,
        };
    }, [
        content,
        selectedPlugin,
        selectedBlockId,
        selectedBlockContent,
        parentBlockId,
        plugins,
        settings,
        setSelectedBlockId,
        setSelectedBlockContent,
        addBlock,
        addBlockToParent,
        deleteBlockById,
        setContent,
        getPluginFromBlockType,
        getPluginsForContext,
        resetEditor,
        context,
    ]);

    return <EditorContext.Provider value={ctx}>{children}</EditorContext.Provider>;
}
