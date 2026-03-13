import { FormComponentRef, FormComponentSlotProps, FormDataConvertible, Method } from '@inertiajs/core';
import React, { ReactNode } from 'react';
declare const Form: React.ForwardRefExoticComponent<Partial<Pick<import("@inertiajs/core").Visit<import("@inertiajs/core").RequestPayload>, "headers" | "errorBag" | "queryStringArrayFormat" | "showProgress" | "invalidateCacheTags"> & Omit<import("@inertiajs/core").VisitCallbacks<import("@inertiajs/core").RequestPayload>, "onPrefetched" | "onPrefetching">> & {
    method?: Method | Uppercase<Method>;
    action?: string | import("@inertiajs/core").UrlMethodPair;
    transform?: (data: Record<string, FormDataConvertible>) => Record<string, FormDataConvertible>;
    options?: import("@inertiajs/core").FormComponentOptions;
    onSubmitComplete?: (props: import("@inertiajs/core").FormComponentonSubmitCompleteArguments) => void;
    disableWhileProcessing?: boolean;
    resetOnSuccess?: boolean | string[];
    resetOnError?: boolean | string[];
    setDefaultsOnSuccess?: boolean;
    validateFiles?: boolean;
    validationTimeout?: number;
    withAllErrors?: boolean | null;
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, "children" | "method" | "headers" | "errorBag" | "queryStringArrayFormat" | "showProgress" | "invalidateCacheTags" | "onCancelToken" | "onBefore" | "onBeforeUpdate" | "onStart" | "onProgress" | "onFinish" | "onCancel" | "onSuccess" | "onError" | "onFlash" | "withAllErrors" | "options" | "action" | "transform" | "onSubmitComplete" | "disableWhileProcessing" | "resetOnSuccess" | "resetOnError" | "setDefaultsOnSuccess" | "validateFiles" | "validationTimeout"> & Omit<React.AllHTMLAttributes<HTMLFormElement>, "children" | "method" | "headers" | "errorBag" | "queryStringArrayFormat" | "showProgress" | "invalidateCacheTags" | "onCancelToken" | "onBefore" | "onBeforeUpdate" | "onStart" | "onProgress" | "onFinish" | "onCancel" | "onSuccess" | "onError" | "onFlash" | "withAllErrors" | "options" | "action" | "transform" | "onSubmitComplete" | "disableWhileProcessing" | "resetOnSuccess" | "resetOnError" | "setDefaultsOnSuccess" | "validateFiles" | "validationTimeout"> & {
    children: ReactNode | ((props: FormComponentSlotProps) => ReactNode);
} & React.RefAttributes<FormComponentSlotProps>>;
export declare function useFormContext(): FormComponentRef | undefined;
export default Form;
