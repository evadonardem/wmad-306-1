"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  App: () => App,
  Deferred: () => Deferred_default,
  Form: () => Form_default,
  Head: () => Head_default,
  InfiniteScroll: () => InfiniteScroll_default,
  Link: () => Link_default,
  WhenVisible: () => WhenVisible_default,
  config: () => config,
  createInertiaApp: () => createInertiaApp,
  progress: () => progress,
  router: () => router3,
  useForm: () => useForm,
  useFormContext: () => useFormContext,
  usePage: () => usePage,
  usePoll: () => usePoll,
  usePrefetch: () => usePrefetch,
  useRemember: () => useRemember
});
module.exports = __toCommonJS(index_exports);
var import_core11 = require("@inertiajs/core");

// src/App.ts
var import_core = require("@inertiajs/core");
var import_react3 = require("react");
var import_react_dom = require("react-dom");

// src/HeadContext.ts
var import_react = require("react");
var headContext = (0, import_react.createContext)(null);
headContext.displayName = "InertiaHeadContext";
var HeadContext_default = headContext;

// src/PageContext.ts
var import_react2 = require("react");
var pageContext = (0, import_react2.createContext)(null);
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
  const [current, setCurrent] = (0, import_react3.useState)({
    component: initialComponent || null,
    page: { ...initialPage, flash: initialPage.flash ?? {} },
    key: null
  });
  const headManager = (0, import_react3.useMemo)(() => {
    return (0, import_core.createHeadManager)(
      typeof window === "undefined",
      titleCallback || ((title) => title),
      onHeadUpdate || (() => {
      })
    );
  }, []);
  if (!routerIsInitialized) {
    import_core.router.init({
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
  (0, import_react3.useEffect)(() => {
    swapComponent = async ({ component, page, preserveState }) => {
      if (currentIsInitialPage) {
        currentIsInitialPage = false;
        return;
      }
      (0, import_react_dom.flushSync)(
        () => setCurrent((current2) => ({
          component,
          page,
          key: preserveState ? current2.key : Date.now()
        }))
      );
    };
    import_core.router.on("navigate", () => headManager.forceUpdate());
  }, []);
  if (!current.component) {
    return (0, import_react3.createElement)(
      HeadContext_default.Provider,
      { value: headManager },
      (0, import_react3.createElement)(PageContext_default.Provider, { value: current.page }, null)
    );
  }
  const renderChildren = children || (({ Component, props, key }) => {
    const child = (0, import_react3.createElement)(Component, { key, ...props });
    if (typeof Component.layout === "function") {
      return Component.layout(child);
    }
    if (Array.isArray(Component.layout)) {
      return Component.layout.concat(child).reverse().reduce((children2, Layout) => (0, import_react3.createElement)(Layout, { children: children2, ...props }));
    }
    return child;
  });
  return (0, import_react3.createElement)(
    HeadContext_default.Provider,
    { value: headManager },
    (0, import_react3.createElement)(
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
var import_core2 = require("@inertiajs/core");
var import_react4 = require("react");
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
  const initialPage = page || (0, import_core2.getInitialPageFromDOM)(id, useScriptElementForInitialPage);
  const resolveComponent = (name) => Promise.resolve(resolve(name)).then((module2) => module2.default || module2);
  let head = [];
  const reactApp = await Promise.all([
    resolveComponent(initialPage.component),
    import_core2.router.decryptHistory().catch(() => {
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
    (0, import_core2.setupProgress)(progress2);
  }
  if (isServer && render) {
    const element = () => {
      if (!useScriptElementForInitialPage) {
        return (0, import_react4.createElement)(
          "div",
          {
            id,
            "data-page": JSON.stringify(initialPage)
          },
          reactApp
        );
      }
      return (0, import_react4.createElement)(
        import_react4.Fragment,
        null,
        (0, import_react4.createElement)("script", {
          "data-page": id,
          type: "application/json",
          dangerouslySetInnerHTML: { __html: JSON.stringify(initialPage).replace(/\//g, "\\/") }
        }),
        (0, import_react4.createElement)("div", { id }, reactApp)
      );
    };
    const body = await render(element());
    return { head, body };
  }
}

// src/Deferred.ts
var import_react8 = require("react");

// src/usePage.ts
var import_react6 = __toESM(require("react"), 1);

// src/react.ts
var import_react5 = __toESM(require("react"), 1);
function useIsomorphicLayoutEffect(effect, deps) {
  typeof window === "undefined" ? (0, import_react5.useEffect)(effect, deps) : (0, import_react5.useLayoutEffect)(effect, deps);
}
var isReact19 = typeof import_react5.default.use === "function";

// src/usePage.ts
function usePage() {
  const page = isReact19 ? import_react6.default.use(PageContext_default) : import_react6.default.useContext(PageContext_default);
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
  const [loaded, setLoaded] = (0, import_react8.useState)(false);
  const pageProps = usePage().props;
  const keys = (0, import_react8.useMemo)(() => Array.isArray(data) ? data : [data], [data]);
  (0, import_react8.useEffect)(() => {
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
  (0, import_react8.useEffect)(() => {
    setLoaded(keys.every((key) => pageProps[key] !== void 0));
  }, [pageProps, keys]);
  const propsAreDefined = (0, import_react8.useMemo)(() => keys.every((key) => pageProps[key] !== void 0), [keys, pageProps]);
  if (loaded && propsAreDefined) {
    return typeof children === "function" ? children() : children;
  }
  return typeof fallback === "function" ? fallback() : fallback;
};
Deferred.displayName = "InertiaDeferred";
var Deferred_default = Deferred;

// src/Form.ts
var import_core5 = require("@inertiajs/core");
var import_lodash_es2 = require("lodash-es");
var import_react12 = __toESM(require("react"), 1);

// src/useForm.ts
var import_core4 = require("@inertiajs/core");
var import_laravel_precognition = require("laravel-precognition");
var import_lodash_es = require("lodash-es");
var import_react10 = require("react");

// src/useRemember.ts
var import_core3 = require("@inertiajs/core");
var import_react9 = require("react");
function useRemember(initialState, key, excludeKeysRef) {
  const [state, setState] = (0, import_react9.useState)(() => {
    const restored = import_core3.router.restore(key);
    return restored !== void 0 ? restored : initialState;
  });
  (0, import_react9.useEffect)(() => {
    const keys = excludeKeysRef?.current;
    if (keys && keys.length > 0 && typeof state === "object" && state !== null) {
      const filtered = { ...state };
      keys.forEach((k) => delete filtered[k]);
      import_core3.router.remember(filtered, key);
    } else {
      import_core3.router.remember(state, key);
    }
  }, [state, key]);
  return [state, setState];
}

// src/useForm.ts
function useForm(...args) {
  const isMounted = (0, import_react10.useRef)(false);
  const parsedArgs = import_core4.UseFormUtils.parseUseFormArguments(...args);
  const { rememberKey, data: initialData } = parsedArgs;
  const precognitionEndpoint = (0, import_react10.useRef)(parsedArgs.precognitionEndpoint);
  const [defaults, setDefaults] = (0, import_react10.useState)(
    typeof initialData === "function" ? (0, import_lodash_es.cloneDeep)(initialData()) : (0, import_lodash_es.cloneDeep)(initialData)
  );
  const cancelToken = (0, import_react10.useRef)(null);
  const recentlySuccessfulTimeoutId = (0, import_react10.useRef)(void 0);
  const excludeKeysRef = (0, import_react10.useRef)([]);
  const [data, setData] = rememberKey ? useRemember(defaults, `${rememberKey}:data`, excludeKeysRef) : (0, import_react10.useState)(defaults);
  const [errors, setErrors] = rememberKey ? useRemember({}, `${rememberKey}:errors`) : (0, import_react10.useState)({});
  const [hasErrors, setHasErrors] = (0, import_react10.useState)(false);
  const [processing, setProcessing] = (0, import_react10.useState)(false);
  const [progress2, setProgress] = (0, import_react10.useState)(null);
  const [wasSuccessful, setWasSuccessful] = (0, import_react10.useState)(false);
  const [recentlySuccessful, setRecentlySuccessful] = (0, import_react10.useState)(false);
  const transform = (0, import_react10.useRef)((data2) => data2);
  const isDirty = (0, import_react10.useMemo)(() => !(0, import_lodash_es.isEqual)(data, defaults), [data, defaults]);
  const validatorRef = (0, import_react10.useRef)(null);
  const [validating, setValidating] = (0, import_react10.useState)(false);
  const [touchedFields, setTouchedFields] = (0, import_react10.useState)([]);
  const [validFields, setValidFields] = (0, import_react10.useState)([]);
  const withAllErrors = (0, import_react10.useRef)(null);
  (0, import_react10.useEffect)(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  const setDefaultsCalledInOnSuccess = (0, import_react10.useRef)(false);
  const submit = (0, import_react10.useCallback)(
    (...args2) => {
      const { method, url, options } = import_core4.UseFormUtils.parseSubmitArguments(args2, precognitionEndpoint.current);
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
              setDefaults((0, import_lodash_es.cloneDeep)(data2));
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
        import_core4.router.delete(url, { ..._options, data: transformedData });
      } else {
        import_core4.router[method](url, transformedData, _options);
      }
    },
    [data, setErrors, transform]
  );
  const setDataFunction = (0, import_react10.useCallback)(
    (keyOrData, maybeValue) => {
      if (typeof keyOrData === "string") {
        setData((data2) => (0, import_lodash_es.set)((0, import_lodash_es.cloneDeep)(data2), keyOrData, maybeValue));
      } else if (typeof keyOrData === "function") {
        setData((data2) => keyOrData(data2));
      } else {
        setData(keyOrData);
      }
    },
    [setData]
  );
  const [dataAsDefaults, setDataAsDefaults] = (0, import_react10.useState)(false);
  const dataRef = (0, import_react10.useRef)(data);
  (0, import_react10.useEffect)(() => {
    dataRef.current = data;
  });
  const setDefaultsFunction = (0, import_react10.useCallback)(
    (fieldOrFields, maybeValue) => {
      setDefaultsCalledInOnSuccess.current = true;
      let newDefaults = {};
      if (typeof fieldOrFields === "undefined") {
        newDefaults = { ...dataRef.current };
        setDefaults(dataRef.current);
        setDataAsDefaults(true);
      } else {
        setDefaults((defaults2) => {
          newDefaults = typeof fieldOrFields === "string" ? (0, import_lodash_es.set)((0, import_lodash_es.cloneDeep)(defaults2), fieldOrFields, maybeValue) : Object.assign((0, import_lodash_es.cloneDeep)(defaults2), fieldOrFields);
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
  const reset = (0, import_react10.useCallback)(
    (...fields) => {
      if (fields.length === 0) {
        setData(defaults);
      } else {
        setData(
          (data2) => fields.filter((key) => (0, import_lodash_es.has)(defaults, key)).reduce(
            (carry, key) => {
              return (0, import_lodash_es.set)(carry, key, (0, import_lodash_es.get)(defaults, key));
            },
            { ...data2 }
          )
        );
      }
      validatorRef.current?.reset(...fields);
    },
    [setData, defaults]
  );
  const setError = (0, import_react10.useCallback)(
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
  const clearErrors = (0, import_react10.useCallback)(
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
  const resetAndClearErrors = (0, import_react10.useCallback)(
    (...fields) => {
      reset(...fields);
      clearErrors(...fields);
    },
    [reset, clearErrors]
  );
  const createSubmitMethod = (method) => (url, options = {}) => {
    submit(method, url, options);
  };
  const getMethod = (0, import_react10.useCallback)(createSubmitMethod("get"), [submit]);
  const post = (0, import_react10.useCallback)(createSubmitMethod("post"), [submit]);
  const put = (0, import_react10.useCallback)(createSubmitMethod("put"), [submit]);
  const patch = (0, import_react10.useCallback)(createSubmitMethod("patch"), [submit]);
  const deleteMethod = (0, import_react10.useCallback)(createSubmitMethod("delete"), [submit]);
  const cancel = (0, import_react10.useCallback)(() => {
    if (cancelToken.current) {
      cancelToken.current.cancel();
    }
  }, []);
  const transformFunction = (0, import_react10.useCallback)((callback) => {
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
  const valid = (0, import_react10.useCallback)(
    (field) => validFields.includes(field),
    [validFields]
  );
  const invalid = (0, import_react10.useCallback)((field) => field in errors, [errors]);
  const touched = (0, import_react10.useCallback)(
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
      const fieldName = (0, import_laravel_precognition.resolveName)(field);
      const currentData = dataRef.current;
      const transformedData = transform.current(currentData);
      validatorRef.current.validate(fieldName, (0, import_lodash_es.get)(transformedData, fieldName), config3);
    }
    return form;
  };
  const withPrecognition = (...args2) => {
    precognitionEndpoint.current = import_core4.UseFormUtils.createWayfinderCallback(...args2);
    if (!validatorRef.current) {
      const validator = (0, import_laravel_precognition.createValidator)((client) => {
        const { method, url } = precognitionEndpoint.current();
        const currentData = dataRef.current;
        const transformedData = transform.current(currentData);
        return client[method](url, transformedData);
      }, (0, import_lodash_es.cloneDeep)(defaults));
      validatorRef.current = validator;
      validator.on("validatingChanged", () => {
        setValidating(validator.validating());
      }).on("validatedChanged", () => {
        setValidFields(validator.valid());
      }).on("touchedChanged", () => {
        setTouchedFields(validator.touched());
      }).on("errorsChanged", () => {
        const validationErrors = withAllErrors.current ?? config.get("form.withAllErrors") ? validator.errors() : (0, import_laravel_precognition.toSimpleValidationErrors)(validator.errors());
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
        () => form.clearErrors((0, import_laravel_precognition.resolveName)(field))
      )
    });
    return precognitiveForm;
  };
  form.withPrecognition = withPrecognition;
  return precognitionEndpoint.current ? form.withPrecognition(precognitionEndpoint.current) : form;
}

// src/Form.ts
var deferStateUpdate = (callback) => {
  typeof import_react12.default.startTransition === "function" ? import_react12.default.startTransition(callback) : setTimeout(callback, 0);
};
var noop = () => void 0;
var FormContext = (0, import_react12.createContext)(void 0);
var Form = (0, import_react12.forwardRef)(
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
    if (withAllErrors ?? import_core5.config.get("form.withAllErrors")) {
      form.withAllErrors();
    }
    form.transform(getTransformedData);
    const formElement = (0, import_react12.useRef)(void 0);
    const resolvedMethod = (0, import_react12.useMemo)(() => {
      return (0, import_core5.isUrlMethodPair)(action) ? action.method : method.toLowerCase();
    }, [action, method]);
    const [isDirty, setIsDirty] = (0, import_react12.useState)(false);
    const defaultData = (0, import_react12.useRef)(new FormData());
    const getFormData = (submitter) => new FormData(formElement.current, submitter);
    const getData = (submitter) => (0, import_core5.formDataToObject)(getFormData(submitter));
    const getUrlAndData = (submitter) => {
      return (0, import_core5.mergeDataIntoQueryString)(
        resolvedMethod,
        (0, import_core5.isUrlMethodPair)(action) ? action.url : action,
        getData(submitter),
        queryStringArrayFormat
      );
    };
    const updateDirtyState = (event) => {
      if (event.type === "reset" && event.detail?.[import_core5.FormComponentResetSymbol]) {
        event.preventDefault();
      }
      deferStateUpdate(
        () => setIsDirty(event.type === "reset" ? false : !(0, import_lodash_es2.isEqual)(getData(), (0, import_core5.formDataToObject)(defaultData.current)))
      );
    };
    const clearErrors = (...names) => {
      form.clearErrors(...names);
      return form;
    };
    (0, import_react12.useEffect)(() => {
      defaultData.current = getFormData();
      form.setDefaults(getData());
      const formEvents = ["input", "change", "reset"];
      formEvents.forEach((e) => formElement.current.addEventListener(e, updateDirtyState));
      return () => {
        formEvents.forEach((e) => formElement.current?.removeEventListener(e, updateDirtyState));
      };
    }, []);
    (0, import_react12.useEffect)(() => {
      form.setValidationTimeout(validationTimeout);
    }, [validationTimeout]);
    (0, import_react12.useEffect)(() => {
      if (validateFiles) {
        form.validateFiles();
      } else {
        form.withoutFileValidation();
      }
    }, [validateFiles]);
    const reset = (...fields) => {
      if (formElement.current) {
        (0, import_core5.resetFormFields)(formElement.current, defaultData.current, fields);
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
      validate: (field, config3) => form.validate(...import_core5.UseFormUtils.mergeHeadersForValidation(field, config3, headers)),
      touch: form.touch,
      touched: form.touched
    };
    (0, import_react12.useImperativeHandle)(ref, () => exposed, [form, isDirty, submit]);
    const formNode = (0, import_react12.createElement)(
      "form",
      {
        ...props,
        ref: formElement,
        action: (0, import_core5.isUrlMethodPair)(action) ? action.url : action,
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
    return (0, import_react12.createElement)(FormContext.Provider, { value: exposed }, formNode);
  }
);
Form.displayName = "InertiaForm";
function useFormContext() {
  return (0, import_react12.useContext)(FormContext);
}
var Form_default = Form;

// src/Head.ts
var import_lodash_es3 = require("lodash-es");
var import_react14 = __toESM(require("react"), 1);
var Head = function({ children, title }) {
  const headManager = (0, import_react14.useContext)(HeadContext_default);
  const provider = (0, import_react14.useMemo)(() => headManager.createProvider(), [headManager]);
  const isServer = typeof window === "undefined";
  (0, import_react14.useEffect)(() => {
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
      return carry + ` ${name}="${(0, import_lodash_es3.escape)(value)}"`;
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
    return import_react14.default.cloneElement(node, {
      [provider.preferredAttribute()]: node.props["head-key"] !== void 0 ? node.props["head-key"] : ""
    });
  }
  function renderNode(node) {
    return renderTag(ensureNodeHasInertiaProp(node));
  }
  function renderNodes(nodes) {
    const elements = import_react14.default.Children.toArray(nodes).filter((node) => node).map((node) => renderNode(node));
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
var import_core6 = require("@inertiajs/core");
var import_react15 = __toESM(require("react"), 1);
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
var InfiniteScroll = (0, import_react15.forwardRef)(
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
    const [startElementFromRef, setStartElementFromRef] = (0, import_react15.useState)(null);
    const startElementRef = (0, import_react15.useCallback)((node) => setStartElementFromRef(node), []);
    const [endElementFromRef, setEndElementFromRef] = (0, import_react15.useState)(null);
    const endElementRef = (0, import_react15.useCallback)((node) => setEndElementFromRef(node), []);
    const [itemsElementFromRef, setItemsElementFromRef] = (0, import_react15.useState)(null);
    const itemsElementRef = (0, import_react15.useCallback)((node) => setItemsElementFromRef(node), []);
    const [loadingPrevious, setLoadingPrevious] = (0, import_react15.useState)(false);
    const [loadingNext, setLoadingNext] = (0, import_react15.useState)(false);
    const [requestCount, setRequestCount] = (0, import_react15.useState)(0);
    const [hasPreviousPage, setHasPreviousPage] = (0, import_react15.useState)(false);
    const [hasNextPage, setHasNextPage] = (0, import_react15.useState)(false);
    const [resolvedStartElement, setResolvedStartElement] = (0, import_react15.useState)(null);
    const [resolvedEndElement, setResolvedEndElement] = (0, import_react15.useState)(null);
    const [resolvedItemsElement, setResolvedItemsElement] = (0, import_react15.useState)(null);
    (0, import_react15.useEffect)(() => {
      const element = startElement ? resolveHTMLElement(startElement, startElementFromRef) : startElementFromRef;
      setResolvedStartElement(element);
    }, [startElement, startElementFromRef]);
    (0, import_react15.useEffect)(() => {
      const element = endElement ? resolveHTMLElement(endElement, endElementFromRef) : endElementFromRef;
      setResolvedEndElement(element);
    }, [endElement, endElementFromRef]);
    (0, import_react15.useEffect)(() => {
      const element = itemsElement ? resolveHTMLElement(itemsElement, itemsElementFromRef) : itemsElementFromRef;
      setResolvedItemsElement(element);
    }, [itemsElement, itemsElementFromRef]);
    const scrollableParent = (0, import_react15.useMemo)(() => (0, import_core6.getScrollableParent)(resolvedItemsElement), [resolvedItemsElement]);
    const callbackPropsRef = (0, import_react15.useRef)({
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
    const [infiniteScroll, setInfiniteScroll] = (0, import_react15.useState)(null);
    const dataManager = (0, import_react15.useMemo)(() => infiniteScroll?.dataManager, [infiniteScroll]);
    const elementManager = (0, import_react15.useMemo)(() => infiniteScroll?.elementManager, [infiniteScroll]);
    const scrollToBottom = (0, import_react15.useCallback)(() => {
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
    (0, import_react15.useEffect)(() => {
      if (!resolvedItemsElement) {
        return;
      }
      function syncStateFromDataManager() {
        setRequestCount(infiniteScrollInstance.dataManager.getRequestCount());
        setHasPreviousPage(infiniteScrollInstance.dataManager.hasPrevious());
        setHasNextPage(infiniteScrollInstance.dataManager.hasNext());
      }
      const infiniteScrollInstance = (0, import_core6.useInfiniteScroll)({
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
    const manualMode = (0, import_react15.useMemo)(
      () => manual || manualAfter > 0 && requestCount >= manualAfter,
      [manual, manualAfter, requestCount]
    );
    const autoLoad = (0, import_react15.useMemo)(() => !manualMode, [manualMode]);
    (0, import_react15.useEffect)(() => {
      autoLoad ? elementManager?.enableTriggers() : elementManager?.disableTriggers();
    }, [autoLoad, onlyNext, onlyPrevious, resolvedStartElement, resolvedEndElement]);
    (0, import_react15.useEffect)(() => {
      const shouldAutoScroll = autoScroll !== void 0 ? autoScroll : reverse;
      if (shouldAutoScroll) {
        scrollToBottom();
      }
    }, [scrollableParent]);
    (0, import_react15.useImperativeHandle)(
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
        (0, import_react15.createElement)(
          "div",
          { ref: startElementRef },
          // Render previous slot or fallback to loading indicator
          renderSlot(previous, exposedPrevious, loadingPrevious ? renderSlot(loading, exposedPrevious) : null)
        )
      );
    }
    renderElements.push(
      (0, import_react15.createElement)(
        as,
        { ...props, ref: itemsElementRef },
        typeof children === "function" ? children(exposedSlot) : children
      )
    );
    if (!endElement) {
      renderElements.push(
        (0, import_react15.createElement)(
          "div",
          { ref: endElementRef },
          // Render next slot or fallback to loading indicator
          renderSlot(next, exposedNext, loadingNext ? renderSlot(loading, exposedNext) : null)
        )
      );
    }
    return (0, import_react15.createElement)(import_react15.default.Fragment, {}, ...reverse ? [...renderElements].reverse() : renderElements);
  }
);
InfiniteScroll.displayName = "InertiaInfiniteScroll";
var InfiniteScroll_default = InfiniteScroll;

// src/Link.ts
var import_core7 = require("@inertiajs/core");
var import_react16 = require("react");
var noop2 = () => void 0;
var Link = (0, import_react16.forwardRef)(
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
    const [inFlightCount, setInFlightCount] = (0, import_react16.useState)(0);
    const hoverTimeout = (0, import_react16.useRef)(void 0);
    const _method = (0, import_react16.useMemo)(() => {
      return (0, import_core7.isUrlMethodPair)(href) ? href.method : method.toLowerCase();
    }, [href, method]);
    const _as = (0, import_react16.useMemo)(() => {
      if (typeof as !== "string" || as.toLowerCase() !== "a") {
        return as;
      }
      return _method !== "get" ? "button" : as.toLowerCase();
    }, [as, _method]);
    const mergeDataArray = (0, import_react16.useMemo)(
      () => (0, import_core7.mergeDataIntoQueryString)(_method, (0, import_core7.isUrlMethodPair)(href) ? href.url : href, data, queryStringArrayFormat),
      [href, _method, data, queryStringArrayFormat]
    );
    const url = (0, import_react16.useMemo)(() => mergeDataArray[0], [mergeDataArray]);
    const _data = (0, import_react16.useMemo)(() => mergeDataArray[1], [mergeDataArray]);
    const baseParams = (0, import_react16.useMemo)(
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
    const visitParams = (0, import_react16.useMemo)(
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
    const prefetchModes = (0, import_react16.useMemo)(
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
    const cacheForValue = (0, import_react16.useMemo)(() => {
      if (cacheFor !== 0) {
        return cacheFor;
      }
      if (prefetchModes.length === 1 && prefetchModes[0] === "click") {
        return 0;
      }
      return config.get("prefetch.cacheFor");
    }, [cacheFor, prefetchModes]);
    const doPrefetch = (0, import_react16.useMemo)(() => {
      return () => {
        import_core7.router.prefetch(
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
    (0, import_react16.useEffect)(() => {
      return () => {
        clearTimeout(hoverTimeout.current);
      };
    }, []);
    (0, import_react16.useEffect)(() => {
      if (prefetchModes.includes("mount")) {
        setTimeout(() => doPrefetch());
      }
    }, prefetchModes);
    const regularEvents = {
      onClick: (event) => {
        onClick(event);
        if ((0, import_core7.shouldIntercept)(event)) {
          event.preventDefault();
          import_core7.router.visit(url, visitParams);
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
        if ((0, import_core7.shouldIntercept)(event)) {
          event.preventDefault();
          doPrefetch();
        }
      },
      onKeyDown: (event) => {
        if ((0, import_core7.shouldNavigate)(event)) {
          event.preventDefault();
          doPrefetch();
        }
      },
      onMouseUp: (event) => {
        if ((0, import_core7.shouldIntercept)(event)) {
          event.preventDefault();
          import_core7.router.visit(url, visitParams);
        }
      },
      onKeyUp: (event) => {
        if ((0, import_core7.shouldNavigate)(event)) {
          event.preventDefault();
          import_core7.router.visit(url, visitParams);
        }
      },
      onClick: (event) => {
        onClick(event);
        if ((0, import_core7.shouldIntercept)(event)) {
          event.preventDefault();
        }
      }
    };
    const elProps = (0, import_react16.useMemo)(() => {
      if (_as === "button") {
        return { type: "button" };
      }
      if (_as === "a" || typeof _as !== "string") {
        return { href: url };
      }
      return {};
    }, [_as, url]);
    return (0, import_react16.createElement)(
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
var import_core8 = require("@inertiajs/core");
var import_react17 = require("react");
function usePoll(interval, requestOptions = {}, options = {
  keepAlive: false,
  autoStart: true
}) {
  const pollRef = (0, import_react17.useRef)(
    import_core8.router.poll(interval, requestOptions, {
      ...options,
      autoStart: false
    })
  );
  (0, import_react17.useEffect)(() => {
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
var import_core9 = require("@inertiajs/core");
var import_react18 = require("react");
function usePrefetch(options = {}) {
  const cached = typeof window === "undefined" ? null : import_core9.router.getCached(window.location.pathname, options);
  const inFlight = typeof window === "undefined" ? null : import_core9.router.getPrefetching(window.location.pathname, options);
  const [lastUpdatedAt, setLastUpdatedAt] = (0, import_react18.useState)(cached?.staleTimestamp || null);
  const [isPrefetching, setIsPrefetching] = (0, import_react18.useState)(inFlight !== null);
  const [isPrefetched, setIsPrefetched] = (0, import_react18.useState)(cached !== null);
  (0, import_react18.useEffect)(() => {
    const onPrefetchingListener = import_core9.router.on("prefetching", (e) => {
      if (e.detail.visit.url.pathname === window.location.pathname) {
        setIsPrefetching(true);
      }
    });
    const onPrefetchedListener = import_core9.router.on("prefetched", (e) => {
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
    flush: () => import_core9.router.flush(window.location.pathname, options)
  };
}

// src/WhenVisible.ts
var import_core10 = require("@inertiajs/core");
var import_react19 = require("react");
var WhenVisible = ({ children, data, params, buffer, as, always, fallback }) => {
  always = always ?? false;
  as = as ?? "div";
  fallback = fallback ?? null;
  const pageProps = usePage().props;
  const keys = (0, import_react19.useMemo)(() => data ? Array.isArray(data) ? data : [data] : [], [data]);
  const [loaded, setLoaded] = (0, import_react19.useState)(() => keys.length > 0 && keys.every((key) => pageProps[key] !== void 0));
  const [isFetching, setIsFetching] = (0, import_react19.useState)(false);
  const fetching = (0, import_react19.useRef)(false);
  const ref = (0, import_react19.useRef)(null);
  const observer = (0, import_react19.useRef)(null);
  const getReloadParamsRef = (0, import_react19.useRef)(() => ({}));
  (0, import_react19.useEffect)(() => {
    if (keys.length > 0) {
      setLoaded(keys.every((key) => pageProps[key] !== void 0));
    }
  }, [pageProps, keys]);
  const getReloadParams = (0, import_react19.useCallback)(() => {
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
        import_core10.router.reload({
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
  (0, import_react19.useEffect)(() => {
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
    return (0, import_react19.createElement)(
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
var progress = import_core11.progress;
var router3 = import_core11.router;
var config = import_core11.config.extend();
//# sourceMappingURL=index.js.map
