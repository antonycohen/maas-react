# @maas/web-cms-editor

A drag-and-drop CMS block editor for building page content with a plugin-based architecture.

## Overview

This package provides a visual editor for managing CMS content blocks. It supports drag-and-drop reordering, live preview modes (desktop/mobile), and a contextual editing panel for block properties.

## Installation

The package is available within the monorepo via the `@maas/web-cms-editor` import path.

```tsx
import { Editor, EditorTrigger, useEditorContext } from '@maas/web-cms-editor';
```

## Usage

### Basic Setup

```tsx
import { Editor, HeadingPlugin, ParagraphPlugin } from '@maas/web-cms-editor';

function PageEditor() {
  const [blocks, setBlocks] = useState<CMSBlock[]>([]);

  return (
    <Editor
      field={{
        data: blocks,
        errors: undefined,
        onSave: setBlocks,
      }}
      plugins={[HeadingPlugin, ParagraphPlugin]}
      onSave={() => console.log('Content saved')}
    />
  );
}
```

### Using the Editor Trigger

The `EditorTrigger` component provides a way to open the editor from external UI:

```tsx
import { Editor, EditorTrigger } from '@maas/web-cms-editor';

function ContentSection() {
  return (
    <Editor field={field} plugins={plugins} onSave={handleSave}>
      <EditorTrigger>
        <button>Open Editor</button>
      </EditorTrigger>
      {/* Content preview */}
    </Editor>
  );
}
```

The `EditorTrigger` also supports render props for more control:

```tsx
<EditorTrigger>
  {({ openEditor }) => (
    <CustomButton onClick={openEditor}>Edit Content</CustomButton>
  )}
</EditorTrigger>
```

### Passing Context to Plugins

You can pass custom context data to plugins via the `context` prop:

```tsx
<Editor
  field={field}
  plugins={plugins}
  context={{ organizationId: '123', locale: 'fr' }}
  onSave={handleSave}
/>
```

### Accessing Editor Context

Use the `useEditorContext` hook to access editor state within child components:

```tsx
import { useEditorContext } from '@maas/web-cms-editor';

function CustomComponent() {
  const {
    content,
    selectedBlockId,
    selectedBlockContent,
    settings,
    plugins,
    addBlock,
    deleteBlockById,
    setSelectedBlockId,
  } = useEditorContext();
  // ...
}
```

## Architecture

### Core Components

| Component | Description |
|-----------|-------------|
| `Editor` | Main editor wrapper with drag-drop context and state provider |
| `EditorTrigger` | Opens the editor overlay when clicked |
| `EditorEntryElement` | Entry point for rendering blocks outside the editor |
| `EditorProvider` | Context provider managing editor state |

### Internal Components

| Component | Description |
|-----------|-------------|
| `EditorTools` | Left sidebar displaying available block types |
| `EditorPreview` | Central preview area with drag-and-drop blocks |
| `EditorContextualPanel` | Right panel for editing selected block properties |
| `EditorActionsBar` | Top bar with save/cancel and preview mode controls |
| `EditorBlock` | Individual block wrapper with selection and actions |

### Plugin System

Each block type is defined by a plugin that specifies:

- `name` - Unique plugin identifier
- `displayName` - Human-readable name shown in the editor
- `blockType` - The CMS block type string (matches API model)
- `icon` - Icon component/element for the toolbar
- `enabled` - Whether the plugin is active
- `inputsSections` - Form fields for editing block properties
- `renderingBlock` - React component that renders the block
- `shape` - Default block data structure (from `@maas/core-api-models`)

### Creating a Custom Plugin

```tsx
import { EditorPlugin } from '@maas/web-cms-editor';
import { CMSCustomBlock, customBlockShape } from '@maas/core-api-models';

export const CustomPlugin: EditorPlugin<'Custom', CMSCustomBlock, MyContext> = {
  name: 'Custom',
  displayName: 'Custom Block',
  enabled: true,
  icon: <CustomIcon />,
  blockType: 'custom',
  shape: customBlockShape,
  inputsSections: [
    {
      name: 'Content',
      hasBorder: true,
      visibilityCondition: (data) => data.showSection !== false,
      inputs: [
        {
          type: 'text',
          name: 'title',
          label: 'Title',
          required: true,
        },
        {
          type: 'select',
          name: 'variant',
          label: 'Style',
          options: [
            { value: 'default', label: 'Default' },
            { value: 'highlighted', label: 'Highlighted' },
          ],
        },
      ],
    },
  ],
  renderingBlock: (props, editorSettings) => (
    <CustomBlock block={props} editMode={editorSettings?.editMode} />
  ),
};
```

