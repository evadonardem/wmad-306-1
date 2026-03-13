// src/index.ts
import { config as coreConfig, progress as Progress2, router as Router } from "@inertiajs/core";

// src/App.ts
import {
  createHeadManager,
  router
} from "@inertiajs/core";
import { createElement, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";

// src/HeadContext.ts
import { createContext } from "react";
var headContext = createContext(null);
headContext.displayName = "InertiaHeadContext";
var HeadContext_default = headContext;

// src/PageContext.ts
import { createContext as createContext2 } from "react";
var pageContext = createContext2(null);
pageContext.displayName = "InertiaPageContext";
var PageContext_default = pageContext;

// src/App.ts
var currentIsInitialPage = true;
var routerIsInitialized = false;
var swapComponent = async () => {
  currentIsInitialPage = false;
};
function App({
  children,
  initialPage,
  initialComponent,
  resolveComponent,
  titleCallback,
  onHeadUpdate
}) {
  const [current, setCurrent] = useState({
    component: initialComponent || null,
    page: { ...initialPage, flash: initialPage.flash ?? {} },
    key: null
  });
  const headManager = useMemo(() => {
    return createHeadManager(
      typeof window === "undefined",
      titleCallback || ((title) => title),
      onHeadUpdate || (() => {
      })
    );
  }, []);
  if (!routerIsInitialized) {
    router.init({
      initialPage,
      resolveComponent,
      swapComponent: async (args) => swapComponent(args),
      onFlash: (flash) => {
        setCurrent((current2) => ({
          ...current2,
          page: { ...current2.page, flash }
        }));
      }
    });
    routerIsInitialized = true;
  }
  useEffect(() => {
    swapComponent = async ({ component, page, preserveState }) => {
      if (currentIsInitialPage) {
        currentIsInitialPage = false;
        return;
      }
      flushSync(
        () => setCurrent((current2) => ({
          component,
          page,
          key: preserveState ? current2.key : Date.now()
        }))
      );
    };
    router.on("navigate", () => headManager.forceUpdate());
  }, []);
  if (!current.component) {
    return createElement(
      HeadContext_default.Provider,
      { value: headManager },
      createElement(PageContext_default.Provider, { value: current.page }, null)
    );
  }
  const renderChildren = children || (({ Component, props, key }) => {
    const child = createElement(Component, { key, ...props });
    if (typeof Component.layout === "function") {
      return Component.layout(child);
    }
    if (Array.isArray(Component.layout)) {
      return Component.layout.concat(child).reverse().reduce((children2, Layout) => createElement(Layout, { children: children2, ...props }));
    }
    return child;
  });
  return createElement(
    HeadContext_default.Provider,
    { value: headManager },
    createElement(
      PageContext_default.Provider,
      { value: current.page },
      renderChildren({
        Component: current.component,
        key: current.key,
        props: current.page.props
      })
    )
  );
}
App.displayName = "Inertia";

// src/createInertiaApp.ts
import {
  getInitialPageFromDOM,
  router as router2,
  setupProgress
} from "@inertiajs/core";
import { createElement as createElement2, Fragment } from "react";
async function createInertiaApp({
  id = "app",
  resolve,
  setup,
  title,
  progress: progress2 = {},
  page,
  render,
  defaults = {}
}) {
  config.replace(defaults);
  const isServer = typeof window === "undefined";
  const useScriptElementForInitialPage = config.get("future.useScriptElementForInitialPage");
  const initialPage = page || getInitialPageFromDOM(id, useScriptElementForInitialPage);
  const resolveComponent = (name) => Promise.resolve(resolve(name)).then((module) => module.default || module);
  let head = [];
  const reactApp = await Promise.all([
    resolveComponent(initialPage.component),
    router2.decryptHistory().catch(() => {
    })
  ]).then(([initialComponent]) => {
    const props = {
      initialPage,
      initialComponent,
      resolveComponent,
      titleCallback: title
    };
    if (isServer) {
      const ssrSetup = setup;
      return ssrSetup({
        el: null,
        App,
        props: { ...props, onHeadUpdate: (elements) => head = elements }
      });
    }
    const csrSetup = setup;
    return csrSetup({
      el: document.getElementById(id),
      App,
      props
    });
  });
  if (!isServer && progress2) {
    setupProgress(progress2);
  }
  if (isServer && render) {
    const element = () => {
      if (!useScriptElementForInitialPage) {
        return createElement2(
          "div",
          {
            id,
            "data-page": JSON.stringify(initialPage)
          },
          reactApp
        );
      }
      return createElement2(
        Fragment,
        null,
        createElement2("script", {
          "data-page": id,
          type: "application/json",
          dangerouslySetInnerHTML: { __html: JSON.stringify(initialPage).replace(/\//g, "\\/") }
        }),
        createElement2("div", { id }, reactApp)
      );
    };
    const body = await render(element());
    return { head, body };
  }
}

// src/Deferred.ts
import { useEffect as useEffect3, useMemo as useMemo2, useState as useState2 } from "react";

// src/usePage.ts
import React2 from "react";

// src/react.ts
import React, { useEffect as useEffect2, useLayoutEffect } from "react";
function useIsomorphicLayoutEffect(effect, deps) {
  typeof window === "undefined" ? useEffect2(effect, deps) : useLayoutEffect(effect, deps);
}
var isReact19 = typeof React.use === "function";

// src/usePage.ts
function usePage() {
  const page = isReact19 ? React2.use(PageContext_default) : React2.useContext(PageContext_default);
  if (!page) {
    throw new Error("usePage must be used within the Inertia component");
  }
  return page;
}

// src/Deferred.ts
var urlWithoutHash = (url) => {
  url = new URL(url.href);
  url.hash = "";
  return url;
};
var isSameUrlWithoutHash = (url1, url2) => {
  return urlWithoutHash(url1).href === urlWithoutHash(url2).href;
};
var Deferred = ({ children, data, fallback }) => {
  if (!data) {
    throw new Error("`<Deferred>` requires a `data` prop to be a string or array of strings");
  }
  const [loaded, setLoaded] = useState2(false);
  const pageProps = usePage().props;
  const keys = useMemo2(() => Array.isArray(data) ? data : [data], [data]);
  useEffect3(() => {
    const removeListener = router3.on("start", (e) => {
      const isPartialVisit = e.detail.visit.only.length > 0 || e.detail.visit.except.length > 0;
      const isReloadingKey = e.detail.visit.only.find((key) => keys.includes(key));
      if (isSameUrlWithoutHash(e.detail.visit.url, window.location) && (!isPartialVisit || isReloadingKey)) {
        setLoaded(false);
      }
    });
    return () => {
      removeListener();
    };
  }, []);
  useEffect3(() => {
    setLoaded(keys.every((key) => pageProps[key] !== void 0));
  }, [pageProps, keys]);
  const propsAreDefined = useMemo2(() => keys.every((key) => pageProps[key] !== void 0), [keys, pageProps]);
  if (loaded && propsAreDefined) {
    return typeof children === "function" ? children() : children;
  }
  return typeof fallback === "function" ? fallback() : fallback;
};
Deferred.displayName = "InertiaDeferred";
var Deferred_default = Deferred;

// src/Form.ts
import {
  config as config2,
  FormComponentResetSymbol,
  formDataToObject,
  isUrlMethodPair,
  mergeDataIntoQueryString,
  resetFormFields,
  UseFormUtils as UseFormUtils2
} from "@inertiajs/core";
import { isEqual as isEqual2 } from "lodash-es";
import React3, {
  createContext as createContext3,
  createElement as createElement3,
  forwardRef,
  useContext,
  useEffect as useEffect6,
  useImperativeHandle,
  useMemo as useMemo4,
  useRef as useRef2,
  useState as useState5
} from "react";

// src/useForm.ts
import {
  router as router5,
  UseFormUtils
} from "@inertiajs/core";
import {
  createValidator,
  resolveName,
  toSimpleValidationErrors
} from "laravel-precognition";
import { cloneDeep, get, has, isEqual, set } from "lodash-es";
import { useCallback, useEffect as useEffect5, useMemo as useMemo3, useRef, useState as useState4 } from "react";

// src/useRemember.ts
import { router as router4 } from "@inertiajs/core";
import { useEffect as useEffect4, useState as useState3 } from "react";
function useRemember(initialState, key, excludeKeysRef) {
  const [state, setState] = useState3(() => {
    const restored = router4.restore(key);
    return restored !== void 0 ? restored : initialState;
  });
  useEffect4(() => {
    const keys = excludeKeysRef?.current;
    if (keys && keys.length > 0 && typeof state === "object" && state !== null) {
      const filtered = { ...state };
      keys.forEach((k) => delete filtered[k]);
      router4.remember(filtered, key);
    } else {
      router4.remember(state, key);
    }
  }, [state, key]);
  return [state, setState];
}

// src/useForm.ts
function useForm(...args) {
  const isMounted = useRef(false);
  const parsedArgs = UseFormUtils.parseUseFormArguments(...args);
  const { rememberKey, data: initialData } = parsedArgs;
  const precognitionEndpoint = useRef(parsedArgs.precognitionEndpoint);
  const [defaults, setDefaults] = useState4(
    typeof initialData === "function" ? cloneDeep(initialData()) : cloneDeep(initialData)
  );
  const cancelToken = useRef(null);
  const recentlySuccessfulTimeoutId = useRef(void 0);
  const excludeKeysRef = useRef([]);
  const [data, setData] = rememberKey ? useRemember(defaults, `${rememberKey}:data`, excludeKeysRef) : useState4(defaults);
  const [errors, setErrors] = rememberKey ? useRemember({}, `${rememberKey}:errors`) : useState4({});
  const [hasErrors, setHasErrors] = useState4(false);
  const [processing, setProcessing] = useState4(false);
  const [progress2, setProgress] = useState4(null);
  const [wasSuccessful, setWasSuccessful] = useState4(false);
  const [recentlySuccessful, setRecentlySuccessful] = useState4(false);
  const transform = useRef((data2) => data2);
  const isDirty = useMemo3(() => !isEqual(data, defaults), [data, defaults]);
  const validatorRef = useRef(null);
  const [validating, setValidating] = useState4(false);
  const [touchedFields, setTouchedFields] = useState4([]);
  const [validFields, setValidFields] = useState4([]);
  const withAllErrors = useRef(null);
  useEffect5(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  const setDefaultsCalledInOnSuccess = useRef(false);
  const submit = useCallback(
    (...args2) => {
      const { method, url, options } = UseFormUtils.parseSubmitArguments(args2, precognitionEndpoint.current);
      setDefaultsCalledInOnSuccess.current = false;
      const _options = {
        ...options,
        onCancelToken: (token) => {
          cancelToken.current = token;
          if (options.onCancelToken) {
            return options.onCancelToken(token);
          }
        },
        onBefore: (visit) => {
          setWasSuccessful(false);
          setRecentlySuccessful(false);
          clearTimeout(recentlySuccessfulTimeoutId.current);
          if (options.onBefore) {
            return options.onBefore(visit);
          }
        },
        onStart: (visit) => {
          setProcessing(true);
          if (options.onStart) {
            return options.onStart(visit);
          }
        },
        onProgress: (event) => {
          setProgress(event || null);
          if (options.onProgress) {
            return options.onProgress(event);
          }
        },
        onSuccess: async (page) => {
          if (isMounted.current) {
            setProcessing(false);
            setProgress(null);
            setErrors({});
            setHasErrors(false);
            setWasSuccessful(true);
            setRecentlySuccessful(true);
            recentlySuccessfulTimeoutId.current = setTimeout(() => {
              if (isMounted.current) {
                setRecentlySuccessful(false);
              }
            }, config.get("form.recentlySuccessfulDuration"));
          }
          const onSuccess = options.onSuccess ? await options.onSuccess(page) : null;
          if (isMounted.current && !setDefaultsCalledInOnSuccess.current) {
            setData((data2) => {
              setDefaults(cloneDeep(data2));
              return data2;
            });
          }
          return onSuccess;
        },
        onError: (errors2) => {
          if (isMounted.current) {
            setProcessing(false);
            setProgress(null);
            setErrors(errors2);
            setHasErrors(Object.keys(errors2).length > 0);
            validatorRef.current?.setErrors(errors2);
          }
          if (options.onError) {
            return options.onError(errors2);
          }
        },
        onCancel: () => {
          if (isMounted.current) {
            setProcessing(false);
            setProgress(null);
          }
          if (options.onCancel) {
            return options.onCancel();
          }
        },
        onFinish: (visit) => {
          if (isMounted.current) {
            setProcessing(false);
            setProgress(null);
          }
          cancelToken.current = null;
          if (options.onFinish) {
            return options.onFinish(visit);
          }
        }
      };
      const transformedData = transform.current(data);
      if (method === "delete") {
        router5.delete(url, { ..._options, data: transformedData });
      } else {
        router5[method](url, transformedData, _options);
      }
    },
    [data, setErrors, transform]
  );
  const setDataFunction = useCallback(
    (keyOrData, maybeValue) => {
      if (typeof keyOrData === "string") {
        setData((data2) => set(cloneDeep(data2), keyOrData, maybeValue));
      } else if (typeof keyOrData === "function") {
        setData((data2) => keyOrData(data2));
      } else {
        setData(keyOrData);
      }
    },
    [setData]
  );
  const [dataAsDefaults, setDataAsDefaults] = useState4(false);
  const dataRef = useRef(data);
  useEffect5(() => {
    dataRef.current = data;
  });
  const setDefaultsFunction = useCallback(
    (fieldOrFields, maybeValue) => {
      setDefaultsCalledInOnSuccess.current = true;
      let newDefaults = {};
      if (typeof fieldOrFields === "undefined") {
        newDefaults = { ...dataRef.current };
        setDefaults(dataRef.current);
        setDataAsDefaults(true);
      } else {
        setDefaults((defaults2) => {
          newDefaults = typeof fieldOrFields === "string" ? set(cloneDeep(defaults2), fieldOrFields, maybeValue) : Object.assign(cloneDeep(defaults2), fieldOrFields);
          return newDefaults;
        });
      }
      validatorRef.current?.defaults(newDefaults);
    },
    [setDefaults]
  );
  useIsomorphicLayoutEffect(() => {
    if (!dataAsDefaults) {
      return;
    }
    if (isDirty) {
      setDefaults(data);
    }
    setDataAsDefaults(false);
  }, [dataAsDefaults]);
  const reset = useCallback(
    (...fields) => {
      if (fields.length === 0) {
        setData(defaults);
      } else {
        setData(
          (data2) => fields.filter((key) => has(defaults, key)).reduce(
            (carry, key) => {
              return set(carry, key, get(defaults, key));
            },
            { ...data2 }
          )
        );
      }
      validatorRef.current?.reset(...fields);
    },
    [setData, defaults]
  );
  const setError = useCallback(
    (fieldOrFields, maybeValue) => {
      setErrors((errors2) => {
        const newErrors = {
          ...errors2,
          ...typeof fieldOrFields === "string" ? { [fieldOrFields]: maybeValue } : fieldOrFields
        };
        setHasErrors(Object.keys(newErrors).length > 0);
        validatorRef.current?.setErrors(newErrors);
        return newErrors;
      });
    },
    [setErrors, setHasErrors]
  );
  const clearErrors = useCallback(
    (...fields) => {
      setErrors((errors2) => {
        const newErrors = Object.keys(errors2).reduce(
          (carry, field) => ({
            ...carry,
            ...fields.length > 0 && !fields.includes(field) ? { [field]: errors2[field] } : {}
          }),
          {}
        );
        setHasErrors(Object.keys(newErrors).length > 0);
        if (validatorRef.current) {
          if (fields.length === 0) {
            validatorRef.current.setErrors({});
          } else {
            fields.forEach(validatorRef.current.forgetError);
          }
        }
        return newErrors;
      });
    },
    [setErrors, setHasErrors]
  );
  const resetAndClearErrors = useCallback(
    (...fields) => {
      reset(...fields);
      clearErrors(...fields);
    },
    [reset, clearErrors]
  );
  const createSubmitMethod = (method) => (url, options = {}) => {
    submit(method, url, options);
  };
  const getMethod = useCallback(createSubmitMethod("get"), [submit]);
  const post = useCallback(createSubmitMethod("post"), [submit]);
  const put = useCallback(createSubmitMethod("put"), [submit]);
  const patch = useCallback(createSubmitMethod("patch"), [submit]);
  const deleteMethod = useCallback(createSubmitMethod("delete"), [submit]);
  const cancel = useCallback(() => {
    if (cancelToken.current) {
      cancelToken.current.cancel();
    }
  }, []);
  const transformFunction = useCallback((callback) => {
    transform.current = callback;
  }, []);
  const form = {
    data,
    setData: setDataFunction,
    isDirty,
    errors,
    hasErrors,
    processing,
    progress: progress2,
    wasSuccessful,
    recentlySuccessful,
    transform: transformFunction,
    setDefaults: setDefaultsFunction,
    reset,
    setError,
    clearErrors,
    resetAndClearErrors,
    submit,
    get: getMethod,
    post,
    put,
    patch,
    delete: deleteMethod,
    cancel,
    dontRemember: (...keys) => {
      excludeKeysRef.current = keys;
      return form;
    }
  };
  const tap = (value, callback) => {
    callback(value);
    return value;
  };
  const valid = useCallback(
    (field) => validFields.includes(field),
    [validFields]
  );
  const invalid = useCallback((field) => field in errors, [errors]);
  const touched = useCallback(
    (field) => typeof field === "string" ? touchedFields.includes(field) : touchedFields.length > 0,
    [touchedFields]
  );
  const validate = (field, config3) => {
    if (typeof field === "object" && !("target" in field)) {
      config3 = field;
      field = void 0;
    }
    if (field === void 0) {
      validatorRef.current.validate(config3);
    } else {
      const fieldName = resolveName(field);
      const currentData = dataRef.current;
      const transformedData = transform.current(currentData);
      validatorRef.current.validate(fieldName, get(transformedData, fieldName), config3);
    }
    return form;
  };
  const withPrecognition = (...args2) => {
    precognitionEndpoint.current = UseFormUtils.createWayfinderCallback(...args2);
    if (!validatorRef.current) {
      const validator = createValidator((client) => {
        const { method, url } = precognitionEndpoint.current();
        const currentData = dataRef.current;
        const transformedData = transform.current(currentData);
        return client[method](url, transformedData);
      }, cloneDeep(defaults));
      validatorRef.current = validator;
      validator.on("validatingChanged", () => {
        setValidating(validator.validating());
      }).on("validatedChanged", () => {
        setValidFields(validator.valid());
      }).on("touchedChanged", () => {
        setTouchedFields(validator.touched());
      }).on("errorsChanged", () => {
        const validationErrors = withAllErrors.current ?? config.get("form.withAllErrors") ? validator.errors() : toSimpleValidationErrors(validator.errors());
        setErrors(validationErrors);
        setHasErrors(Object.keys(validationErrors).length > 0);
        setValidFields(validator.valid());
      });
    }
    const precognitiveForm = Object.assign(form, {
      validating,
      validator: () => validatorRef.current,
      valid,
      invalid,
      touched,
      withoutFileValidation: () => tap(precognitiveForm, () => validatorRef.current?.withoutFileValidation()),
      touch: (field, ...fields) => {
        if (Array.isArray(field)) {
          validatorRef.current?.touch(field);
        } else if (typeof field === "string") {
          validatorRef.current?.touch([field, ...fields]);
        } else {
          validatorRef.current?.touch(field);
        }
        return precognitiveForm;
      },
      withAllErrors: () => tap(precognitiveForm, () => withAllErrors.current = true),
      setValidationTimeout: (duration) => tap(precognitiveForm, () => validatorRef.current?.setTimeout(duration)),
      validateFiles: () => tap(precognitiveForm, () => validatorRef.current?.validateFiles()),
      validate,
      setErrors: (errors2) => tap(precognitiveForm, () => form.setError(errors2)),
      forgetError: (field) => tap(
        precognitiveForm,
        () => form.clearErrors(resolveName(field))
      )
    });
    return precognitiveForm;
  };
  form.withPrecognition = withPrecognition;
  return precognitionEndpoint.current ? form.withPrecognition(precognitionEndpoint.current) : form;
}

// src/Form.ts
var deferStateUpdate = (callback) => {
  typeof React3.startTransition === "function" ? React3.startTransition(callback) : setTimeout(callback, 0);
};
var noop = () => void 0;
var FormContext = createContext3(void 0);
var Form = forwardRef(
  ({
    action = "",
    method = "get",
    headers = {},
    queryStringArrayFormat = "brackets",
    errorBag = null,
    showProgress = true,
    transform = (data) => data,
    options = {},
    onStart = noop,
    onProgress = noop,
    onFinish = noop,
    onBefore = noop,
    onCancel = noop,
    onSuccess = noop,
    onError = noop,
    onCancelToken = noop,
    onSubmitComplete = noop,
    disableWhileProcessing = false,
    resetOnError = false,
    resetOnSuccess = false,
    setDefaultsOnSuccess = false,
    invalidateCacheTags = [],
    validateFiles = false,
    validationTimeout = 1500,
    withAllErrors = null,
    children,
    ...props
  }, ref) => {
    const getTransformedData = () => {
      const [_url, data] = getUrlAndData();
      return transform(data);
    };
    const form = useForm({}).withPrecognition(
      () => resolvedMethod,
      () => getUrlAndData()[0]
    ).setValidationTimeout(validationTimeout);
    if (validateFiles) {
      form.validateFiles();
    }
    if (withAllErrors ?? config2.get("form.withAllErrors")) {
      form.withAllErrors();
    }
    form.transform(getTransformedData);
    const formElement = useRef2(void 0);
    const resolvedMethod = useMemo4(() => {
      return isUrlMethodPair(action) ? action.method : method.toLowerCase();
    }, [action, method]);
    const [isDirty, setIsDirty] = useState5(false);
    const defaultData = useRef2(new FormData());
    const getFormData = (submitter) => new FormData(formElement.current, submitter);
    const getData = (submitter) => formDataToObject(getFormData(submitter));
    const getUrlAndData = (submitter) => {
      return mergeDataIntoQueryString(
        resolvedMethod,
        isUrlMethodPair(action) ? action.url : action,
        getData(submitter),
        queryStringArrayFormat
      );
    };
    const updateDirtyState = (event) => {
      if (event.type === "reset" && event.detail?.[FormComponentResetSymbol]) {
        event.preventDefault();
      }
      deferStateUpdate(
        () => setIsDirty(event.type === "reset" ? false : !isEqual2(getData(), formDataToObject(defaultData.current)))
      );
    };
    const clearErrors = (...names) => {
      form.clearErrors(...names);
      return form;
    };
    useEffect6(() => {
      defaultData.current = getFormData();
      form.setDefaults(getData());
      const formEvents = ["input", "change", "reset"];
      formEvents.forEach((e) => formElement.current.addEventListener(e, updateDirtyState));
      return () => {
        formEvents.forEach((e) => formElement.current?.removeEventListener(e, updateDirtyState));
      };
    }, []);
    useEffect6(() => {
      form.setValidationTimeout(validationTimeout);
    }, [validationTimeout]);
    useEffect6(() => {
      if (validateFiles) {
        form.validateFiles();
      } else {
        form.withoutFileValidation();
      }
    }, [validateFiles]);
    const reset = (...fields) => {
      if (formElement.current) {
        resetFormFields(formElement.current, defaultData.current, fields);
      }
      form.reset(...fields);
    };
    const resetAndClearErrors = (...fields) => {
      clearErrors(...fields);
      reset(...fields);
    };
    const maybeReset = (resetOption) => {
      if (!resetOption) {
        return;
      }
      if (resetOption === true) {
        reset();
      } else if (resetOption.length > 0) {
        reset(...resetOption);
      }
    };
    const submit = (submitter) => {
      const [url, data] = getUrlAndData(submitter);
      const formTarget = submitter?.getAttribute("formtarget");
      if (formTarget === "_blank" && resolvedMethod === "get") {
        window.open(url, "_blank");
        return;
      }
      const submitOptions = {
        headers,
        queryStringArrayFormat,
        errorBag,
        showProgress,
        invalidateCacheTags,
        onCancelToken,
        onBefore,
        onStart,
        onProgress,
        onFinish,
        onCancel,
        onSuccess: (...args) => {
          onSuccess(...args);
          onSubmitComplete({
            reset,
            defaults
          });
          maybeReset(resetOnSuccess);
          if (setDefaultsOnSuccess === true) {
            defaults();
          }
        },
        onError(...args) {
          onError(...args);
          maybeReset(resetOnError);
        },
        ...options
      };
      form.transform(() => transform(data));
      form.submit(resolvedMethod, url, submitOptions);
      form.transform(getTransformedData);
    };
    const defaults = () => {
      defaultData.current = getFormData();
      setIsDirty(false);
    };
    const exposed = {
      errors: form.errors,
      hasErrors: form.hasErrors,
      processing: form.processing,
      progress: form.progress,
      wasSuccessful: form.wasSuccessful,
      recentlySuccessful: form.recentlySuccessful,
      isDirty,
      clearErrors,
      resetAndClearErrors,
      setError: form.setError,
      reset,
      submit,
      defaults,
      getData,
      getFormData,
      // Precognition
      validator: () => form.validator(),
      validating: form.validating,
      valid: form.valid,
      invalid: form.invalid,
      validate: (field, config3) => form.validate(...UseFormUtils2.mergeHeadersForValidation(field, config3, headers)),
      touch: form.touch,
      touched: form.touched
    };
    useImperativeHandle(ref, () => exposed, [form, isDirty, submit]);
    const formNode = createElement3(
      "form",
      {
        ...props,
        ref: formElement,
        action: isUrlMethodPair(action) ? action.url : action,
        method: resolvedMethod,
        onSubmit: (event) => {
          event.preventDefault();
          submit(event.nativeEvent.submitter);
        },
        // React 19 supports passing a boolean to the `inert` attribute, but shows
        // a warning when receiving a string. Earlier versions require the string 'true'.
        // See: https://github.com/inertiajs/inertia/pull/2536
        inert: disableWhileProcessing && form.processing && (isReact19 ? true : "true")
      },
      typeof children === "function" ? children(exposed) : children
    );
    return createElement3(FormContext.Provider, { value: exposed }, formNode);
  }
);
Form.displayName = "InertiaForm";
function useFormContext() {
  return useContext(FormContext);
}
var Form_default = Form;

// src/Head.ts
import { escape } from "lodash-es";
import React4, { useContext as useContext2, useEffect as useEffect7, useMemo as useMemo5 } from "react";
var Head = function({ children, title }) {
  const headManager = useContext2(HeadContext_default);
  const provider = useMemo5(() => headManager.createProvider(), [headManager]);
  const isServer = typeof window === "undefined";
  useEffect7(() => {
    provider.reconnect();
    provider.update(renderNodes(children));
    return () => {
      provider.disconnect();
    };
  }, [provider, children, title]);
  function isUnaryTag(node) {
    return typeof node.type === "string" && [
      "area",
      "base",
      "br",
      "col",
      "embed",
      "hr",
      "img",
      "input",
      "keygen",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr"
    ].indexOf(node.type) > -1;
  }
  function renderTagStart(node) {
    const attrs = Object.keys(node.props).reduce((carry, name) => {
      if (["head-key", "children", "dangerouslySetInnerHTML"].includes(name)) {
        return carry;
      }
      const value = String(node.props[name]);
      if (value === "") {
        return carry + ` ${name}`;
      }
      return carry + ` ${name}="${escape(value)}"`;
    }, "");
    return `<${String(node.type)}${attrs}>`;
  }
  function renderTagChildren(node) {
    const { children: children2 } = node.props;
    if (typeof children2 === "string") {
      return children2;
    }
    if (Array.isArray(children2)) {
      return children2.reduce((html, child) => html + renderTag(child), "");
    }
    return "";
  }
  function renderTag(node) {
    let html = renderTagStart(node);
    if (node.props.children) {
      html += renderTagChildren(node);
    }
    if (node.props.dangerouslySetInnerHTML) {
      html += node.props.dangerouslySetInnerHTML.__html;
    }
    if (!isUnaryTag(node)) {
      html += `</${String(node.type)}>`;
    }
    return html;
  }
  function ensureNodeHasInertiaProp(node) {
    return React4.cloneElement(node, {
      [provider.preferredAttribute()]: node.props["head-key"] !== void 0 ? node.props["head-key"] : ""
    });
  }
  function renderNode(node) {
    return renderTag(ensureNodeHasInertiaProp(node));
  }
  function renderNodes(nodes) {
    const elements = React4.Children.toArray(nodes).filter((node) => node).map((node) => renderNode(node));
    if (title && !elements.find((tag) => tag.startsWith("<title"))) {
      elements.push(`<title ${provider.preferredAttribute()}>${title}</title>`);
    }
    return elements;
  }
  if (isServer) {
    provider.update(renderNodes(children));
  }
  return null;
};
var Head_default = Head;

// src/InfiniteScroll.ts
import {
  getScrollableParent,
  useInfiniteScroll
} from "@inertiajs/core";
import React5, {
  createElement as createElement4,
  forwardRef as forwardRef2,
  useCallback as useCallback2,
  useEffect as useEffect8,
  useImperativeHandle as useImperativeHandle2,
  useMemo as useMemo6,
  useRef as useRef3,
  useState as useState6
} from "react";
var resolveHTMLElement = (value, fallback) => {
  if (!value) {
    return fallback;
  }
  if (value && typeof value === "object" && "current" in value) {
    return value.current;
  }
  if (typeof value === "string") {
    return document.querySelector(value);
  }
  return fallback;
};
var renderSlot = (slotContent, slotProps, fallback = null) => {
  if (!slotContent) {
    return fallback;
  }
  return typeof slotContent === "function" ? slotContent(slotProps) : slotContent;
};
var InfiniteScroll = forwardRef2(
  ({
    data,
    buffer = 0,
    as = "div",
    manual = false,
    manualAfter = 0,
    preserveUrl = false,
    reverse = false,
    autoScroll,
    children,
    startElement,
    endElement,
    itemsElement,
    previous,
    next,
    loading,
    onlyNext = false,
    onlyPrevious = false,
    ...props
  }, ref) => {
    const [startElementFromRef, setStartElementFromRef] = useState6(null);
    const startElementRef = useCallback2((node) => setStartElementFromRef(node), []);
    const [endElementFromRef, setEndElementFromRef] = useState6(null);
    const endElementRef = useCallback2((node) => setEndElementFromRef(node), []);
    const [itemsElementFromRef, setItemsElementFromRef] = useState6(null);
    const itemsElementRef = useCallback2((node) => setItemsElementFromRef(node), []);
    const [loadingPrevious, setLoadingPrevious] = useState6(false);
    const [loadingNext, setLoadingNext] = useState6(false);
    const [requestCount, setRequestCount] = useState6(0);
    const [hasPreviousPage, setHasPreviousPage] = useState6(false);
    const [hasNextPage, setHasNextPage] = useState6(false);
    const [resolvedStartElement, setResolvedStartElement] = useState6(null);
    const [resolvedEndElement, setResolvedEndElement] = useState6(null);
    const [resolvedItemsElement, setResolvedItemsElement] = useState6(null);
    useEffect8(() => {
      const element = startElement ? resolveHTMLElement(startElement, startElementFromRef) : startElementFromRef;
      setResolvedStartElement(element);
    }, [startElement, startElementFromRef]);
    useEffect8(() => {
      const element = endElement ? resolveHTMLElement(endElement, endElementFromRef) : endElementFromRef;
      setResolvedEndElement(element);
    }, [endElement, endElementFromRef]);
    useEffect8(() => {
      const element = itemsElement ? resolveHTMLElement(itemsElement, itemsElementFromRef) : itemsElementFromRef;
      setResolvedItemsElement(element);
    }, [itemsElement, itemsElementFromRef]);
    const scrollableParent = useMemo6(() => getScrollableParent(resolvedItemsElement), [resolvedItemsElement]);
    const callbackPropsRef = useRef3({
      buffer,
      onlyNext,
      onlyPrevious,
      reverse,
      preserveUrl
    });
    callbackPropsRef.current = {
      buffer,
      onlyNext,
      onlyPrevious,
      reverse,
      preserveUrl
    };
    const [infiniteScroll, setInfiniteScroll] = useState6(null);
    const dataManager = useMemo6(() => infiniteScroll?.dataManager, [infiniteScroll]);
    const elementManager = useMemo6(() => infiniteScroll?.elementManager, [infiniteScroll]);
    const scrollToBottom = useCallback2(() => {
      if (scrollableParent) {
        scrollableParent.scrollTo({
          top: scrollableParent.scrollHeight,
          behavior: "instant"
        });
      } else {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "instant"
        });
      }
    }, [scrollableParent]);
    useEffect8(() => {
      if (!resolvedItemsElement) {
        return;
      }
      function syncStateFromDataManager() {
        setRequestCount(infiniteScrollInstance.dataManager.getRequestCount());
        setHasPreviousPage(infiniteScrollInstance.dataManager.hasPrevious());
        setHasNextPage(infiniteScrollInstance.dataManager.hasNext());
      }
      const infiniteScrollInstance = useInfiniteScroll({
        // Data
        getPropName: () => data,
        inReverseMode: () => callbackPropsRef.current.reverse,
        shouldFetchNext: () => !callbackPropsRef.current.onlyPrevious,
        shouldFetchPrevious: () => !callbackPropsRef.current.onlyNext,
        shouldPreserveUrl: () => callbackPropsRef.current.preserveUrl,
        // Elements
        getTriggerMargin: () => callbackPropsRef.current.buffer,
        getStartElement: () => resolvedStartElement,
        getEndElement: () => resolvedEndElement,
        getItemsElement: () => resolvedItemsElement,
        getScrollableParent: () => scrollableParent,
        // Callbacks
        onBeforePreviousRequest: () => setLoadingPrevious(true),
        onBeforeNextRequest: () => setLoadingNext(true),
        onCompletePreviousRequest: () => {
          setLoadingPrevious(false);
          syncStateFromDataManager();
        },
        onCompleteNextRequest: () => {
          setLoadingNext(false);
          syncStateFromDataManager();
        },
        onDataReset: syncStateFromDataManager
      });
      setInfiniteScroll(infiniteScrollInstance);
      const { dataManager: dataManager2, elementManager: elementManager2 } = infiniteScrollInstance;
      syncStateFromDataManager();
      elementManager2.setupObservers();
      elementManager2.processServerLoadedElements(dataManager2.getLastLoadedPage());
      if (autoLoad) {
        elementManager2.enableTriggers();
      }
      return () => {
        infiniteScrollInstance.flush();
        setInfiniteScroll(null);
      };
    }, [data, resolvedItemsElement, resolvedStartElement, resolvedEndElement, scrollableParent]);
    const manualMode = useMemo6(
      () => manual || manualAfter > 0 && requestCount >= manualAfter,
      [manual, manualAfter, requestCount]
    );
    const autoLoad = useMemo6(() => !manualMode, [manualMode]);
    useEffect8(() => {
      autoLoad ? elementManager?.enableTriggers() : elementManager?.disableTriggers();
    }, [autoLoad, onlyNext, onlyPrevious, resolvedStartElement, resolvedEndElement]);
    useEffect8(() => {
      const shouldAutoScroll = autoScroll !== void 0 ? autoScroll : reverse;
      if (shouldAutoScroll) {
        scrollToBottom();
      }
    }, [scrollableParent]);
    useImperativeHandle2(
      ref,
      () => ({
        fetchNext: dataManager?.fetchNext || (() => {
        }),
        fetchPrevious: dataManager?.fetchPrevious || (() => {
        }),
        hasPrevious: dataManager?.hasPrevious || (() => false),
        hasNext: dataManager?.hasNext || (() => false)
      }),
      [dataManager]
    );
    const headerAutoMode = autoLoad && !onlyNext;
    const footerAutoMode = autoLoad && !onlyPrevious;
    const sharedExposed = {
      loadingPrevious,
      loadingNext,
      hasPrevious: hasPreviousPage,
      hasNext: hasNextPage
    };
    const exposedPrevious = {
      loading: loadingPrevious,
      fetch: dataManager?.fetchPrevious ?? (() => {
      }),
      autoMode: headerAutoMode,
      manualMode: !headerAutoMode,
      hasMore: hasPreviousPage,
      ...sharedExposed
    };
    const exposedNext = {
      loading: loadingNext,
      fetch: dataManager?.fetchNext ?? (() => {
      }),
      autoMode: footerAutoMode,
      manualMode: !footerAutoMode,
      hasMore: hasNextPage,
      ...sharedExposed
    };
    const exposedSlot = {
      loading: loadingPrevious || loadingNext,
      loadingPrevious,
      loadingNext
    };
    const renderElements = [];
    if (!startElement) {
      renderElements.push(
        createElement4(
          "div",
          { ref: startElementRef },
          // Render previous slot or fallback to loading indicator
          renderSlot(previous, exposedPrevious, loadingPrevious ? renderSlot(loading, exposedPrevious) : null)
        )
      );
    }
    renderElements.push(
      createElement4(
        as,
        { ...props, ref: itemsElementRef },
        typeof children === "function" ? children(exposedSlot) : children
      )
    );
    if (!endElement) {
      renderElements.push(
        createElement4(
          "div",
          { ref: endElementRef },
          // Render next slot or fallback to loading indicator
          renderSlot(next, exposedNext, loadingNext ? renderSlot(loading, exposedNext) : null)
        )
      );
    }
    return createElement4(React5.Fragment, {}, ...reverse ? [...renderElements].reverse() : renderElements);
  }
);
InfiniteScroll.displayName = "InertiaInfiniteScroll";
var InfiniteScroll_default = InfiniteScroll;

// src/Link.ts
import {
  isUrlMethodPair as isUrlMethodPair2,
  mergeDataIntoQueryString as mergeDataIntoQueryString2,
  router as router6,
  shouldIntercept,
  shouldNavigate
} from "@inertiajs/core";
import { createElement as createElement5, forwardRef as forwardRef3, useEffect as useEffect9, useMemo as useMemo7, useRef as useRef4, useState as useState7 } from "react";
var noop2 = () => void 0;
var Link = forwardRef3(
  ({
    children,
    as = "a",
    data = {},
    href = "",
    method = "get",
    preserveScroll = false,
    preserveState = null,
    preserveUrl = false,
    replace = false,
    only = [],
    except = [],
    headers = {},
    queryStringArrayFormat = "brackets",
    async = false,
    onClick = noop2,
    onCancelToken = noop2,
    onBefore = noop2,
    onStart = noop2,
    onProgress = noop2,
    onFinish = noop2,
    onCancel = noop2,
    onSuccess = noop2,
    onError = noop2,
    onPrefetching = noop2,
    onPrefetched = noop2,
    prefetch = false,
    cacheFor = 0,
    cacheTags = [],
    viewTransition = false,
    ...props
  }, ref) => {
    const [inFlightCount, setInFlightCount] = useState7(0);
    const hoverTimeout = useRef4(void 0);
    const _method = useMemo7(() => {
      return isUrlMethodPair2(href) ? href.method : method.toLowerCase();
    }, [href, method]);
    const _as = useMemo7(() => {
      if (typeof as !== "string" || as.toLowerCase() !== "a") {
        return as;
      }
      return _method !== "get" ? "button" : as.toLowerCase();
    }, [as, _method]);
    const mergeDataArray = useMemo7(
      () => mergeDataIntoQueryString2(_method, isUrlMethodPair2(href) ? href.url : href, data, queryStringArrayFormat),
      [href, _method, data, queryStringArrayFormat]
    );
    const url = useMemo7(() => mergeDataArray[0], [mergeDataArray]);
    const _data = useMemo7(() => mergeDataArray[1], [mergeDataArray]);
    const baseParams = useMemo7(
      () => ({
        data: _data,
        method: _method,
        preserveScroll,
        preserveState: preserveState ?? _method !== "get",
        preserveUrl,
        replace,
        only,
        except,
        headers,
        async
      }),
      [_data, _method, preserveScroll, preserveState, preserveUrl, replace, only, except, headers, async]
    );
    const visitParams = useMemo7(
      () => ({
        ...baseParams,
        viewTransition,
        onCancelToken,
        onBefore,
        onStart(visit) {
          setInFlightCount((count) => count + 1);
          onStart(visit);
        },
        onProgress,
        onFinish(visit) {
          setInFlightCount((count) => count - 1);
          onFinish(visit);
        },
        onCancel,
        onSuccess,
        onError
      }),
      [
        baseParams,
        viewTransition,
        onCancelToken,
        onBefore,
        onStart,
        onProgress,
        onFinish,
        onCancel,
        onSuccess,
        onError
      ]
    );
    const prefetchModes = useMemo7(
      () => {
        if (prefetch === true) {
          return ["hover"];
        }
        if (prefetch === false) {
          return [];
        }
        if (Array.isArray(prefetch)) {
          return prefetch;
        }
        return [prefetch];
      },
      Array.isArray(prefetch) ? prefetch : [prefetch]
    );
    const cacheForValue = useMemo7(() => {
      if (cacheFor !== 0) {
        return cacheFor;
      }
      if (prefetchModes.length === 1 && prefetchModes[0] === "click") {
        return 0;
      }
      return config.get("prefetch.cacheFor");
    }, [cacheFor, prefetchModes]);
    const doPrefetch = useMemo7(() => {
      return () => {
        router6.prefetch(
          url,
          {
            ...baseParams,
            onPrefetching,
            onPrefetched
          },
          { cacheFor: cacheForValue, cacheTags }
        );
      };
    }, [url, baseParams, onPrefetching, onPrefetched, cacheForValue, cacheTags]);
    useEffect9(() => {
      return () => {
        clearTimeout(hoverTimeout.current);
      };
    }, []);
    useEffect9(() => {
      if (prefetchModes.includes("mount")) {
        setTimeout(() => doPrefetch());
      }
    }, prefetchModes);
    const regularEvents = {
      onClick: (event) => {
        onClick(event);
        if (shouldIntercept(event)) {
          event.preventDefault();
          router6.visit(url, visitParams);
        }
      }
    };
    const prefetchHoverEvents = {
      onMouseEnter: () => {
        hoverTimeout.current = window.setTimeout(() => {
          doPrefetch();
        }, config.get("prefetch.hoverDelay"));
      },
      onMouseLeave: () => {
        clearTimeout(hoverTimeout.current);
      },
      onClick: regularEvents.onClick
    };
    const prefetchClickEvents = {
      onMouseDown: (event) => {
        if (shouldIntercept(event)) {
          event.preventDefault();
          doPrefetch();
        }
      },
      onKeyDown: (event) => {
        if (shouldNavigate(event)) {
          event.preventDefault();
          doPrefetch();
        }
      },
      onMouseUp: (event) => {
        if (shouldIntercept(event)) {
          event.preventDefault();
          router6.visit(url, visitParams);
        }
      },
      onKeyUp: (event) => {
        if (shouldNavigate(event)) {
          event.preventDefault();
          router6.visit(url, visitParams);
        }
      },
      onClick: (event) => {
        onClick(event);
        if (shouldIntercept(event)) {
          event.preventDefault();
        }
      }
    };
    const elProps = useMemo7(() => {
      if (_as === "button") {
        return { type: "button" };
      }
      if (_as === "a" || typeof _as !== "string") {
        return { href: url };
      }
      return {};
    }, [_as, url]);
    return createElement5(
      _as,
      {
        ...props,
        ...elProps,
        ref,
        ...(() => {
          if (prefetchModes.includes("hover")) {
            return prefetchHoverEvents;
          }
          if (prefetchModes.includes("click")) {
            return prefetchClickEvents;
          }
          return regularEvents;
        })(),
        "data-loading": inFlightCount > 0 ? "" : void 0
      },
      children
    );
  }
);
Link.displayName = "InertiaLink";
var Link_default = Link;

// src/usePoll.ts
import { router as router7 } from "@inertiajs/core";
import { useEffect as useEffect10, useRef as useRef5 } from "react";
function usePoll(interval, requestOptions = {}, options = {
  keepAlive: false,
  autoStart: true
}) {
  const pollRef = useRef5(
    router7.poll(interval, requestOptions, {
      ...options,
      autoStart: false
    })
  );
  useEffect10(() => {
    if (options.autoStart ?? true) {
      pollRef.current.start();
    }
    return () => pollRef.current.stop();
  }, []);
  return {
    stop: pollRef.current.stop,
    start: pollRef.current.start
  };
}

// src/usePrefetch.ts
import { router as router8 } from "@inertiajs/core";
import { useEffect as useEffect11, useState as useState8 } from "react";
function usePrefetch(options = {}) {
  const cached = typeof window === "undefined" ? null : router8.getCached(window.location.pathname, options);
  const inFlight = typeof window === "undefined" ? null : router8.getPrefetching(window.location.pathname, options);
  const [lastUpdatedAt, setLastUpdatedAt] = useState8(cached?.staleTimestamp || null);
  const [isPrefetching, setIsPrefetching] = useState8(inFlight !== null);
  const [isPrefetched, setIsPrefetched] = useState8(cached !== null);
  useEffect11(() => {
    const onPrefetchingListener = router8.on("prefetching", (e) => {
      if (e.detail.visit.url.pathname === window.location.pathname) {
        setIsPrefetching(true);
      }
    });
    const onPrefetchedListener = router8.on("prefetched", (e) => {
      if (e.detail.visit.url.pathname === window.location.pathname) {
        setIsPrefetching(false);
        setIsPrefetched(true);
        setLastUpdatedAt(e.detail.fetchedAt);
      }
    });
    return () => {
      onPrefetchedListener();
      onPrefetchingListener();
    };
  }, []);
  return {
    lastUpdatedAt,
    isPrefetching,
    isPrefetched,
    flush: () => router8.flush(window.location.pathname, options)
  };
}

// src/WhenVisible.ts
import { router as router9 } from "@inertiajs/core";
import { createElement as createElement6, useCallback as useCallback3, useEffect as useEffect12, useMemo as useMemo8, useRef as useRef6, useState as useState9 } from "react";
var WhenVisible = ({ children, data, params, buffer, as, always, fallback }) => {
  always = always ?? false;
  as = as ?? "div";
  fallback = fallback ?? null;
  const pageProps = usePage().props;
  const keys = useMemo8(() => data ? Array.isArray(data) ? data : [data] : [], [data]);
  const [loaded, setLoaded] = useState9(() => keys.length > 0 && keys.every((key) => pageProps[key] !== void 0));
  const [isFetching, setIsFetching] = useState9(false);
  const fetching = useRef6(false);
  const ref = useRef6(null);
  const observer = useRef6(null);
  const getReloadParamsRef = useRef6(() => ({}));
  useEffect12(() => {
    if (keys.length > 0) {
      setLoaded(keys.every((key) => pageProps[key] !== void 0));
    }
  }, [pageProps, keys]);
  const getReloadParams = useCallback3(() => {
    const reloadParams = { ...params };
    if (data) {
      reloadParams.only = Array.isArray(data) ? data : [data];
    }
    return reloadParams;
  }, [params, data]);
  getReloadParamsRef.current = getReloadParams;
  const registerObserver = () => {
    observer.current?.disconnect();
    observer.current = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) {
          return;
        }
        if (fetching.current) {
          return;
        }
        if (!always && loaded) {
          return;
        }
        fetching.current = true;
        setIsFetching(true);
        const reloadParams = getReloadParamsRef.current();
        router9.reload({
          ...reloadParams,
          onStart: (e) => {
            fetching.current = true;
            setIsFetching(true);
            reloadParams.onStart?.(e);
          },
          onFinish: (e) => {
            setLoaded(true);
            fetching.current = false;
            setIsFetching(false);
            reloadParams.onFinish?.(e);
            if (!always) {
              observer.current?.disconnect();
            }
          }
        });
      },
      {
        rootMargin: `${buffer || 0}px`
      }
    );
    observer.current.observe(ref.current);
  };
  useEffect12(() => {
    if (!ref.current) {
      return;
    }
    if (loaded && !always) {
      return;
    }
    registerObserver();
    return () => {
      observer.current?.disconnect();
    };
  }, [always, loaded, buffer]);
  const resolveChildren = () => typeof children === "function" ? children({ fetching: isFetching }) : children;
  const resolveFallback = () => typeof fallback === "function" ? fallback() : fallback;
  if (always || !loaded) {
    return createElement6(
      as,
      {
        props: null,
        ref
      },
      loaded ? resolveChildren() : resolveFallback()
    );
  }
  return loaded ? resolveChildren() : null;
};
WhenVisible.displayName = "InertiaWhenVisible";
var WhenVisible_default = WhenVisible;

// src/index.ts
var progress = Progress2;
var router3 = Router;
var config = coreConfig.extend();
export {
  App,
  Deferred_default as Deferred,
  Form_default as Form,
  Head_default as Head,
  InfiniteScroll_default as InfiniteScroll,
  Link_default as Link,
  WhenVisible_default as WhenVisible,
  config,
  createInertiaApp,
  progress,
  router3 as router,
  useForm,
  useFormContext,
  usePage,
  usePoll,
  usePrefetch,
  useRemember
};
//# sourceMappingURL=index.esm.js.map
