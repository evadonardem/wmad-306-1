import { ErrorValue, FormDataErrors, FormDataKeys, FormDataType, FormDataValues, Method, Progress, UrlMethodPair, UseFormSubmitArguments, UseFormSubmitOptions, UseFormTransformCallback, UseFormWithPrecognitionArguments } from '@inertiajs/core';
import { NamedInputEvent, PrecognitionPath, ValidationConfig, Validator } from 'laravel-precognition';
export type SetDataByObject<TForm> = (data: Partial<TForm>) => void;
export type SetDataByMethod<TForm> = (data: (previousData: TForm) => TForm) => void;
export type SetDataByKeyValuePair<TForm> = <K extends FormDataKeys<TForm>>(key: K, value: FormDataValues<TForm, K>) => void;
export type SetDataAction<TForm extends Record<any, any>> = SetDataByObject<TForm> & SetDataByMethod<TForm> & SetDataByKeyValuePair<TForm>;
type PrecognitionValidationConfig<TKeys> = ValidationConfig & {
    only?: TKeys[] | Iterable<TKeys> | ArrayLike<TKeys>;
};
export interface InertiaFormProps<TForm extends object> {
    data: TForm;
    isDirty: boolean;
    errors: FormDataErrors<TForm>;
    hasErrors: boolean;
    processing: boolean;
    progress: Progress | null;
    wasSuccessful: boolean;
    recentlySuccessful: boolean;
    setData: SetDataAction<TForm>;
    transform: (callback: UseFormTransformCallback<TForm>) => void;
    setDefaults: {
        (): void;
        <T extends FormDataKeys<TForm>>(field: T, value: FormDataValues<TForm, T>): void;
        (fields: Partial<TForm>): void;
    };
    reset: <K extends FormDataKeys<TForm>>(...fields: K[]) => void;
    clearErrors: <K extends FormDataKeys<TForm>>(...fields: K[]) => void;
    resetAndClearErrors: <K extends FormDataKeys<TForm>>(...fields: K[]) => void;
    setError: {
        <K extends FormDataKeys<TForm>>(field: K, value: ErrorValue): void;
        (errors: FormDataErrors<TForm>): void;
    };
    submit: (...args: UseFormSubmitArguments) => void;
    get: (url: string, options?: UseFormSubmitOptions) => void;
    patch: (url: string, options?: UseFormSubmitOptions) => void;
    post: (url: string, options?: UseFormSubmitOptions) => void;
    put: (url: string, options?: UseFormSubmitOptions) => void;
    delete: (url: string, options?: UseFormSubmitOptions) => void;
    cancel: () => void;
    dontRemember: <K extends FormDataKeys<TForm>>(...fields: K[]) => InertiaFormProps<TForm>;
    withPrecognition: (...args: UseFormWithPrecognitionArguments) => InertiaPrecognitiveFormProps<TForm>;
}
export interface InertiaFormValidationProps<TForm extends object> {
    invalid: <K extends FormDataKeys<TForm>>(field: K) => boolean;
    setValidationTimeout: (duration: number) => InertiaPrecognitiveFormProps<TForm>;
    touch: <K extends FormDataKeys<TForm>>(field: K | NamedInputEvent | Array<K>, ...fields: K[]) => InertiaPrecognitiveFormProps<TForm>;
    touched: <K extends FormDataKeys<TForm>>(field?: K) => boolean;
    valid: <K extends FormDataKeys<TForm>>(field: K) => boolean;
    validate: <K extends FormDataKeys<TForm> | PrecognitionPath<TForm>>(field?: K | NamedInputEvent | PrecognitionValidationConfig<K>, config?: PrecognitionValidationConfig<K>) => InertiaPrecognitiveFormProps<TForm>;
    validateFiles: () => InertiaPrecognitiveFormProps<TForm>;
    validating: boolean;
    validator: () => Validator;
    withAllErrors: () => InertiaPrecognitiveFormProps<TForm>;
    withoutFileValidation: () => InertiaPrecognitiveFormProps<TForm>;
    setErrors: (errors: FormDataErrors<TForm>) => InertiaPrecognitiveFormProps<TForm>;
    forgetError: <K extends FormDataKeys<TForm> | NamedInputEvent>(field: K) => InertiaPrecognitiveFormProps<TForm>;
}
export type InertiaForm<TForm extends object> = InertiaFormProps<TForm>;
export type InertiaPrecognitiveFormProps<TForm extends object> = InertiaFormProps<TForm> & InertiaFormValidationProps<TForm>;
export default function useForm<TForm extends FormDataType<TForm>>(method: Method | (() => Method), url: string | (() => string), data: TForm | (() => TForm)): InertiaPrecognitiveFormProps<TForm>;
export default function useForm<TForm extends FormDataType<TForm>>(urlMethodPair: UrlMethodPair | (() => UrlMethodPair), data: TForm | (() => TForm)): InertiaPrecognitiveFormProps<TForm>;
export default function useForm<TForm extends FormDataType<TForm>>(rememberKey: string, data: TForm | (() => TForm)): InertiaFormProps<TForm>;
export default function useForm<TForm extends FormDataType<TForm>>(data: TForm | (() => TForm)): InertiaFormProps<TForm>;
export default function useForm<TForm extends FormDataType<TForm>>(): InertiaFormProps<TForm>;
export {};