### Input Types

The editor supports several input types for block properties:

| Type | Description |
|------|-------------|
| `text` | Single-line text input |
| `select` | Dropdown selection with predefined options |
| `rte` | Rich text editor |
| `image` | Image upload/selection |
| `date` | Date picker |
| `multi_group` | Repeatable group of inputs (for arrays) |

### Multi-Group Input Example

For repeatable content like card lists:

```tsx
{
  type: 'multi_group',
  name: 'cards',           // Must point to an array field
  label: 'Cards',
  titlePath: 'title',      // Field to use as item title in UI
  subtitle: 'Card Item',   // Label for each item
  items: [
    { type: 'image', name: 'image', label: 'Image' },
    { type: 'text', name: 'title', label: 'Title' },
    { type: 'rte', name: 'description', label: 'Description' },
  ],
}
```

## Available Plugins

### Text Content
- `HeadingPlugin` - Heading blocks (H1-H6)
- `ParagraphPlugin` - Paragraph text blocks
- `QuotesPlugin` - Quote/testimonial blocks
- `HighlightPlugin` - Highlighted content sections

### Media
- `ImagesPlugin` - Image blocks
- `ImageWithTextPlugin` - Image with accompanying text
- `VideoPlugin` - Video embed blocks
- `AudioPlugin` - Audio player blocks
- `MosaicGalleryPlugin` - Mosaic-style image gallery
- `IframePlugin` - Embedded iframe content

### Cards & Collections
- `CardsTextWithImagePlugin` - Card grid with images and text
- `CardEventPlugin` - Event card blocks
- `CardPressCoveragePlugin` - Press coverage cards
- `PodcastCarouselPlugin` - Podcast episode carousel
- `AnalyzePlugin` - Analysis/statistics blocks

## Available Blocks

Each plugin has a corresponding block component for rendering:

### Text
- `HeadingBlock` - Renders heading elements
- `ParagraphBlock` - Renders paragraph content
- `QuotesBlock` - Renders quote/testimonial

### Media
- `ImageBlock` - Single image display
- `ImageAndTextBlock` - Image with text layout
- `VideoBlock` - Video player embed
- `AudioBlock` - Audio player
- `GalleryBlock` - Image gallery
- `CarouselBlock` - Image carousel
- `MosaicGalleryBlock` - Mosaic-style gallery
- `IframeBlock` - Embedded iframe

### Cards
- `CardsBlock` - Card grid layout
- `CardBlock` - Individual card component
- `CardEventBlock` - Event card
- `CardPressCoverageBlock` - Press coverage card
- `PodcastCarouselBlock` - Podcast carousel

### Other
- `HighlightBlock` - Highlighted section
- `AnalyzeBlock` - Analysis/statistics display
- `HtmlBlock` - Raw HTML content
- `TableBlock` - Table display
- `ListBlock` - List content
- `ButtonBlock` - Call-to-action button

## State Management

The editor uses React Context (`EditorContext`) for state management:

### State Values
- `content` - Array of CMS blocks
- `selectedBlockId` - Currently selected block ID
- `selectedBlockContent` - Full content of selected block
- `selectedPlugin` - Plugin definition for selected block
- `plugins` - Available editor plugins
- `settings` - Editor settings object
- `context` - Custom context passed to Editor

### Settings Object
```tsx
interface EditorSettings {
  editMode: boolean;           // Whether editing is enabled
  hoveredBlockId: string | null;
  pluginInputsHovered: boolean;
  previewMode: 'desktop' | 'mobile' | false;
  visible: boolean;            // Whether editor overlay is shown
}
```

### Actions
- `setContent(blocks)` - Update all content blocks
- `setSelectedBlockId(id)` - Select a block
- `setSelectedBlockContent(block)` - Update selected block
- `addBlock(block)` - Add a new block
- `deleteBlockById(id)` - Remove a block
- `getPluginFromBlockType(type)` - Get plugin by block type
- `resetEditor()` - Reset to last saved state
- `setSettings(settings)` - Update editor settings

## Commands

```bash
# Run tests
npx nx test @maas/web-cms-editor

# Type check
npx nx typecheck @maas/web-cms-editor

# Lint
npx nx lint @maas/web-cms-editor
```

## Dependencies

- `@maas/core-api-models` - Block type definitions and shapes
- `@maas/core-utils` - Utility functions (cn, reorder)
- `@maas/web-components` - UI components (Button, etc.)
- `@dnd-kit/core` - Drag and drop core functionality
- `@dnd-kit/sortable` - Sortable list functionality
