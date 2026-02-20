import { FieldValues } from 'react-hook-form';

import { ControlledArticleInput } from '../inputs/controlled-article-input';
import { ControlledAssociativeTokenInput } from '../inputs/controlled-associative-token-input';
import { ControlledCheckbox } from '../inputs/controlled-checkbox';
import { ControlledCMSInput } from '../inputs/controlled-cms-input';
import { ControlledDateInput } from '../inputs/controlled-date-input';
import { ControlledEnumInput } from '../inputs/controlled-enum-input';
import { ControlledImageInput } from '../inputs/controlled-image-input';
import { ControlledLanguageInput } from '../inputs/controlled-language-input';
import { ControlledMagazineBrandInput } from '../inputs/controlled-magazine-brand-input';
import { ControlledCategoryInput } from '../inputs/controlled-category-input';
import { ControlledCategoriesInput } from '../inputs/controlled-categories-input';
import { ControlledArticleTypeInput } from '../inputs/controlled-article-type-input';
import { ControlledMagazineFolderInput } from '../inputs/controlled-magazine-folder-input';
import { ControlledPasswordInput } from '../inputs/controlled-password-input';
import { ControlledRTEInput } from '../inputs/controlled-rte-input';
import { ControlledSelectInput } from '../inputs/controlled-select-input';
import { ControlledSlugValueInput } from '../inputs/controlled-slug-value-input';
import { ControlledSlugValueArrayInput } from '../inputs/controlled-slug-value-array-input';
import { ControlledSwitchInput } from '../inputs/controlled-switch-input';
import { ControlledTextInput } from '../inputs/controlled-text-input';
import { ControlledTextareaInput } from '../inputs/controlled-textarea-input';
import { ControlledTokenInput } from '../inputs/controlled-token-input';
import { ControlledVideoInput } from '../inputs/controlled-video-input';
import { ControlledRatioInput } from '../inputs/controlled-ratio-input';
import { ControlledColorPickerInput } from '../inputs/controlled-color-picker-input';
import { ControlledCountryInput } from '../inputs/controlled-country-input';
import { ControlledPlanInput } from '../inputs/controlled-plan-input';

export function createConnectedInputHelpers<T extends FieldValues, Context = unknown>() {
    return {
        ControlledArticleInput: ControlledArticleInput<T>,
        ControlledAssociativeTokenInput: ControlledAssociativeTokenInput<T>,
        ControlledCheckbox: ControlledCheckbox<T>,
        ControlledCMSInput: ControlledCMSInput<T, Context>,
        ControlledDateInput: ControlledDateInput<T>,
        ControlledEnumInput: ControlledEnumInput<T>,
        ControlledImageInput: ControlledImageInput<T>,
        ControlledLanguageInput: ControlledLanguageInput<T>,
        ControlledMagazineBrandInput: ControlledMagazineBrandInput<T>,
        ControlledCategoryInput: ControlledCategoryInput<T>,
        ControlledCategoriesInput: ControlledCategoriesInput<T>,
        ControlledArticleTypeInput: ControlledArticleTypeInput<T>,
        ControlledMagazineFolderInput: ControlledMagazineFolderInput<T>,
        ControlledPasswordInput: ControlledPasswordInput<T>,
        ControlledRTEInput: ControlledRTEInput<T>,
        ControlledSelectInput: ControlledSelectInput<T>,
        ControlledSlugValueInput: ControlledSlugValueInput<T>,
        ControlledSlugValueArrayInput: ControlledSlugValueArrayInput<T>,
        ControlledSwitchInput: ControlledSwitchInput<T>,
        ControlledTextAreaInput: ControlledTextareaInput<T>,
        ControlledTextInput: ControlledTextInput<T>,
        ControlledTokenInput: ControlledTokenInput<T>,
        ControlledVideoInput: ControlledVideoInput<T>,
        ControlledRatioInput: ControlledRatioInput<T>,
        ControlledColorPickerInput: ControlledColorPickerInput<T>,
        ControlledCountryInput: ControlledCountryInput<T>,
        ControlledPlanInput: ControlledPlanInput<T>,
    };
}
