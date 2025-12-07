import { FieldValues } from 'react-hook-form';

import { ControlledCheckbox } from '../inputs/controlled-checkbox';
import { ControlledCMSInput } from '../inputs/controlled-cms-input';
import { ControlledDateInput } from '../inputs/controlled-date-input';
import { ControlledImageInput } from '../inputs/controlled-image-input';
import { ControlledMagazineCategoryInput } from '../inputs/controlled-magazine-category-input';
import { ControlledRTEInput } from '../inputs/controlled-rte-input';
import { ControlledSelectInput } from '../inputs/controlled-select-input';
import { ControlledTextInput } from '../inputs/controlled-text-input';
import { ControlledTextareaInput } from '../inputs/controlled-textarea-input';
import { ControlledAssociativeTokenInput } from '../inputs/controlled-associative-token-input';
import { ControlledMagazineBrandInput } from '../inputs/controlled-magazine-brand-input';
import { ControlledMagazineFolderInput } from '../inputs/controlled-magazine-folder-input';

export function createConnectedInputHelpers<
  T extends FieldValues,
  Context = unknown,
>() {
  return {
    ControlledTextInput: ControlledTextInput<T>,
    ControlledTextAreaInput: ControlledTextareaInput<T>,
    ControlledDateInput: ControlledDateInput<T>,
    ControlledSelectInput: ControlledSelectInput<T>,
    ControlledRTEInput: ControlledRTEInput<T>,
    ControlledImageInput: ControlledImageInput<T>,
    ControlledCMSInput: ControlledCMSInput<T, Context>,
    ControlledMagazineBrandInput: ControlledMagazineBrandInput<T>,
    ControlledMagazineCategoryInput: ControlledMagazineCategoryInput<T>,
    ControlledMagazineFolderInput: ControlledMagazineFolderInput<T>,
    ControlledAssociativeTokenInput: ControlledAssociativeTokenInput<T>,
    ControlledCheckbox: ControlledCheckbox<T>,
  };
}
