# @maas/web-form

Form utilities and controlled input components for React Hook Form integration.

## Installation

This package is part of the Kodd monorepo. Import from `@maas/web-form`.

## Exports

### Controlled Inputs

Pre-built form inputs that integrate with React Hook Form's `useController`. Must be used within a `FormProvider` context.

#### ControlledTextInput

```tsx
import { ControlledTextInput } from '@maas/web-form';

<ControlledTextInput<MyFormType>
  name="email"
  label="Email Address"
  placeholder="Enter your email"
/>
```

#### ControlledTextareaInput

```tsx
import { ControlledTextareaInput } from '@maas/web-form';

<ControlledTextareaInput<MyFormType>
  name="description"
  label="Description"
  placeholder="Enter description"
  description="Maximum 100 characters"
/>
```

#### ControlledDateInput

```tsx
import { ControlledDateInput } from '@maas/web-form';

<ControlledDateInput<MyFormType>
  name="birthDate"
  label="Birth Date"
  placeholder="Select a date"
  description="Optional helper text"
  disabled={false}
/>
```

#### ControlledSelectInput

```tsx
import { ControlledSelectInput, SelectOption } from '@maas/web-form';

const statusOptions: SelectOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

<ControlledSelectInput<MyFormType>
  name="status"
  label="Status"
  options={statusOptions}
  placeholder="Select a status"
  description="Choose the current status"
  disabled={false}
/>
```

#### ControlledRTEInput

Rich text editor powered by [Lexical](https://lexical.dev/). Includes a toolbar with bold, italic, underline, and strikethrough formatting.

```tsx
import { ControlledRTEInput } from '@maas/web-form';

<ControlledRTEInput<MyFormType>
  name="content"
  label="Article Content"
  placeholder="Start writing..."
  description="Use the toolbar to format your text"
  disabled={false}
/>
```

#### ControlledImageInput

Image picker with upload, preview, and remove functionality. Uses `PathsToType<T, Image>` for type-safe field selection - only fields with `Image` type can be selected.

```tsx
import { ControlledImageInput } from '@maas/web-form';
import { Image } from '@maas/core-api-models';

type MyFormType = {
  name: string;
  profilePicture: Image | null;
  coverPhoto: Image | null;
};

<ControlledImageInput<MyFormType>
  name="profilePicture" // Only Image fields are allowed
  label="Profile Picture"
  description="Upload a profile image"
  accept="image/png, image/jpeg"
  disabled={false}
/>
```

### Form Component

A simple form wrapper that provides React Hook Form context.

```tsx
import { Form } from '@maas/web-form';

<Form<MyFormType> defaultValues={{ email: '', name: '' }}>
  {/* Controlled inputs go here */}
</Form>
```

### createConnectedInputHelpers

Factory function that returns type-safe controlled inputs for a specific form schema.

```tsx
import { createConnectedInputHelpers } from '@maas/web-form';

type MyForm = {
  title: string;
  description: string;
  date: Date;
  status: string;
};

const {
  ControlledTextInput,
  ControlledTextAreaInput,
  ControlledDateInput,
  ControlledSelectInput,
  ControlledRTEInput,
  ControlledImageInput,
} = createConnectedInputHelpers<MyForm>();

// Now these inputs are pre-typed for MyForm
<ControlledTextInput name="title" label="Title" />
```

### BugReportForm

Example form component demonstrating React Hook Form with Zod validation.

## Usage with React Hook Form

```tsx
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ControlledTextInput, ControlledDateInput } from '@maas/web-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  birthDate: z.date({ required_error: 'Birth date is required' }),
});

type FormData = z.infer<typeof schema>;

function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      birthDate: undefined,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ControlledTextInput<FormData>
          name="name"
          label="Full Name"
          placeholder="John Doe"
        />
        <ControlledDateInput<FormData>
          name="birthDate"
          label="Birth Date"
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}
```

## Props

### Common Props (all controlled inputs)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `FieldPath<T>` | Yes | Form field name (type-safe path) |
| `label` | `string` | Yes | Field label text |
| `placeholder` | `string` | No | Placeholder text |
| `description` | `string` | No | Helper text below the input |

### ControlledDateInput Additional Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `disabled` | `boolean` | No | Disable the date picker |

### ControlledSelectInput Additional Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `options` | `SelectOption[]` | Yes | Array of `{ value: string, label: string }` |
| `disabled` | `boolean` | No | Disable the select |

### ControlledRTEInput Additional Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `disabled` | `boolean` | No | Disable the editor |

### ControlledImageInput Additional Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `PathsToType<T, Image>` | Yes | Only fields with `Image` type (type-safe) |
| `disabled` | `boolean` | No | Disable the image picker |
| `accept` | `string` | No | Accepted file types (default: `image/*`) |

## Dependencies

- `react-hook-form` - Form state management
- `@maas/web-components` - UI components (Field, Input, DatePicker, RichTextEditor, etc.)
- `lexical` / `@lexical/react` - Rich text editor framework (used by RichTextEditor)

## Running unit tests

Run `nx test @maas/web-form` to execute the unit tests.
