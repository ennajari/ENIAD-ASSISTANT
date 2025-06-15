module.exports = {

"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/core.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "$ZodAsyncError": (()=>$ZodAsyncError),
    "$brand": (()=>$brand),
    "$constructor": (()=>$constructor),
    "config": (()=>config),
    "globalConfig": (()=>globalConfig)
});
/*@__NO_SIDE_EFFECTS__*/ function $constructor(name, initializer, params) {
    function init(inst, def) {
        var _a;
        Object.defineProperty(inst, "_zod", {
            value: inst._zod ?? {},
            enumerable: false
        });
        (_a = inst._zod).traits ?? (_a.traits = new Set());
        inst._zod.traits.add(name);
        initializer(inst, def);
        // support prototype modifications
        for(const k in _.prototype){
            Object.defineProperty(inst, k, {
                value: _.prototype[k].bind(inst)
            });
        }
        inst._zod.constr = _;
        inst._zod.def = def;
    }
    // doesn't work if Parent has a constructor with arguments
    const Parent = params?.Parent ?? Object;
    class Definition extends Parent {
    }
    Object.defineProperty(Definition, "name", {
        value: name
    });
    function _(def) {
        var _a;
        const inst = params?.Parent ? new Definition() : this;
        init(inst, def);
        (_a = inst._zod).deferred ?? (_a.deferred = []);
        for (const fn of inst._zod.deferred){
            fn();
        }
        return inst;
    }
    Object.defineProperty(_, "init", {
        value: init
    });
    Object.defineProperty(_, Symbol.hasInstance, {
        value: (inst)=>{
            if (params?.Parent && inst instanceof params.Parent) return true;
            return inst?._zod?.traits?.has(name);
        }
    });
    Object.defineProperty(_, "name", {
        value: name
    });
    return _;
}
const $brand = Symbol("zod_brand");
class $ZodAsyncError extends Error {
    constructor(){
        super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
    }
}
const globalConfig = {};
function config(newConfig) {
    if (newConfig) Object.assign(globalConfig, newConfig);
    return globalConfig;
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// functions
__turbopack_context__.s({
    "BIGINT_FORMAT_RANGES": (()=>BIGINT_FORMAT_RANGES),
    "Class": (()=>Class),
    "NUMBER_FORMAT_RANGES": (()=>NUMBER_FORMAT_RANGES),
    "aborted": (()=>aborted),
    "allowsEval": (()=>allowsEval),
    "assert": (()=>assert),
    "assertEqual": (()=>assertEqual),
    "assertIs": (()=>assertIs),
    "assertNever": (()=>assertNever),
    "assertNotEqual": (()=>assertNotEqual),
    "assignProp": (()=>assignProp),
    "cached": (()=>cached),
    "cleanEnum": (()=>cleanEnum),
    "cleanRegex": (()=>cleanRegex),
    "clone": (()=>clone),
    "createTransparentProxy": (()=>createTransparentProxy),
    "defineLazy": (()=>defineLazy),
    "esc": (()=>esc),
    "escapeRegex": (()=>escapeRegex),
    "extend": (()=>extend),
    "finalizeIssue": (()=>finalizeIssue),
    "floatSafeRemainder": (()=>floatSafeRemainder),
    "getElementAtPath": (()=>getElementAtPath),
    "getLengthableOrigin": (()=>getLengthableOrigin),
    "getParsedType": (()=>getParsedType),
    "getSizableOrigin": (()=>getSizableOrigin),
    "getValidEnumValues": (()=>getValidEnumValues),
    "isObject": (()=>isObject),
    "isPlainObject": (()=>isPlainObject),
    "issue": (()=>issue),
    "joinValues": (()=>joinValues),
    "jsonStringifyReplacer": (()=>jsonStringifyReplacer),
    "merge": (()=>merge),
    "normalizeParams": (()=>normalizeParams),
    "nullish": (()=>nullish),
    "numKeys": (()=>numKeys),
    "omit": (()=>omit),
    "optionalKeys": (()=>optionalKeys),
    "partial": (()=>partial),
    "pick": (()=>pick),
    "prefixIssues": (()=>prefixIssues),
    "primitiveTypes": (()=>primitiveTypes),
    "promiseAllObject": (()=>promiseAllObject),
    "propertyKeyTypes": (()=>propertyKeyTypes),
    "randomString": (()=>randomString),
    "required": (()=>required),
    "stringifyPrimitive": (()=>stringifyPrimitive),
    "unwrapMessage": (()=>unwrapMessage)
});
function assertEqual(val) {
    return val;
}
function assertNotEqual(val) {
    return val;
}
function assertIs(_arg) {}
function assertNever(_x) {
    throw new Error();
}
function assert(_) {}
function getValidEnumValues(obj) {
    const validKeys = Object.keys(obj).filter((k)=>typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys){
        filtered[k] = obj[k];
    }
    return Object.values(filtered);
}
function joinValues(array, separator = "|") {
    return array.map((val)=>stringifyPrimitive(val)).join(separator);
}
function jsonStringifyReplacer(_, value) {
    if (typeof value === "bigint") return value.toString();
    return value;
}
function cached(getter) {
    const set = false;
    return {
        get value () {
            if ("TURBOPACK compile-time truthy", 1) {
                const value = getter();
                Object.defineProperty(this, "value", {
                    value
                });
                return value;
            }
            "TURBOPACK unreachable";
        }
    };
}
function nullish(input) {
    return input === null || input === undefined;
}
function cleanRegex(source) {
    const start = source.startsWith("^") ? 1 : 0;
    const end = source.endsWith("$") ? source.length - 1 : source.length;
    return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
    const valDecCount = (val.toString().split(".")[1] || "").length;
    const stepDecCount = (step.toString().split(".")[1] || "").length;
    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
    const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
    return valInt % stepInt / 10 ** decCount;
}
function defineLazy(object, key, getter) {
    const set = false;
    Object.defineProperty(object, key, {
        get () {
            if ("TURBOPACK compile-time truthy", 1) {
                const value = getter();
                object[key] = value;
                return value;
            }
            "TURBOPACK unreachable";
        },
        set (v) {
            Object.defineProperty(object, key, {
                value: v
            });
        // object[key] = v;
        },
        configurable: true
    });
}
function assignProp(target, prop, value) {
    Object.defineProperty(target, prop, {
        value,
        writable: true,
        enumerable: true,
        configurable: true
    });
}
function getElementAtPath(obj, path) {
    if (!path) return obj;
    return path.reduce((acc, key)=>acc?.[key], obj);
}
function promiseAllObject(promisesObj) {
    const keys = Object.keys(promisesObj);
    const promises = keys.map((key)=>promisesObj[key]);
    return Promise.all(promises).then((results)=>{
        const resolvedObj = {};
        for(let i = 0; i < keys.length; i++){
            resolvedObj[keys[i]] = results[i];
        }
        return resolvedObj;
    });
}
function randomString(length = 10) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let str = "";
    for(let i = 0; i < length; i++){
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}
function esc(str) {
    return JSON.stringify(str);
}
function isObject(data) {
    return typeof data === "object" && data !== null && !Array.isArray(data);
}
const allowsEval = cached(()=>{
    try {
        const F = Function;
        new F("");
        return true;
    } catch (_) {
        return false;
    }
});
function isPlainObject(data) {
    return typeof data === "object" && data !== null && Object.getPrototypeOf(data) === Object.prototype;
}
function numKeys(data) {
    let keyCount = 0;
    for(const key in data){
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            keyCount++;
        }
    }
    return keyCount;
}
const getParsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "undefined":
            return "undefined";
        case "string":
            return "string";
        case "number":
            return Number.isNaN(data) ? "nan" : "number";
        case "boolean":
            return "boolean";
        case "function":
            return "function";
        case "bigint":
            return "bigint";
        case "symbol":
            return "symbol";
        case "object":
            if (Array.isArray(data)) {
                return "array";
            }
            if (data === null) {
                return "null";
            }
            if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
                return "promise";
            }
            if (typeof Map !== "undefined" && data instanceof Map) {
                return "map";
            }
            if (typeof Set !== "undefined" && data instanceof Set) {
                return "set";
            }
            if (typeof Date !== "undefined" && data instanceof Date) {
                return "date";
            }
            if (typeof File !== "undefined" && data instanceof File) {
                return "file";
            }
            return "object";
        default:
            throw new Error(`Unknown data type: ${t}`);
    }
};
const propertyKeyTypes = new Set([
    "string",
    "number",
    "symbol"
]);
const primitiveTypes = new Set([
    "string",
    "number",
    "bigint",
    "boolean",
    "symbol",
    "undefined"
]);
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
    const cl = new inst._zod.constr(def ?? inst._zod.def);
    if (!def || params?.parent) cl._zod.parent = inst;
    return cl;
}
function normalizeParams(_params) {
    const params = _params;
    if (!params) return {};
    if (typeof params === "string") return {
        error: ()=>params
    };
    if (params?.message !== undefined) {
        if (params?.error !== undefined) throw new Error("Cannot specify both `message` and `error` params");
        params.error = params.message;
    }
    delete params.message;
    if (typeof params.error === "string") return {
        ...params,
        error: ()=>params.error
    };
    return params;
}
function createTransparentProxy(getter) {
    let target;
    return new Proxy({}, {
        get (_, prop, receiver) {
            target ?? (target = getter());
            return Reflect.get(target, prop, receiver);
        },
        set (_, prop, value, receiver) {
            target ?? (target = getter());
            return Reflect.set(target, prop, value, receiver);
        },
        has (_, prop) {
            target ?? (target = getter());
            return Reflect.has(target, prop);
        },
        deleteProperty (_, prop) {
            target ?? (target = getter());
            return Reflect.deleteProperty(target, prop);
        },
        ownKeys (_) {
            target ?? (target = getter());
            return Reflect.ownKeys(target);
        },
        getOwnPropertyDescriptor (_, prop) {
            target ?? (target = getter());
            return Reflect.getOwnPropertyDescriptor(target, prop);
        },
        defineProperty (_, prop, descriptor) {
            target ?? (target = getter());
            return Reflect.defineProperty(target, prop, descriptor);
        }
    });
}
function stringifyPrimitive(value) {
    if (typeof value === "bigint") return value.toString() + "n";
    if (typeof value === "string") return `"${value}"`;
    return `${value}`;
}
function optionalKeys(shape) {
    return Object.keys(shape).filter((k)=>{
        return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
    });
}
const NUMBER_FORMAT_RANGES = {
    safeint: [
        Number.MIN_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER
    ],
    int32: [
        -2147483648,
        2147483647
    ],
    uint32: [
        0,
        4294967295
    ],
    float32: [
        -3.4028234663852886e38,
        3.4028234663852886e38
    ],
    float64: [
        -Number.MAX_VALUE,
        Number.MAX_VALUE
    ]
};
const BIGINT_FORMAT_RANGES = {
    int64: [
        /* @__PURE__*/ BigInt("-9223372036854775808"),
        /* @__PURE__*/ BigInt("9223372036854775807")
    ],
    uint64: [
        /* @__PURE__*/ BigInt(0),
        /* @__PURE__*/ BigInt("18446744073709551615")
    ]
};
function pick(schema, mask) {
    const newShape = {};
    const currDef = schema._zod.def; //.shape;
    for(const key in mask){
        if (!(key in currDef.shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key]) continue;
        // pick key
        newShape[key] = currDef.shape[key];
    }
    return clone(schema, {
        ...schema._zod.def,
        shape: newShape,
        checks: []
    });
}
function omit(schema, mask) {
    const newShape = {
        ...schema._zod.def.shape
    };
    const currDef = schema._zod.def; //.shape;
    for(const key in mask){
        if (!(key in currDef.shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key]) continue;
        delete newShape[key];
    }
    return clone(schema, {
        ...schema._zod.def,
        shape: newShape,
        checks: []
    });
}
function extend(schema, shape) {
    const def = {
        ...schema._zod.def,
        get shape () {
            const _shape = {
                ...schema._zod.def.shape,
                ...shape
            };
            assignProp(this, "shape", _shape); // self-caching
            return _shape;
        },
        checks: []
    };
    return clone(schema, def);
}
function merge(a, b) {
    return clone(a, {
        ...a._zod.def,
        get shape () {
            const _shape = {
                ...a._zod.def.shape,
                ...b._zod.def.shape
            };
            assignProp(this, "shape", _shape); // self-caching
            return _shape;
        },
        catchall: b._zod.def.catchall,
        checks: []
    });
}
function partial(Class, schema, mask) {
    const oldShape = schema._zod.def.shape;
    const shape = {
        ...oldShape
    };
    if (mask) {
        for(const key in mask){
            if (!(key in oldShape)) {
                throw new Error(`Unrecognized key: "${key}"`);
            }
            if (!mask[key]) continue;
            shape[key] = Class ? new Class({
                type: "optional",
                innerType: oldShape[key]
            }) : oldShape[key];
        }
    } else {
        for(const key in oldShape){
            shape[key] = Class ? new Class({
                type: "optional",
                innerType: oldShape[key]
            }) : oldShape[key];
        }
    }
    return clone(schema, {
        ...schema._zod.def,
        shape,
        checks: []
    });
}
function required(Class, schema, mask) {
    const oldShape = schema._zod.def.shape;
    const shape = {
        ...oldShape
    };
    if (mask) {
        for(const key in mask){
            if (!(key in shape)) {
                throw new Error(`Unrecognized key: "${key}"`);
            }
            if (!mask[key]) continue;
            // overwrite with non-optional
            shape[key] = new Class({
                type: "nonoptional",
                innerType: oldShape[key]
            });
        }
    } else {
        for(const key in oldShape){
            // overwrite with non-optional
            shape[key] = new Class({
                type: "nonoptional",
                innerType: oldShape[key]
            });
        }
    }
    return clone(schema, {
        ...schema._zod.def,
        shape,
        // optional: [],
        checks: []
    });
}
function aborted(x, startIndex = 0) {
    for(let i = startIndex; i < x.issues.length; i++){
        if (x.issues[i].continue !== true) return true;
    }
    return false;
}
function prefixIssues(path, issues) {
    return issues.map((iss)=>{
        var _a;
        (_a = iss).path ?? (_a.path = []);
        iss.path.unshift(path);
        return iss;
    });
}
function unwrapMessage(message) {
    return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx, config) {
    const full = {
        ...iss,
        path: iss.path ?? []
    };
    // for backwards compatibility
    if (!iss.message) {
        const message = unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
        full.message = message;
    }
    // delete (full as any).def;
    delete full.inst;
    delete full.continue;
    if (!ctx?.reportInput) {
        delete full.input;
    }
    return full;
}
function getSizableOrigin(input) {
    if (input instanceof Set) return "set";
    if (input instanceof Map) return "map";
    if (input instanceof File) return "file";
    return "unknown";
}
function getLengthableOrigin(input) {
    if (Array.isArray(input)) return "array";
    if (typeof input === "string") return "string";
    return "unknown";
}
function issue(...args) {
    const [iss, input, inst] = args;
    if (typeof iss === "string") {
        return {
            message: iss,
            code: "custom",
            input,
            inst
        };
    }
    return {
        ...iss
    };
}
function cleanEnum(obj) {
    return Object.entries(obj).filter(([k, _])=>{
        // return true if NaN, meaning it's not a number, thus a string key
        return Number.isNaN(Number.parseInt(k, 10));
    }).map((el)=>el[1]);
}
class Class {
    constructor(..._args){}
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/errors.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "$ZodError": (()=>$ZodError),
    "$ZodRealError": (()=>$ZodRealError),
    "flattenError": (()=>flattenError),
    "formatError": (()=>formatError),
    "prettifyError": (()=>prettifyError),
    "toDotPath": (()=>toDotPath),
    "treeifyError": (()=>treeifyError)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/core.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
;
const initializer = (inst, def)=>{
    inst.name = "$ZodError";
    Object.defineProperty(inst, "_zod", {
        value: inst._zod,
        enumerable: false
    });
    Object.defineProperty(inst, "issues", {
        value: def,
        enumerable: false
    });
    Object.defineProperty(inst, "message", {
        get () {
            return JSON.stringify(def, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonStringifyReplacer"], 2);
        },
        enumerable: true
    });
};
const $ZodError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodError", initializer);
const $ZodRealError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodError", initializer, {
    Parent: Error
});
function flattenError(error, mapper = (issue)=>issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of error.issues){
        if (sub.path.length > 0) {
            fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
            fieldErrors[sub.path[0]].push(mapper(sub));
        } else {
            formErrors.push(mapper(sub));
        }
    }
    return {
        formErrors,
        fieldErrors
    };
}
function formatError(error, _mapper) {
    const mapper = _mapper || function(issue) {
        return issue.message;
    };
    const fieldErrors = {
        _errors: []
    };
    const processError = (error)=>{
        for (const issue of error.issues){
            if (issue.code === "invalid_union") {
                issue.errors.map((issues)=>processError({
                        issues
                    }));
            } else if (issue.code === "invalid_key") {
                processError({
                    issues: issue.issues
                });
            } else if (issue.code === "invalid_element") {
                processError({
                    issues: issue.issues
                });
            } else if (issue.path.length === 0) {
                fieldErrors._errors.push(mapper(issue));
            } else {
                let curr = fieldErrors;
                let i = 0;
                while(i < issue.path.length){
                    const el = issue.path[i];
                    const terminal = i === issue.path.length - 1;
                    if (!terminal) {
                        curr[el] = curr[el] || {
                            _errors: []
                        };
                    } else {
                        curr[el] = curr[el] || {
                            _errors: []
                        };
                        curr[el]._errors.push(mapper(issue));
                    }
                    curr = curr[el];
                    i++;
                }
            }
        }
    };
    processError(error);
    return fieldErrors;
}
function treeifyError(error, _mapper) {
    const mapper = _mapper || function(issue) {
        return issue.message;
    };
    const result = {
        errors: []
    };
    const processError = (error, path = [])=>{
        var _a, _b;
        for (const issue of error.issues){
            if (issue.code === "invalid_union") {
                issue.errors.map((issues)=>processError({
                        issues
                    }, issue.path));
            } else if (issue.code === "invalid_key") {
                processError({
                    issues: issue.issues
                }, issue.path);
            } else if (issue.code === "invalid_element") {
                processError({
                    issues: issue.issues
                }, issue.path);
            } else {
                const fullpath = [
                    ...path,
                    ...issue.path
                ];
                if (fullpath.length === 0) {
                    result.errors.push(mapper(issue));
                    continue;
                }
                let curr = result;
                let i = 0;
                while(i < fullpath.length){
                    const el = fullpath[i];
                    const terminal = i === fullpath.length - 1;
                    if (typeof el === "string") {
                        curr.properties ?? (curr.properties = {});
                        (_a = curr.properties)[el] ?? (_a[el] = {
                            errors: []
                        });
                        curr = curr.properties[el];
                    } else {
                        curr.items ?? (curr.items = []);
                        (_b = curr.items)[el] ?? (_b[el] = {
                            errors: []
                        });
                        curr = curr.items[el];
                    }
                    if (terminal) {
                        curr.errors.push(mapper(issue));
                    }
                    i++;
                }
            }
        }
    };
    processError(error);
    return result;
}
function toDotPath(path) {
    const segs = [];
    for (const seg of path){
        if (typeof seg === "number") segs.push(`[${seg}]`);
        else if (typeof seg === "symbol") segs.push(`[${JSON.stringify(String(seg))}]`);
        else if (/[^\w$]/.test(seg)) segs.push(`[${JSON.stringify(seg)}]`);
        else {
            if (segs.length) segs.push(".");
            segs.push(seg);
        }
    }
    return segs.join("");
}
function prettifyError(error) {
    const lines = [];
    // sort by path length
    const issues = [
        ...error.issues
    ].sort((a, b)=>a.path.length - b.path.length);
    // Process each issue
    for (const issue of issues){
        lines.push(`✖ ${issue.message}`);
        if (issue.path?.length) lines.push(`  → at ${toDotPath(issue.path)}`);
    }
    // Convert Map to formatted string
    return lines.join("\n");
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/parse.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "_parse": (()=>_parse),
    "_parseAsync": (()=>_parseAsync),
    "_safeParse": (()=>_safeParse),
    "_safeParseAsync": (()=>_safeParseAsync),
    "parse": (()=>parse),
    "parseAsync": (()=>parseAsync),
    "safeParse": (()=>safeParse),
    "safeParseAsync": (()=>safeParseAsync)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/core.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/errors.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
;
;
const _parse = (_Err)=>(schema, value, _ctx, _params)=>{
        const ctx = _ctx ? Object.assign(_ctx, {
            async: false
        }) : {
            async: false
        };
        const result = schema._zod.run({
            value,
            issues: []
        }, ctx);
        if (result instanceof Promise) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodAsyncError"]();
        }
        if (result.issues.length) {
            const e = new (_params?.Err ?? _Err)(result.issues.map((iss)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["finalizeIssue"])(iss, ctx, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["config"])())));
            Error.captureStackTrace(e, _params?.callee);
            throw e;
        }
        return result.value;
    };
const parse = /* @__PURE__*/ _parse(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodRealError"]);
const _parseAsync = (_Err)=>async (schema, value, _ctx, params)=>{
        const ctx = _ctx ? Object.assign(_ctx, {
            async: true
        }) : {
            async: true
        };
        let result = schema._zod.run({
            value,
            issues: []
        }, ctx);
        if (result instanceof Promise) result = await result;
        if (result.issues.length) {
            const e = new (params?.Err ?? _Err)(result.issues.map((iss)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["finalizeIssue"])(iss, ctx, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["config"])())));
            Error.captureStackTrace(e, params?.callee);
            throw e;
        }
        return result.value;
    };
const parseAsync = /* @__PURE__*/ _parseAsync(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodRealError"]);
const _safeParse = (_Err)=>(schema, value, _ctx)=>{
        const ctx = _ctx ? {
            ..._ctx,
            async: false
        } : {
            async: false
        };
        const result = schema._zod.run({
            value,
            issues: []
        }, ctx);
        if (result instanceof Promise) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodAsyncError"]();
        }
        return result.issues.length ? {
            success: false,
            error: new (_Err ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodError"])(result.issues.map((iss)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["finalizeIssue"])(iss, ctx, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["config"])())))
        } : {
            success: true,
            data: result.value
        };
    };
const safeParse = /* @__PURE__*/ _safeParse(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodRealError"]);
const _safeParseAsync = (_Err)=>async (schema, value, _ctx)=>{
        const ctx = _ctx ? Object.assign(_ctx, {
            async: true
        }) : {
            async: true
        };
        let result = schema._zod.run({
            value,
            issues: []
        }, ctx);
        if (result instanceof Promise) result = await result;
        return result.issues.length ? {
            success: false,
            error: new _Err(result.issues.map((iss)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["finalizeIssue"])(iss, ctx, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["config"])())))
        } : {
            success: true,
            data: result.value
        };
    };
const safeParseAsync = /* @__PURE__*/ _safeParseAsync(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodRealError"]);
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/regexes.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "_emoji": (()=>_emoji),
    "base64": (()=>base64),
    "base64url": (()=>base64url),
    "bigint": (()=>bigint),
    "boolean": (()=>boolean),
    "browserEmail": (()=>browserEmail),
    "cidrv4": (()=>cidrv4),
    "cidrv6": (()=>cidrv6),
    "cuid": (()=>cuid),
    "cuid2": (()=>cuid2),
    "date": (()=>date),
    "datetime": (()=>datetime),
    "domain": (()=>domain),
    "duration": (()=>duration),
    "e164": (()=>e164),
    "email": (()=>email),
    "emoji": (()=>emoji),
    "extendedDuration": (()=>extendedDuration),
    "guid": (()=>guid),
    "hostname": (()=>hostname),
    "html5Email": (()=>html5Email),
    "integer": (()=>integer),
    "ip": (()=>ip),
    "ipv4": (()=>ipv4),
    "ipv6": (()=>ipv6),
    "ksuid": (()=>ksuid),
    "lowercase": (()=>lowercase),
    "nanoid": (()=>nanoid),
    "null": (()=>_null),
    "number": (()=>number),
    "rfc5322Email": (()=>rfc5322Email),
    "string": (()=>string),
    "time": (()=>time),
    "ulid": (()=>ulid),
    "undefined": (()=>_undefined),
    "unicodeEmail": (()=>unicodeEmail),
    "uppercase": (()=>uppercase),
    "uuid": (()=>uuid),
    "uuid4": (()=>uuid4),
    "uuid6": (()=>uuid6),
    "uuid7": (()=>uuid7),
    "xid": (()=>xid)
});
const cuid = /^[cC][^\s-]{8,}$/;
const cuid2 = /^[0-9a-z]+$/;
const ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
const xid = /^[0-9a-vA-V]{20}$/;
const ksuid = /^[A-Za-z0-9]{27}$/;
const nanoid = /^[a-zA-Z0-9_-]{21}$/;
const duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
const extendedDuration = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
const uuid = (version)=>{
    if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$/;
    return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
const uuid4 = uuid(4);
const uuid6 = uuid(6);
const uuid7 = uuid(7);
const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
const html5Email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const rfc5322Email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const unicodeEmail = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u;
const browserEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const _emoji = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function emoji() {
    return new RegExp(_emoji, "u");
}
const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})$/;
const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
const ip = new RegExp(`(${ipv4.source})|(${ipv6.source})`);
const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
const base64url = /^[A-Za-z0-9_-]*$/;
const hostname = /^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+$/;
const domain = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
const e164 = /^\+(?:[0-9]){6,14}[0-9]$/;
const dateSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
const date = new RegExp(`^${dateSource}$`);
function timeSource(args) {
    // let regex = `\\d{2}:\\d{2}:\\d{2}`;
    let regex = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;
    if (args.precision) {
        regex = `${regex}\\.\\d{${args.precision}}`;
    } else if (args.precision == null) {
        regex = `${regex}(\\.\\d+)?`;
    }
    return regex;
}
function time(args) {
    return new RegExp(`^${timeSource(args)}$`);
}
function datetime(args) {
    let regex = `${dateSource}T${timeSource(args)}`;
    const opts = [];
    opts.push(args.local ? `Z?` : `Z`);
    if (args.offset) opts.push(`([+-]\\d{2}:?\\d{2})`);
    regex = `${regex}(${opts.join("|")})`;
    return new RegExp(`^${regex}$`);
}
const string = (params)=>{
    const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
    return new RegExp(`^${regex}$`);
};
const bigint = /^\d+n?$/;
const integer = /^\d+$/;
const number = /^-?\d+(?:\.\d+)?/i;
const boolean = /true|false/i;
const _null = /null/i;
;
const _undefined = /undefined/i;
;
const lowercase = /^[^A-Z]*$/;
const uppercase = /^[^a-z]*$/;
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/checks.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// import { $ZodType } from "./schemas.js";
__turbopack_context__.s({
    "$ZodCheck": (()=>$ZodCheck),
    "$ZodCheckBigIntFormat": (()=>$ZodCheckBigIntFormat),
    "$ZodCheckEndsWith": (()=>$ZodCheckEndsWith),
    "$ZodCheckGreaterThan": (()=>$ZodCheckGreaterThan),
    "$ZodCheckIncludes": (()=>$ZodCheckIncludes),
    "$ZodCheckLengthEquals": (()=>$ZodCheckLengthEquals),
    "$ZodCheckLessThan": (()=>$ZodCheckLessThan),
    "$ZodCheckLowerCase": (()=>$ZodCheckLowerCase),
    "$ZodCheckMaxLength": (()=>$ZodCheckMaxLength),
    "$ZodCheckMaxSize": (()=>$ZodCheckMaxSize),
    "$ZodCheckMimeType": (()=>$ZodCheckMimeType),
    "$ZodCheckMinLength": (()=>$ZodCheckMinLength),
    "$ZodCheckMinSize": (()=>$ZodCheckMinSize),
    "$ZodCheckMultipleOf": (()=>$ZodCheckMultipleOf),
    "$ZodCheckNumberFormat": (()=>$ZodCheckNumberFormat),
    "$ZodCheckOverwrite": (()=>$ZodCheckOverwrite),
    "$ZodCheckProperty": (()=>$ZodCheckProperty),
    "$ZodCheckRegex": (()=>$ZodCheckRegex),
    "$ZodCheckSizeEquals": (()=>$ZodCheckSizeEquals),
    "$ZodCheckStartsWith": (()=>$ZodCheckStartsWith),
    "$ZodCheckStringFormat": (()=>$ZodCheckStringFormat),
    "$ZodCheckUpperCase": (()=>$ZodCheckUpperCase)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/core.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/regexes.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
;
;
const $ZodCheck = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheck", (inst, def)=>{
    var _a;
    inst._zod ?? (inst._zod = {});
    inst._zod.def = def;
    (_a = inst._zod).onattach ?? (_a.onattach = []);
});
const numericOriginMap = {
    number: "number",
    bigint: "bigint",
    object: "date"
};
const $ZodCheckLessThan = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheckLessThan", (inst, def)=>{
    $ZodCheck.init(inst, def);
    const origin = numericOriginMap[typeof def.value];
    inst._zod.onattach.push((inst)=>{
        const bag = inst._zod.bag;
        const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
        if (def.value < curr) {
            if (def.inclusive) bag.maximum = def.value;
            else bag.exclusiveMaximum = def.value;
        }
    });
    inst._zod.check = (payload)=>{
        if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
            return;
        }
        payload.issues.push({
            origin,
            code: "too_big",
            maximum: def.value,
            input: payload.value,
            inclusive: def.inclusive,
            inst,
            continue: !def.abort
        });
    };
});
const $ZodCheckGreaterThan = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheckGreaterThan", (inst, def)=>{
    $ZodCheck.init(inst, def);
    const origin = numericOriginMap[typeof def.value];
    inst._zod.onattach.push((inst)=>{
        const bag = inst._zod.bag;
        const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
        if (def.value > curr) {
            if (def.inclusive) bag.minimum = def.value;
            else bag.exclusiveMinimum = def.value;
        }
    });
    inst._zod.check = (payload)=>{
        if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
            return;
        }
        payload.issues.push({
            origin: origin,
            code: "too_small",
            minimum: def.value,
            input: payload.value,
            inclusive: def.inclusive,
            inst,
            continue: !def.abort
        });
    };
});
const $ZodCheckMultipleOf = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheckMultipleOf", (inst, def)=>{
    $ZodCheck.init(inst, def);
    inst._zod.onattach.push((inst)=>{
        var _a;
        (_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
    });
    inst._zod.check = (payload)=>{
        if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
        const isMultiple = typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["floatSafeRemainder"])(payload.value, def.value) === 0;
        if (isMultiple) return;
        payload.issues.push({
            origin: typeof payload.value,
            code: "not_multiple_of",
            divisor: def.value,
            input: payload.value,
            inst,
            continue: !def.abort
        });
    };
});
const $ZodCheckNumberFormat = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheckNumberFormat", (inst, def)=>{
    $ZodCheck.init(inst, def); // no format checks
    def.format = def.format || "float64";
    const isInt = def.format?.includes("int");
    const origin = isInt ? "int" : "number";
    const [minimum, maximum] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NUMBER_FORMAT_RANGES"][def.format];
    inst._zod.onattach.push((inst)=>{
        const bag = inst._zod.bag;
        bag.format = def.format;
        bag.minimum = minimum;
        bag.maximum = maximum;
        if (isInt) bag.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"];
    });
    inst._zod.check = (payload)=>{
        const input = payload.value;
        if (isInt) {
            if (!Number.isInteger(input)) {
                // invalid_format issue
                // payload.issues.push({
                //   expected: def.format,
                //   format: def.format,
                //   code: "invalid_format",
                //   input,
                //   inst,
                // });
                // invalid_type issue
                payload.issues.push({
                    expected: origin,
                    format: def.format,
                    code: "invalid_type",
                    input,
                    inst
                });
                return;
            // not_multiple_of issue
            // payload.issues.push({
            //   code: "not_multiple_of",
            //   origin: "number",
            //   input,
            //   inst,
            //   divisor: 1,
            // });
            }
            if (!Number.isSafeInteger(input)) {
                if (input > 0) {
                    // too_big
                    payload.issues.push({
                        input,
                        code: "too_big",
                        maximum: Number.MAX_SAFE_INTEGER,
                        note: "Integers must be within the safe integer range.",
                        inst,
                        origin,
                        continue: !def.abort
                    });
                } else {
                    // too_small
                    payload.issues.push({
                        input,
                        code: "too_small",
                        minimum: Number.MIN_SAFE_INTEGER,
                        note: "Integers must be within the safe integer range.",
                        inst,
                        origin,
                        continue: !def.abort
                    });
                }
                return;
            }
        }
        if (input < minimum) {
            payload.issues.push({
                origin: "number",
                input: input,
                code: "too_small",
                minimum: minimum,
                inclusive: true,
                inst,
                continue: !def.abort
            });
        }
        if (input > maximum) {
            payload.issues.push({
                origin: "number",
                input,
                code: "too_big",
                maximum,
                inst
            });
        }
    };
});
const $ZodCheckBigIntFormat = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheckBigIntFormat", (inst, def)=>{
    $ZodCheck.init(inst, def); // no format checks
    const [minimum, maximum] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BIGINT_FORMAT_RANGES"][def.format];
    inst._zod.onattach.push((inst)=>{
        const bag = inst._zod.bag;
        bag.format = def.format;
        bag.minimum = minimum;
        bag.maximum = maximum;
    });
    inst._zod.check = (payload)=>{
        const input = payload.value;
        if (input < minimum) {
            payload.issues.push({
                origin: "bigint",
                input,
                code: "too_small",
                minimum: minimum,
                inclusive: true,
                inst,
                continue: !def.abort
            });
        }
        if (input > maximum) {
            payload.issues.push({
                origin: "bigint",
                input,
                code: "too_big",
                maximum,
                inst
            });
        }
    };
});
const $ZodCheckMaxSize = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheckMaxSize", (inst, def)=>{
    $ZodCheck.init(inst, def);
    inst._zod.when = (payload)=>{
        const val = payload.value;
        return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nullish"])(val) && val.size !== undefined;
    };
    inst._zod.onattach.push((inst)=>{
        const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
        if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
    });
    inst._zod.check = (payload)=>{
        const input = payload.value;
        const size = input.size;
        if (size <= def.maximum) return;
        payload.issues.push({
            origin: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSizableOrigin"])(input),
            code: "too_big",
            maximum: def.maximum,
            input,
            inst,
            continue: !def.abort
        });
    };
});
const $ZodCheckMinSize = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheckMinSize", (inst, def)=>{
    $ZodCheck.init(inst, def);
    inst._zod.when = (payload)=>{
        const val = payload.value;
        return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nullish"])(val) && val.size !== undefined;
    };
    inst._zod.onattach.push((inst)=>{
        const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
        if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
    });
    inst._zod.check = (payload)=>{
        const input = payload.value;
        const size = input.size;
        if (size >= def.minimum) return;
        payload.issues.push({
            origin: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSizableOrigin"])(input),
            code: "too_small",
            minimum: def.minimum,
            input,
            inst,
            continue: !def.abort
        });
    };
});
const $ZodCheckSizeEquals = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheckSizeEquals", (inst, def)=>{
    $ZodCheck.init(inst, def);
    inst._zod.when = (payload)=>{
        const val = payload.value;
        return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nullish"])(val) && val.size !== undefined;
    };
    inst._zod.onattach.push((inst)=>{
        const bag = inst._zod.bag;
        bag.minimum = def.size;
        bag.maximum = def.size;
        bag.size = def.size;
    });
    inst._zod.check = (payload)=>{
        const input = payload.value;
        const size = input.size;
        if (size === def.size) return;
        const tooBig = size > def.size;
        payload.issues.push({
            origin: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSizableOrigin"])(input),
            ...tooBig ? {
                code: "too_big",
                maximum: def.size
            } : {
                code: "too_small",
                minimum: def.size
            },
            input: payload.value,
            inst,
            continue: !def.abort
        });
    };
});
const $ZodCheckMaxLength = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheckMaxLength", (inst, def)=>{
    $ZodCheck.init(inst, def);
    inst._zod.when = (payload)=>{
        const val = payload.value;
        return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nullish"])(val) && val.length !== undefined;
    };
    inst._zod.onattach.push((inst)=>{
        const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
        if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
    });
    inst._zod.check = (payload)=>{
        const input = payload.value;
        const length = input.length;
        if (length <= def.maximum) return;
        const origin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getLengthableOrigin"])(input);
        payload.issues.push({
            origin,
            code: "too_big",
            maximum: def.maximum,
            input,
            inst,
            continue: !def.abort
        });
    };
});
const $ZodCheckMinLength = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheckMinLength", (inst, def)=>{
    $ZodCheck.init(inst, def);
    inst._zod.when = (payload)=>{
        const val = payload.value;
        return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nullish"])(val) && val.length !== undefined;
    };
    inst._zod.onattach.push((inst)=>{
        const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
        if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
    });
    inst._zod.check = (payload)=>{
        const input = payload.value;
        const length = input.length;
        if (length >= def.minimum) return;
        const origin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getLengthableOrigin"])(input);
        payload.issues.push({
            origin,
            code: "too_small",
            minimum: def.minimum,
            input,
            inst,
            continue: !def.abort
        });
    };
});
const $ZodCheckLengthEquals = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheckLengthEquals", (inst, def)=>{
    $ZodCheck.init(inst, def);
    inst._zod.when = (payload)=>{
        const val = payload.value;
        return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nullish"])(val) && val.length !== undefined;
    };
    inst._zod.onattach.push((inst)=>{
        const bag = inst._zod.bag;
        bag.minimum = def.length;
        bag.maximum = def.length;
        bag.length = def.length;
    });
    inst._zod.check = (payload)=>{
        const input = payload.value;
        const length = input.length;
        if (length === def.length) return;
        const origin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getLengthableOrigin"])(input);
        const tooBig = length > def.length;
        payload.issues.push({
            origin,
            ...tooBig ? {
                code: "too_big",
                maximum: def.length
            } : {
                code: "too_small",
                minimum: def.length
            },
            input: payload.value,
            inst,
            continue: !def.abort
        });
    };
});
const $ZodCheckStringFormat = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheckStringFormat", (inst, def)=>{
    var _a;
    $ZodCheck.init(inst, def);
    inst._zod.onattach.push((inst)=>{
        const bag = inst._zod.bag;
        bag.format = def.format;
        if (def.pattern) {
            bag.patterns ?? (bag.patterns = new Set());
            bag.patterns.add(def.pattern);
        }
    });
    (_a = inst._zod).check ?? (_a.check = (payload)=>{
        if (!def.pattern) throw new Error("Not implemented.");
        def.pattern.lastIndex = 0;
        if (def.pattern.test(payload.value)) return;
        payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: def.format,
            input: payload.value,
            ...def.pattern ? {
                pattern: def.pattern.toString()
            } : {},
            inst,
            continue: !def.abort
        });
    });
});
const $ZodCheckRegex = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheckRegex", (inst, def)=>{
    $ZodCheckStringFormat.init(inst, def);
    inst._zod.check = (payload)=>{
        def.pattern.lastIndex = 0;
        if (def.pattern.test(payload.value)) return;
        payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "regex",
            input: payload.value,
            pattern: def.pattern.toString(),
            inst,
            continue: !def.abort
        });
    };
});
const $ZodCheckLowerCase = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheckLowerCase", (inst, def)=>{
    def.pattern ?? (def.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["lowercase"]);
    $ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckUpperCase = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheckUpperCase", (inst, def)=>{
    def.pattern ?? (def.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uppercase"]);
    $ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckIncludes = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheckIncludes", (inst, def)=>{
    $ZodCheck.init(inst, def);
    const pattern = new RegExp((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["escapeRegex"])(def.includes));
    def.pattern = pattern;
    inst._zod.onattach.push((inst)=>{
        const bag = inst._zod.bag;
        bag.patterns ?? (bag.patterns = new Set());
        bag.patterns.add(pattern);
    });
    inst._zod.check = (payload)=>{
        if (payload.value.includes(def.includes, def.position)) return;
        payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "includes",
            includes: def.includes,
            input: payload.value,
            inst,
            continue: !def.abort
        });
    };
});
const $ZodCheckStartsWith = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheckStartsWith", (inst, def)=>{
    $ZodCheck.init(inst, def);
    const pattern = new RegExp(`^${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["escapeRegex"])(def.prefix)}.*`);
    def.pattern ?? (def.pattern = pattern);
    inst._zod.onattach.push((inst)=>{
        const bag = inst._zod.bag;
        bag.patterns ?? (bag.patterns = new Set());
        bag.patterns.add(pattern);
    });
    inst._zod.check = (payload)=>{
        if (payload.value.startsWith(def.prefix)) return;
        payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "starts_with",
            prefix: def.prefix,
            input: payload.value,
            inst,
            continue: !def.abort
        });
    };
});
const $ZodCheckEndsWith = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheckEndsWith", (inst, def)=>{
    $ZodCheck.init(inst, def);
    const pattern = new RegExp(`.*${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["escapeRegex"])(def.suffix)}$`);
    def.pattern ?? (def.pattern = pattern);
    inst._zod.onattach.push((inst)=>{
        const bag = inst._zod.bag;
        bag.patterns ?? (bag.patterns = new Set());
        bag.patterns.add(pattern);
    });
    inst._zod.check = (payload)=>{
        if (payload.value.endsWith(def.suffix)) return;
        payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "ends_with",
            suffix: def.suffix,
            input: payload.value,
            inst,
            continue: !def.abort
        });
    };
});
///////////////////////////////////
/////    $ZodCheckProperty    /////
///////////////////////////////////
function handleCheckPropertyResult(result, payload, property) {
    if (result.issues.length) {
        payload.issues.push(...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prefixIssues"])(property, result.issues));
    }
}
const $ZodCheckProperty = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheckProperty", (inst, def)=>{
    $ZodCheck.init(inst, def);
    inst._zod.check = (payload)=>{
        const result = def.schema._zod.run({
            value: payload.value[def.property],
            issues: []
        }, {});
        if (result instanceof Promise) {
            return result.then((result)=>handleCheckPropertyResult(result, payload, def.property));
        }
        handleCheckPropertyResult(result, payload, def.property);
        return;
    };
});
const $ZodCheckMimeType = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheckMimeType", (inst, def)=>{
    $ZodCheck.init(inst, def);
    const mimeSet = new Set(def.mime);
    inst._zod.onattach.push((inst)=>{
        inst._zod.bag.mime = def.mime;
    });
    inst._zod.check = (payload)=>{
        if (mimeSet.has(payload.value.type)) return;
        payload.issues.push({
            code: "invalid_value",
            values: def.mime,
            input: payload.value.type,
            path: [
                "type"
            ],
            inst
        });
    };
});
const $ZodCheckOverwrite = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCheckOverwrite", (inst, def)=>{
    $ZodCheck.init(inst, def);
    inst._zod.check = (payload)=>{
        payload.value = def.tx(payload.value);
    };
});
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/doc.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Doc": (()=>Doc)
});
class Doc {
    constructor(args = []){
        this.content = [];
        this.indent = 0;
        if (this) this.args = args;
    }
    indented(fn) {
        this.indent += 1;
        fn(this);
        this.indent -= 1;
    }
    write(arg) {
        if (typeof arg === "function") {
            arg(this, {
                execution: "sync"
            });
            arg(this, {
                execution: "async"
            });
            return;
        }
        const content = arg;
        const lines = content.split("\n").filter((x)=>x);
        const minIndent = Math.min(...lines.map((x)=>x.length - x.trimStart().length));
        const dedented = lines.map((x)=>x.slice(minIndent)).map((x)=>" ".repeat(this.indent * 2) + x);
        for (const line of dedented){
            this.content.push(line);
        }
    }
    compile() {
        const F = Function;
        const args = this?.args;
        const content = this?.content ?? [
            ``
        ];
        const lines = [
            ...content.map((x)=>`  ${x}`)
        ];
        // console.log(lines.join("\n"));
        // console.dir("COMPILE", {depth: null});
        return new F(...args, lines.join("\n"));
    }
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/versions.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "version": (()=>version)
});
const version = {
    major: 4,
    minor: 0,
    patch: 0
};
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/schemas.js [app-route] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "$ZodAny": (()=>$ZodAny),
    "$ZodArray": (()=>$ZodArray),
    "$ZodBase64": (()=>$ZodBase64),
    "$ZodBase64URL": (()=>$ZodBase64URL),
    "$ZodBigInt": (()=>$ZodBigInt),
    "$ZodBigIntFormat": (()=>$ZodBigIntFormat),
    "$ZodBoolean": (()=>$ZodBoolean),
    "$ZodCIDRv4": (()=>$ZodCIDRv4),
    "$ZodCIDRv6": (()=>$ZodCIDRv6),
    "$ZodCUID": (()=>$ZodCUID),
    "$ZodCUID2": (()=>$ZodCUID2),
    "$ZodCatch": (()=>$ZodCatch),
    "$ZodCustom": (()=>$ZodCustom),
    "$ZodDate": (()=>$ZodDate),
    "$ZodDefault": (()=>$ZodDefault),
    "$ZodDiscriminatedUnion": (()=>$ZodDiscriminatedUnion),
    "$ZodE164": (()=>$ZodE164),
    "$ZodEmail": (()=>$ZodEmail),
    "$ZodEmoji": (()=>$ZodEmoji),
    "$ZodEnum": (()=>$ZodEnum),
    "$ZodFile": (()=>$ZodFile),
    "$ZodGUID": (()=>$ZodGUID),
    "$ZodIPv4": (()=>$ZodIPv4),
    "$ZodIPv6": (()=>$ZodIPv6),
    "$ZodISODate": (()=>$ZodISODate),
    "$ZodISODateTime": (()=>$ZodISODateTime),
    "$ZodISODuration": (()=>$ZodISODuration),
    "$ZodISOTime": (()=>$ZodISOTime),
    "$ZodIntersection": (()=>$ZodIntersection),
    "$ZodJWT": (()=>$ZodJWT),
    "$ZodKSUID": (()=>$ZodKSUID),
    "$ZodLazy": (()=>$ZodLazy),
    "$ZodLiteral": (()=>$ZodLiteral),
    "$ZodMap": (()=>$ZodMap),
    "$ZodNaN": (()=>$ZodNaN),
    "$ZodNanoID": (()=>$ZodNanoID),
    "$ZodNever": (()=>$ZodNever),
    "$ZodNonOptional": (()=>$ZodNonOptional),
    "$ZodNull": (()=>$ZodNull),
    "$ZodNullable": (()=>$ZodNullable),
    "$ZodNumber": (()=>$ZodNumber),
    "$ZodNumberFormat": (()=>$ZodNumberFormat),
    "$ZodObject": (()=>$ZodObject),
    "$ZodOptional": (()=>$ZodOptional),
    "$ZodPipe": (()=>$ZodPipe),
    "$ZodPrefault": (()=>$ZodPrefault),
    "$ZodPromise": (()=>$ZodPromise),
    "$ZodReadonly": (()=>$ZodReadonly),
    "$ZodRecord": (()=>$ZodRecord),
    "$ZodSet": (()=>$ZodSet),
    "$ZodString": (()=>$ZodString),
    "$ZodStringFormat": (()=>$ZodStringFormat),
    "$ZodSuccess": (()=>$ZodSuccess),
    "$ZodSymbol": (()=>$ZodSymbol),
    "$ZodTemplateLiteral": (()=>$ZodTemplateLiteral),
    "$ZodTransform": (()=>$ZodTransform),
    "$ZodTuple": (()=>$ZodTuple),
    "$ZodType": (()=>$ZodType),
    "$ZodULID": (()=>$ZodULID),
    "$ZodURL": (()=>$ZodURL),
    "$ZodUUID": (()=>$ZodUUID),
    "$ZodUndefined": (()=>$ZodUndefined),
    "$ZodUnion": (()=>$ZodUnion),
    "$ZodUnknown": (()=>$ZodUnknown),
    "$ZodVoid": (()=>$ZodVoid),
    "$ZodXID": (()=>$ZodXID),
    "isValidBase64": (()=>isValidBase64),
    "isValidBase64URL": (()=>isValidBase64URL),
    "isValidJWT": (()=>isValidJWT)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/checks.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/core.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$doc$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/doc.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$parse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/parse.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/regexes.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$versions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/versions.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
const $ZodType = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodType", (inst, def)=>{
    var _a;
    inst ?? (inst = {});
    inst._zod.id = def.type + "_" + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["randomString"])(10);
    inst._zod.def = def; // set _def property
    inst._zod.bag = inst._zod.bag || {}; // initialize _bag object
    inst._zod.version = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$versions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["version"];
    const checks = [
        ...inst._zod.def.checks ?? []
    ];
    // if inst is itself a checks.$ZodCheck, run it as a check
    if (inst._zod.traits.has("$ZodCheck")) {
        checks.unshift(inst);
    }
    //
    for (const ch of checks){
        for (const fn of ch._zod.onattach){
            fn(inst);
        }
    }
    if (checks.length === 0) {
        // deferred initializer
        // inst._zod.parse is not yet defined
        (_a = inst._zod).deferred ?? (_a.deferred = []);
        inst._zod.deferred?.push(()=>{
            inst._zod.run = inst._zod.parse;
        });
    } else {
        const runChecks = (payload, checks, ctx)=>{
            let isAborted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aborted"])(payload);
            let asyncResult;
            for (const ch of checks){
                if (ch._zod.when) {
                    const shouldRun = ch._zod.when(payload);
                    if (!shouldRun) continue;
                } else {
                    if (isAborted) {
                        continue;
                    }
                }
                const currLen = payload.issues.length;
                const _ = ch._zod.check(payload);
                if (_ instanceof Promise && ctx?.async === false) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodAsyncError"]();
                }
                if (asyncResult || _ instanceof Promise) {
                    asyncResult = (asyncResult ?? Promise.resolve()).then(async ()=>{
                        await _;
                        const nextLen = payload.issues.length;
                        if (nextLen === currLen) return;
                        if (!isAborted) isAborted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aborted"])(payload, currLen);
                    });
                } else {
                    const nextLen = payload.issues.length;
                    if (nextLen === currLen) continue;
                    if (!isAborted) isAborted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aborted"])(payload, currLen);
                }
            }
            if (asyncResult) {
                return asyncResult.then(()=>{
                    return payload;
                });
            }
            return payload;
        };
        inst._zod.run = (payload, ctx)=>{
            const result = inst._zod.parse(payload, ctx);
            if (result instanceof Promise) {
                if (ctx.async === false) throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodAsyncError"]();
                return result.then((result)=>runChecks(result, checks, ctx));
            }
            return runChecks(result, checks, ctx);
        };
    }
    inst["~standard"] = {
        validate: (value)=>{
            try {
                const r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$parse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeParse"])(inst, value);
                return r.success ? {
                    value: r.data
                } : {
                    issues: r.error?.issues
                };
            } catch (_) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$parse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeParseAsync"])(inst, value).then((r)=>r.success ? {
                        value: r.data
                    } : {
                        issues: r.error?.issues
                    });
            }
        },
        vendor: "zod",
        version: 1
    };
});
;
const $ZodString = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodString", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.pattern = [
        ...inst?._zod.bag?.patterns ?? []
    ].pop() ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"])(inst._zod.bag);
    inst._zod.parse = (payload, _)=>{
        if (def.coerce) try {
            payload.value = String(payload.value);
        } catch (_) {}
        if (typeof payload.value === "string") return payload;
        payload.issues.push({
            expected: "string",
            code: "invalid_type",
            input: payload.value,
            inst
        });
        return payload;
    };
});
const $ZodStringFormat = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodStringFormat", (inst, def)=>{
    // check initialization must come first
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckStringFormat"].init(inst, def);
    $ZodString.init(inst, def);
});
const $ZodGUID = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodGUID", (inst, def)=>{
    def.pattern ?? (def.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["guid"]);
    $ZodStringFormat.init(inst, def);
});
const $ZodUUID = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodUUID", (inst, def)=>{
    if (def.version) {
        const versionMap = {
            v1: 1,
            v2: 2,
            v3: 3,
            v4: 4,
            v5: 5,
            v6: 6,
            v7: 7,
            v8: 8
        };
        const v = versionMap[def.version];
        if (v === undefined) throw new Error(`Invalid UUID version: "${def.version}"`);
        def.pattern ?? (def.pattern = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])(v));
    } else def.pattern ?? (def.pattern = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuid"])());
    $ZodStringFormat.init(inst, def);
});
const $ZodEmail = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodEmail", (inst, def)=>{
    def.pattern ?? (def.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["email"]);
    $ZodStringFormat.init(inst, def);
});
const $ZodURL = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodURL", (inst, def)=>{
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload)=>{
        try {
            const url = new URL(payload.value);
            if (def.hostname) {
                def.hostname.lastIndex = 0;
                if (!def.hostname.test(url.hostname)) {
                    payload.issues.push({
                        code: "invalid_format",
                        format: "url",
                        note: "Invalid hostname",
                        pattern: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hostname"].source,
                        input: payload.value,
                        inst
                    });
                }
            }
            if (def.protocol) {
                def.protocol.lastIndex = 0;
                if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) {
                    payload.issues.push({
                        code: "invalid_format",
                        format: "url",
                        note: "Invalid protocol",
                        pattern: def.protocol.source,
                        input: payload.value,
                        inst
                    });
                }
            }
            return;
        } catch (_) {
            payload.issues.push({
                code: "invalid_format",
                format: "url",
                input: payload.value,
                inst
            });
        }
    };
});
const $ZodEmoji = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodEmoji", (inst, def)=>{
    def.pattern ?? (def.pattern = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["emoji"])());
    $ZodStringFormat.init(inst, def);
});
const $ZodNanoID = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodNanoID", (inst, def)=>{
    def.pattern ?? (def.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nanoid"]);
    $ZodStringFormat.init(inst, def);
});
const $ZodCUID = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCUID", (inst, def)=>{
    def.pattern ?? (def.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cuid"]);
    $ZodStringFormat.init(inst, def);
});
const $ZodCUID2 = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCUID2", (inst, def)=>{
    def.pattern ?? (def.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cuid2"]);
    $ZodStringFormat.init(inst, def);
});
const $ZodULID = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodULID", (inst, def)=>{
    def.pattern ?? (def.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ulid"]);
    $ZodStringFormat.init(inst, def);
});
const $ZodXID = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodXID", (inst, def)=>{
    def.pattern ?? (def.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["xid"]);
    $ZodStringFormat.init(inst, def);
});
const $ZodKSUID = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodKSUID", (inst, def)=>{
    def.pattern ?? (def.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ksuid"]);
    $ZodStringFormat.init(inst, def);
});
const $ZodISODateTime = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodISODateTime", (inst, def)=>{
    def.pattern ?? (def.pattern = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["datetime"])(def));
    $ZodStringFormat.init(inst, def);
});
const $ZodISODate = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodISODate", (inst, def)=>{
    def.pattern ?? (def.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["date"]);
    $ZodStringFormat.init(inst, def);
});
const $ZodISOTime = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodISOTime", (inst, def)=>{
    def.pattern ?? (def.pattern = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["time"])(def));
    $ZodStringFormat.init(inst, def);
});
const $ZodISODuration = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodISODuration", (inst, def)=>{
    def.pattern ?? (def.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["duration"]);
    $ZodStringFormat.init(inst, def);
});
const $ZodIPv4 = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodIPv4", (inst, def)=>{
    def.pattern ?? (def.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ipv4"]);
    $ZodStringFormat.init(inst, def);
    inst._zod.onattach.push((inst)=>{
        const bag = inst._zod.bag;
        bag.format = `ipv4`;
    });
});
const $ZodIPv6 = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodIPv6", (inst, def)=>{
    def.pattern ?? (def.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ipv6"]);
    $ZodStringFormat.init(inst, def);
    inst._zod.onattach.push((inst)=>{
        const bag = inst._zod.bag;
        bag.format = `ipv6`;
    });
    inst._zod.check = (payload)=>{
        try {
            new URL(`http://[${payload.value}]`);
        // return;
        } catch  {
            payload.issues.push({
                code: "invalid_format",
                format: "ipv6",
                input: payload.value,
                inst
            });
        }
    };
});
const $ZodCIDRv4 = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCIDRv4", (inst, def)=>{
    def.pattern ?? (def.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cidrv4"]);
    $ZodStringFormat.init(inst, def);
});
const $ZodCIDRv6 = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCIDRv6", (inst, def)=>{
    def.pattern ?? (def.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cidrv6"]); // not used for validation
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload)=>{
        const [address, prefix] = payload.value.split("/");
        try {
            if (!prefix) throw new Error();
            const prefixNum = Number(prefix);
            if (`${prefixNum}` !== prefix) throw new Error();
            if (prefixNum < 0 || prefixNum > 128) throw new Error();
            new URL(`http://[${address}]`);
        } catch  {
            payload.issues.push({
                code: "invalid_format",
                format: "cidrv6",
                input: payload.value,
                inst
            });
        }
    };
});
function isValidBase64(data) {
    if (data === "") return true;
    if (data.length % 4 !== 0) return false;
    try {
        atob(data);
        return true;
    } catch  {
        return false;
    }
}
const $ZodBase64 = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodBase64", (inst, def)=>{
    def.pattern ?? (def.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["base64"]);
    $ZodStringFormat.init(inst, def);
    inst._zod.onattach.push((inst)=>{
        inst._zod.bag.contentEncoding = "base64";
    });
    inst._zod.check = (payload)=>{
        if (isValidBase64(payload.value)) return;
        payload.issues.push({
            code: "invalid_format",
            format: "base64",
            input: payload.value,
            inst
        });
    };
});
function isValidBase64URL(data) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["base64url"].test(data)) return false;
    const base64 = data.replace(/[-_]/g, (c)=>c === "-" ? "+" : "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    return isValidBase64(padded);
}
const $ZodBase64URL = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodBase64URL", (inst, def)=>{
    def.pattern ?? (def.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["base64url"]);
    $ZodStringFormat.init(inst, def);
    inst._zod.onattach.push((inst)=>{
        inst._zod.bag.contentEncoding = "base64url";
    });
    inst._zod.check = (payload)=>{
        if (isValidBase64URL(payload.value)) return;
        payload.issues.push({
            code: "invalid_format",
            format: "base64url",
            input: payload.value,
            inst
        });
    };
});
const $ZodE164 = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodE164", (inst, def)=>{
    def.pattern ?? (def.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["e164"]);
    $ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
    try {
        const tokensParts = token.split(".");
        if (tokensParts.length !== 3) return false;
        const [header] = tokensParts;
        const parsedHeader = JSON.parse(atob(header));
        if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
        if (!parsedHeader.alg) return false;
        if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
        return true;
    } catch  {
        return false;
    }
}
const $ZodJWT = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodJWT", (inst, def)=>{
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload)=>{
        if (isValidJWT(payload.value, def.alg)) return;
        payload.issues.push({
            code: "invalid_format",
            format: "jwt",
            input: payload.value,
            inst
        });
    };
});
const $ZodNumber = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodNumber", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.pattern = inst._zod.bag.pattern ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["number"];
    inst._zod.parse = (payload, _ctx)=>{
        if (def.coerce) try {
            payload.value = Number(payload.value);
        } catch (_) {}
        const input = payload.value;
        if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
            return payload;
        }
        const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : undefined : undefined;
        payload.issues.push({
            expected: "number",
            code: "invalid_type",
            input,
            inst,
            ...received ? {
                received
            } : {}
        });
        return payload;
    };
});
const $ZodNumberFormat = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodNumber", (inst, def)=>{
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckNumberFormat"].init(inst, def);
    $ZodNumber.init(inst, def); // no format checksp
});
const $ZodBoolean = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodBoolean", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"];
    inst._zod.parse = (payload, _ctx)=>{
        if (def.coerce) try {
            payload.value = Boolean(payload.value);
        } catch (_) {}
        const input = payload.value;
        if (typeof input === "boolean") return payload;
        payload.issues.push({
            expected: "boolean",
            code: "invalid_type",
            input,
            inst
        });
        return payload;
    };
});
const $ZodBigInt = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodBigInt", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["bigint"];
    inst._zod.parse = (payload, _ctx)=>{
        if (def.coerce) try {
            payload.value = BigInt(payload.value);
        } catch (_) {}
        const { value: input } = payload;
        if (typeof input === "bigint") return payload;
        payload.issues.push({
            expected: "bigint",
            code: "invalid_type",
            input,
            inst
        });
        return payload;
    };
});
const $ZodBigIntFormat = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodBigInt", (inst, def)=>{
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckBigIntFormat"].init(inst, def);
    $ZodBigInt.init(inst, def); // no format checks
});
const $ZodSymbol = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodSymbol", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx)=>{
        const { value: input } = payload;
        if (typeof input === "symbol") return payload;
        payload.issues.push({
            expected: "symbol",
            code: "invalid_type",
            input,
            inst
        });
        return payload;
    };
});
const $ZodUndefined = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodUndefined", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["undefined"];
    inst._zod.values = new Set([
        undefined
    ]);
    inst._zod.parse = (payload, _ctx)=>{
        const { value: input } = payload;
        if (typeof input === "undefined") return payload;
        payload.issues.push({
            expected: "undefined",
            code: "invalid_type",
            input,
            inst
        });
        return payload;
    };
});
const $ZodNull = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodNull", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.pattern = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["null"];
    inst._zod.values = new Set([
        null
    ]);
    inst._zod.parse = (payload, _ctx)=>{
        const { value: input } = payload;
        if (input === null) return payload;
        payload.issues.push({
            expected: "null",
            code: "invalid_type",
            input,
            inst
        });
        return payload;
    };
});
const $ZodAny = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodAny", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.parse = (payload)=>payload;
});
const $ZodUnknown = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodUnknown", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.parse = (payload)=>payload;
});
const $ZodNever = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodNever", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx)=>{
        payload.issues.push({
            expected: "never",
            code: "invalid_type",
            input: payload.value,
            inst
        });
        return payload;
    };
});
const $ZodVoid = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodVoid", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx)=>{
        const { value: input } = payload;
        if (typeof input === "undefined") return payload;
        payload.issues.push({
            expected: "void",
            code: "invalid_type",
            input,
            inst
        });
        return payload;
    };
});
const $ZodDate = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodDate", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx)=>{
        if (def.coerce) {
            try {
                payload.value = new Date(payload.value);
            } catch (_err) {}
        }
        const input = payload.value;
        const isDate = input instanceof Date;
        const isValidDate = isDate && !Number.isNaN(input.getTime());
        if (isValidDate) return payload;
        payload.issues.push({
            expected: "date",
            code: "invalid_type",
            input,
            ...isDate ? {
                received: "Invalid Date"
            } : {},
            inst
        });
        return payload;
    };
});
function handleArrayResult(result, final, index) {
    if (result.issues.length) {
        final.issues.push(...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prefixIssues"])(index, result.issues));
    }
    final.value[index] = result.value;
}
const $ZodArray = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodArray", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx)=>{
        const input = payload.value;
        if (!Array.isArray(input)) {
            payload.issues.push({
                expected: "array",
                code: "invalid_type",
                input,
                inst
            });
            return payload;
        }
        payload.value = Array(input.length);
        const proms = [];
        for(let i = 0; i < input.length; i++){
            const item = input[i];
            const result = def.element._zod.run({
                value: item,
                issues: []
            }, ctx);
            if (result instanceof Promise) {
                proms.push(result.then((result)=>handleArrayResult(result, payload, i)));
            } else {
                handleArrayResult(result, payload, i);
            }
        }
        if (proms.length) {
            return Promise.all(proms).then(()=>payload);
        }
        return payload; //handleArrayResultsAsync(parseResults, final);
    };
});
function handleObjectResult(result, final, key) {
    // if(isOptional)
    if (result.issues.length) {
        final.issues.push(...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prefixIssues"])(key, result.issues));
    }
    final.value[key] = result.value;
}
function handleOptionalObjectResult(result, final, key, input) {
    if (result.issues.length) {
        // validation failed against value schema
        if (input[key] === undefined) {
            // if input was undefined, ignore the error
            if (key in input) {
                final.value[key] = undefined;
            } else {
                final.value[key] = result.value;
            }
        } else {
            final.issues.push(...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prefixIssues"])(key, result.issues));
        }
    } else if (result.value === undefined) {
        // validation returned `undefined`
        if (key in input) final.value[key] = undefined;
    } else {
        // non-undefined value
        final.value[key] = result.value;
    }
}
const $ZodObject = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodObject", (inst, def)=>{
    $ZodType.init(inst, def);
    const _normalized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cached"])(()=>{
        const keys = Object.keys(def.shape);
        const okeys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["optionalKeys"])(def.shape);
        return {
            shape: def.shape,
            keys,
            keySet: new Set(keys),
            numKeys: keys.length,
            optionalKeys: new Set(okeys)
        };
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "disc", ()=>{
        const shape = def.shape;
        const discMap = new Map();
        let hasDisc = false;
        for(const key in shape){
            const field = shape[key]._zod;
            if (field.values || field.disc) {
                hasDisc = true;
                const o = {
                    values: new Set(field.values ?? []),
                    maps: field.disc ? [
                        field.disc
                    ] : []
                };
                discMap.set(key, o);
            }
        }
        if (!hasDisc) {
            return undefined;
        }
        return discMap;
    });
    const generateFastpass = (shape)=>{
        const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$doc$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Doc"]([
            "shape",
            "payload",
            "ctx"
        ]);
        const { keys, optionalKeys } = _normalized.value;
        const parseStr = (key)=>{
            const k = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["esc"])(key);
            return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
        };
        doc.write(`const input = payload.value;`);
        const ids = Object.create(null);
        for (const key of keys){
            ids[key] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["randomString"])(15);
        }
        // A: preserve key order {
        doc.write(`const newResult = {}`);
        for (const key of keys){
            if (optionalKeys.has(key)) {
                const id = ids[key];
                doc.write(`const ${id} = ${parseStr(key)};`);
                const k = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["esc"])(key);
                doc.write(`
        if (${id}.issues.length) {
          if (input[${k}] === undefined) {
            if (${k} in input) {
              newResult[${k}] = undefined;
            }
          } else {
            payload.issues = payload.issues.concat(
              ${id}.issues.map((iss) => ({
                ...iss,
                path: iss.path ? [${k}, ...iss.path] : [${k}],
              }))
            );
          }
        } else if (${id}.value === undefined) {
          if (${k} in input) newResult[${k}] = undefined;
        } else {
          newResult[${k}] = ${id}.value;
        }
        `);
            } else {
                const id = ids[key];
                //  const id = ids[key];
                doc.write(`const ${id} = ${parseStr(key)};`);
                doc.write(`
          if (${id}.issues.length) payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["esc"])(key)}, ...iss.path] : [${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["esc"])(key)}]
          })));`);
                doc.write(`newResult[${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["esc"])(key)}] = ${id}.value`);
            }
        }
        doc.write(`payload.value = newResult;`);
        doc.write(`return payload;`);
        const fn = doc.compile();
        return (payload, ctx)=>fn(shape, payload, ctx);
    };
    let fastpass;
    const isObject = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isObject"];
    const jit = !__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["globalConfig"].jitless;
    const allowsEval = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["allowsEval"];
    const fastEnabled = jit && allowsEval.value; // && !def.catchall;
    const { catchall } = def;
    let value;
    inst._zod.parse = (payload, ctx)=>{
        value ?? (value = _normalized.value);
        const input = payload.value;
        if (!isObject(input)) {
            payload.issues.push({
                expected: "object",
                code: "invalid_type",
                input,
                inst
            });
            return payload;
        }
        const proms = [];
        if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
            // always synchronous
            if (!fastpass) fastpass = generateFastpass(def.shape);
            payload = fastpass(payload, ctx);
        } else {
            payload.value = {};
            const shape = value.shape;
            for (const key of value.keys){
                const el = shape[key];
                // do not add omitted optional keys
                // if (!(key in input)) {
                //   if (optionalKeys.has(key)) continue;
                //   payload.issues.push({
                //     code: "invalid_type",
                //     path: [key],
                //     expected: "nonoptional",
                //     note: `Missing required key: "${key}"`,
                //     input,
                //     inst,
                //   });
                // }
                const r = el._zod.run({
                    value: input[key],
                    issues: []
                }, ctx);
                const isOptional = el._zod.optin === "optional" && el._zod.optout === "optional";
                if (r instanceof Promise) {
                    proms.push(r.then((r)=>isOptional ? handleOptionalObjectResult(r, payload, key, input) : handleObjectResult(r, payload, key)));
                } else {
                    if (isOptional) {
                        handleOptionalObjectResult(r, payload, key, input);
                    } else {
                        handleObjectResult(r, payload, key);
                    }
                }
            }
        }
        if (!catchall) {
            // return payload;
            return proms.length ? Promise.all(proms).then(()=>payload) : payload;
        }
        const unrecognized = [];
        // iterate over input keys
        const keySet = value.keySet;
        const _catchall = catchall._zod;
        const t = _catchall.def.type;
        for (const key of Object.keys(input)){
            if (keySet.has(key)) continue;
            if (t === "never") {
                unrecognized.push(key);
                continue;
            }
            const r = _catchall.run({
                value: input[key],
                issues: []
            }, ctx);
            if (r instanceof Promise) {
                proms.push(r.then((r)=>handleObjectResult(r, payload, key)));
            } else {
                handleObjectResult(r, payload, key);
            }
        }
        if (unrecognized.length) {
            payload.issues.push({
                code: "unrecognized_keys",
                keys: unrecognized,
                input,
                inst
            });
        }
        if (!proms.length) return payload;
        return Promise.all(proms).then(()=>{
            return payload;
        });
    };
});
function handleUnionResults(results, final, inst, ctx) {
    for (const result of results){
        if (result.issues.length === 0) {
            final.value = result.value;
            return final;
        }
    }
    final.issues.push({
        code: "invalid_union",
        input: final.value,
        inst,
        errors: results.map((result)=>result.issues.map((iss)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["finalizeIssue"])(iss, ctx, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["config"])())))
    });
    return final;
}
const $ZodUnion = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodUnion", (inst, def)=>{
    $ZodType.init(inst, def);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "values", ()=>{
        if (def.options.every((o)=>o._zod.values)) {
            return new Set(def.options.flatMap((option)=>Array.from(option._zod.values)));
        }
        return undefined;
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "pattern", ()=>{
        if (def.options.every((o)=>o._zod.pattern)) {
            const patterns = def.options.map((o)=>o._zod.pattern);
            return new RegExp(`^(${patterns.map((p)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanRegex"])(p.source)).join("|")})$`);
        }
        return undefined;
    });
    inst._zod.parse = (payload, ctx)=>{
        let async = false;
        const results = [];
        for (const option of def.options){
            const result = option._zod.run({
                value: payload.value,
                issues: []
            }, ctx);
            if (result instanceof Promise) {
                results.push(result);
                async = true;
            } else {
                if (result.issues.length === 0) return result;
                results.push(result);
            }
        }
        if (!async) return handleUnionResults(results, payload, inst, ctx);
        return Promise.all(results).then((results)=>{
            return handleUnionResults(results, payload, inst, ctx);
        });
    };
});
function matchDiscriminatorAtKey(input, key, disc) {
    let matched = true;
    const data = input?.[key];
    if (disc.values.size && !disc.values.has(data)) {
        matched = false;
    }
    if (disc.maps.length > 0) {
        for (const m of disc.maps){
            if (!matchDiscriminators(data, m)) {
                matched = false;
            }
        }
    }
    return matched;
}
function matchDiscriminators(input, discs) {
    let matched = true;
    for (const [key, value] of discs){
        if (!matchDiscriminatorAtKey(input, key, value)) {
            matched = false;
        }
    }
    return matched;
}
const $ZodDiscriminatedUnion = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodDiscriminatedUnion", (inst, def)=>{
    $ZodUnion.init(inst, def);
    const _super = inst._zod.parse;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "disc", ()=>{
        const _disc = new Map();
        for (const el of def.options){
            const subdisc = el._zod.disc;
            if (!subdisc) throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(el)}"`);
            for (const [key, o] of subdisc){
                if (!_disc.has(key)) _disc.set(key, {
                    values: new Set(),
                    maps: []
                });
                const _o = _disc.get(key);
                for (const v of o.values){
                    _o.values.add(v);
                }
                for (const m of o.maps)_o.maps.push(m);
            }
        }
        return _disc;
    });
    const _discmap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cached"])(()=>{
        const map = new Map();
        for (const o of def.options){
            const discEl = o._zod.disc?.get(def.discriminator);
            if (!discEl) throw new Error("Invalid discriminated union option");
            map.set(o, discEl);
        }
        return map;
    });
    inst._zod.parse = (payload, ctx)=>{
        const input = payload.value;
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isObject"])(input)) {
            payload.issues.push({
                code: "invalid_type",
                expected: "object",
                input,
                inst
            });
            return payload;
        }
        const filtered = [];
        const discmap = _discmap.value;
        for (const option of def.options){
            const subdisc = discmap.get(option);
            if (matchDiscriminatorAtKey(input, def.discriminator, subdisc)) {
                filtered.push(option);
            }
        }
        if (filtered.length === 1) return filtered[0]._zod.run(payload, ctx);
        if (def.unionFallback) {
            return _super(payload, ctx);
        }
        // no matching discriminator
        payload.issues.push({
            code: "invalid_union",
            errors: [],
            note: "No matching discriminator",
            input,
            path: [
                def.discriminator
            ],
            inst
        });
        return payload;
    };
});
const $ZodIntersection = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodIntersection", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx)=>{
        const { value: input } = payload;
        const left = def.left._zod.run({
            value: input,
            issues: []
        }, ctx);
        const right = def.right._zod.run({
            value: input,
            issues: []
        }, ctx);
        const async = left instanceof Promise || right instanceof Promise;
        if (async) {
            return Promise.all([
                left,
                right
            ]).then(([left, right])=>{
                return handleIntersectionResults(payload, left, right);
            });
        }
        return handleIntersectionResults(payload, left, right);
    };
});
function mergeValues(a, b) {
    // const aType = parse.t(a);
    // const bType = parse.t(b);
    if (a === b) {
        return {
            valid: true,
            data: a
        };
    }
    if (a instanceof Date && b instanceof Date && +a === +b) {
        return {
            valid: true,
            data: a
        };
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPlainObject"])(a) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPlainObject"])(b)) {
        const bKeys = Object.keys(b);
        const sharedKeys = Object.keys(a).filter((key)=>bKeys.indexOf(key) !== -1);
        const newObj = {
            ...a,
            ...b
        };
        for (const key of sharedKeys){
            const sharedValue = mergeValues(a[key], b[key]);
            if (!sharedValue.valid) {
                return {
                    valid: false,
                    mergeErrorPath: [
                        key,
                        ...sharedValue.mergeErrorPath
                    ]
                };
            }
            newObj[key] = sharedValue.data;
        }
        return {
            valid: true,
            data: newObj
        };
    }
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return {
                valid: false,
                mergeErrorPath: []
            };
        }
        const newArray = [];
        for(let index = 0; index < a.length; index++){
            const itemA = a[index];
            const itemB = b[index];
            const sharedValue = mergeValues(itemA, itemB);
            if (!sharedValue.valid) {
                return {
                    valid: false,
                    mergeErrorPath: [
                        index,
                        ...sharedValue.mergeErrorPath
                    ]
                };
            }
            newArray.push(sharedValue.data);
        }
        return {
            valid: true,
            data: newArray
        };
    }
    return {
        valid: false,
        mergeErrorPath: []
    };
}
function handleIntersectionResults(result, left, right) {
    if (left.issues.length) {
        result.issues.push(...left.issues);
    }
    if (right.issues.length) {
        result.issues.push(...right.issues);
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aborted"])(result)) return result;
    const merged = mergeValues(left.value, right.value);
    if (!merged.valid) {
        throw new Error(`Unmergable intersection. Error path: ` + `${JSON.stringify(merged.mergeErrorPath)}`);
    }
    result.value = merged.data;
    return result;
}
const $ZodTuple = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodTuple", (inst, def)=>{
    $ZodType.init(inst, def);
    const items = def.items;
    const optStart = items.length - [
        ...items
    ].reverse().findIndex((item)=>item._zod.optin !== "optional");
    inst._zod.parse = (payload, ctx)=>{
        const input = payload.value;
        if (!Array.isArray(input)) {
            payload.issues.push({
                input,
                inst,
                expected: "tuple",
                code: "invalid_type"
            });
            return payload;
        }
        payload.value = [];
        const proms = [];
        if (!def.rest) {
            const tooBig = input.length > items.length;
            const tooSmall = input.length < optStart - 1;
            if (tooBig || tooSmall) {
                payload.issues.push({
                    input,
                    inst,
                    origin: "array",
                    ...tooBig ? {
                        code: "too_big",
                        maximum: items.length
                    } : {
                        code: "too_small",
                        minimum: items.length
                    }
                });
                return payload;
            }
        }
        let i = -1;
        for (const item of items){
            i++;
            if (i >= input.length) {
                if (i >= optStart) continue;
            }
            const result = item._zod.run({
                value: input[i],
                issues: []
            }, ctx);
            if (result instanceof Promise) {
                proms.push(result.then((result)=>handleTupleResult(result, payload, i)));
            } else {
                handleTupleResult(result, payload, i);
            }
        }
        if (def.rest) {
            const rest = input.slice(items.length);
            for (const el of rest){
                i++;
                const result = def.rest._zod.run({
                    value: el,
                    issues: []
                }, ctx);
                if (result instanceof Promise) {
                    proms.push(result.then((result)=>handleTupleResult(result, payload, i)));
                } else {
                    handleTupleResult(result, payload, i);
                }
            }
        }
        if (proms.length) return Promise.all(proms).then(()=>payload);
        return payload;
    };
});
function handleTupleResult(result, final, index) {
    if (result.issues.length) {
        final.issues.push(...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prefixIssues"])(index, result.issues));
    }
    final.value[index] = result.value;
}
const $ZodRecord = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodRecord", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx)=>{
        const input = payload.value;
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPlainObject"])(input)) {
            payload.issues.push({
                expected: "record",
                code: "invalid_type",
                input,
                inst
            });
            return payload;
        }
        const proms = [];
        if (def.keyType._zod.values) {
            const values = def.keyType._zod.values;
            payload.value = {};
            for (const key of values){
                if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
                    const result = def.valueType._zod.run({
                        value: input[key],
                        issues: []
                    }, ctx);
                    if (result instanceof Promise) {
                        proms.push(result.then((result)=>{
                            if (result.issues.length) {
                                payload.issues.push(...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prefixIssues"])(key, result.issues));
                            }
                            payload.value[key] = result.value;
                        }));
                    } else {
                        if (result.issues.length) {
                            payload.issues.push(...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prefixIssues"])(key, result.issues));
                        }
                        payload.value[key] = result.value;
                    }
                }
            }
            let unrecognized;
            for(const key in input){
                if (!values.has(key)) {
                    unrecognized = unrecognized ?? [];
                    unrecognized.push(key);
                }
            }
            if (unrecognized && unrecognized.length > 0) {
                payload.issues.push({
                    code: "unrecognized_keys",
                    input,
                    inst,
                    keys: unrecognized
                });
            }
        } else {
            payload.value = {};
            for (const key of Reflect.ownKeys(input)){
                if (key === "__proto__") continue;
                const keyResult = def.keyType._zod.run({
                    value: key,
                    issues: []
                }, ctx);
                if (keyResult instanceof Promise) {
                    throw new Error("Async schemas not supported in object keys currently");
                }
                if (keyResult.issues.length) {
                    payload.issues.push({
                        origin: "record",
                        code: "invalid_key",
                        issues: keyResult.issues.map((iss)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["finalizeIssue"])(iss, ctx, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["config"])())),
                        input: key,
                        path: [
                            key
                        ],
                        inst
                    });
                    payload.value[keyResult.value] = keyResult.value;
                    continue;
                }
                const result = def.valueType._zod.run({
                    value: input[key],
                    issues: []
                }, ctx);
                if (result instanceof Promise) {
                    proms.push(result.then((result)=>{
                        if (result.issues.length) {
                            payload.issues.push(...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prefixIssues"])(key, result.issues));
                        }
                        payload.value[keyResult.value] = result.value;
                    }));
                } else {
                    if (result.issues.length) {
                        payload.issues.push(...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prefixIssues"])(key, result.issues));
                    }
                    payload.value[keyResult.value] = result.value;
                }
            }
        }
        if (proms.length) {
            return Promise.all(proms).then(()=>payload);
        }
        return payload;
    };
});
const $ZodMap = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodMap", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx)=>{
        const input = payload.value;
        if (!(input instanceof Map)) {
            payload.issues.push({
                expected: "map",
                code: "invalid_type",
                input,
                inst
            });
            return payload;
        }
        const proms = [];
        payload.value = new Map();
        for (const [key, value] of input){
            const keyResult = def.keyType._zod.run({
                value: key,
                issues: []
            }, ctx);
            const valueResult = def.valueType._zod.run({
                value: value,
                issues: []
            }, ctx);
            if (keyResult instanceof Promise || valueResult instanceof Promise) {
                proms.push(Promise.all([
                    keyResult,
                    valueResult
                ]).then(([keyResult, valueResult])=>{
                    handleMapResult(keyResult, valueResult, payload, key, input, inst, ctx);
                }));
            } else {
                handleMapResult(keyResult, valueResult, payload, key, input, inst, ctx);
            }
        }
        if (proms.length) return Promise.all(proms).then(()=>payload);
        return payload;
    };
});
function handleMapResult(keyResult, valueResult, final, key, input, inst, ctx) {
    if (keyResult.issues.length) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["propertyKeyTypes"].has(typeof key)) {
            final.issues.push(...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prefixIssues"])(key, keyResult.issues));
        } else {
            final.issues.push({
                origin: "map",
                code: "invalid_key",
                input,
                inst,
                issues: keyResult.issues.map((iss)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["finalizeIssue"])(iss, ctx, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["config"])()))
            });
        }
    }
    if (valueResult.issues.length) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["propertyKeyTypes"].has(typeof key)) {
            final.issues.push(...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prefixIssues"])(key, valueResult.issues));
        } else {
            final.issues.push({
                origin: "map",
                code: "invalid_element",
                input,
                inst,
                key: key,
                issues: valueResult.issues.map((iss)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["finalizeIssue"])(iss, ctx, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["config"])()))
            });
        }
    }
    final.value.set(keyResult.value, valueResult.value);
}
const $ZodSet = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodSet", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx)=>{
        const input = payload.value;
        if (!(input instanceof Set)) {
            payload.issues.push({
                input,
                inst,
                expected: "set",
                code: "invalid_type"
            });
            return payload;
        }
        const proms = [];
        payload.value = new Set();
        for (const item of input){
            const result = def.valueType._zod.run({
                value: item,
                issues: []
            }, ctx);
            if (result instanceof Promise) {
                proms.push(result.then((result)=>handleSetResult(result, payload)));
            } else handleSetResult(result, payload);
        }
        if (proms.length) return Promise.all(proms).then(()=>payload);
        return payload;
    };
});
function handleSetResult(result, final) {
    if (result.issues.length) {
        final.issues.push(...result.issues);
    }
    final.value.add(result.value);
}
const $ZodEnum = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodEnum", (inst, def)=>{
    $ZodType.init(inst, def);
    const numericValues = Object.values(def.entries).filter((v)=>typeof v === "number");
    const values = Object.entries(def.entries).filter(([k, _])=>numericValues.indexOf(+k) === -1).map(([_, v])=>v);
    inst._zod.values = new Set(values);
    inst._zod.pattern = new RegExp(`^(${values.filter((k)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["propertyKeyTypes"].has(typeof k)).map((o)=>typeof o === "string" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["escapeRegex"])(o) : o.toString()).join("|")})$`);
    inst._zod.parse = (payload, _ctx)=>{
        const input = payload.value;
        if (inst._zod.values.has(input)) {
            return payload;
        }
        payload.issues.push({
            code: "invalid_value",
            values,
            input,
            inst
        });
        return payload;
    };
});
const $ZodLiteral = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodLiteral", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.values = new Set(def.values);
    inst._zod.pattern = new RegExp(`^(${def.values.map((o)=>typeof o === "string" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["escapeRegex"])(o) : o ? o.toString() : String(o)).join("|")})$`);
    inst._zod.parse = (payload, _ctx)=>{
        const input = payload.value;
        if (inst._zod.values.has(input)) {
            return payload;
        }
        payload.issues.push({
            code: "invalid_value",
            values: def.values,
            input,
            inst
        });
        return payload;
    };
});
const $ZodFile = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodFile", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx)=>{
        const input = payload.value;
        if (input instanceof File) return payload;
        payload.issues.push({
            expected: "file",
            code: "invalid_type",
            input,
            inst
        });
        return payload;
    };
});
const $ZodTransform = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodTransform", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx)=>{
        const _out = def.transform(payload.value, payload);
        if (_ctx.async) {
            const output = _out instanceof Promise ? _out : Promise.resolve(_out);
            return output.then((output)=>{
                payload.value = output;
                return payload;
            });
        }
        if (_out instanceof Promise) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodAsyncError"]();
        }
        payload.value = _out;
        return payload;
    };
});
const $ZodOptional = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodOptional", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    inst._zod.optout = "optional";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "values", ()=>{
        return def.innerType._zod.values ? new Set([
            ...def.innerType._zod.values,
            undefined
        ]) : undefined;
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "pattern", ()=>{
        const pattern = def.innerType._zod.pattern;
        return pattern ? new RegExp(`^(${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanRegex"])(pattern.source)})?$`) : undefined;
    });
    inst._zod.parse = (payload, ctx)=>{
        if (payload.value === undefined) {
            return payload;
        }
        return def.innerType._zod.run(payload, ctx);
    };
});
const $ZodNullable = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodNullable", (inst, def)=>{
    $ZodType.init(inst, def);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "optin", ()=>def.innerType._zod.optin);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "optout", ()=>def.innerType._zod.optout);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "pattern", ()=>{
        const pattern = def.innerType._zod.pattern;
        return pattern ? new RegExp(`^(${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanRegex"])(pattern.source)}|null)$`) : undefined;
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "values", ()=>{
        return def.innerType._zod.values ? new Set([
            ...def.innerType._zod.values,
            null
        ]) : undefined;
    });
    inst._zod.parse = (payload, ctx)=>{
        if (payload.value === null) return payload;
        return def.innerType._zod.run(payload, ctx);
    };
});
const $ZodDefault = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodDefault", (inst, def)=>{
    $ZodType.init(inst, def);
    // inst._zod.qin = "true";
    inst._zod.optin = "optional";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "values", ()=>def.innerType._zod.values);
    inst._zod.parse = (payload, ctx)=>{
        if (payload.value === undefined) {
            payload.value = def.defaultValue;
            /**
             * $ZodDefault always returns the default value immediately.
             * It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */ return payload;
        }
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then((result)=>handleDefaultResult(result, def));
        }
        return handleDefaultResult(result, def);
    };
});
function handleDefaultResult(payload, def) {
    if (payload.value === undefined) {
        payload.value = def.defaultValue;
    }
    return payload;
}
const $ZodPrefault = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodPrefault", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "values", ()=>def.innerType._zod.values);
    inst._zod.parse = (payload, ctx)=>{
        if (payload.value === undefined) {
            payload.value = def.defaultValue;
        }
        return def.innerType._zod.run(payload, ctx);
    };
});
const $ZodNonOptional = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodNonOptional", (inst, def)=>{
    $ZodType.init(inst, def);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "values", ()=>{
        const v = def.innerType._zod.values;
        return v ? new Set([
            ...v
        ].filter((x)=>x !== undefined)) : undefined;
    });
    inst._zod.parse = (payload, ctx)=>{
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then((result)=>handleNonOptionalResult(result, inst));
        }
        return handleNonOptionalResult(result, inst);
    };
});
function handleNonOptionalResult(payload, inst) {
    if (!payload.issues.length && payload.value === undefined) {
        payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: payload.value,
            inst
        });
    }
    return payload;
}
const $ZodSuccess = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodSuccess", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx)=>{
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then((result)=>{
                payload.value = result.issues.length === 0;
                return payload;
            });
        }
        payload.value = result.issues.length === 0;
        return payload;
    };
});
const $ZodCatch = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCatch", (inst, def)=>{
    $ZodType.init(inst, def);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "optin", ()=>def.innerType._zod.optin);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "optout", ()=>def.innerType._zod.optout);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "values", ()=>def.innerType._zod.values);
    inst._zod.parse = (payload, ctx)=>{
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then((result)=>{
                payload.value = result.value;
                if (result.issues.length) {
                    payload.value = def.catchValue({
                        ...payload,
                        error: {
                            issues: result.issues.map((iss)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["finalizeIssue"])(iss, ctx, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["config"])()))
                        },
                        input: payload.value
                    });
                    payload.issues = [];
                }
                return payload;
            });
        }
        payload.value = result.value;
        if (result.issues.length) {
            payload.value = def.catchValue({
                ...payload,
                error: {
                    issues: result.issues.map((iss)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["finalizeIssue"])(iss, ctx, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["config"])()))
                },
                input: payload.value
            });
            payload.issues = [];
        }
        return payload;
    };
});
const $ZodNaN = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodNaN", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx)=>{
        if (typeof payload.value !== "number" || !Number.isNaN(payload.value)) {
            payload.issues.push({
                input: payload.value,
                inst,
                expected: "nan",
                code: "invalid_type"
            });
            return payload;
        }
        return payload;
    };
});
const $ZodPipe = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodPipe", (inst, def)=>{
    $ZodType.init(inst, def);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "values", ()=>def.in._zod.values);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "optin", ()=>def.in._zod.optin);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "optout", ()=>def.out._zod.optout);
    inst._zod.parse = (payload, ctx)=>{
        const left = def.in._zod.run(payload, ctx);
        if (left instanceof Promise) {
            return left.then((left)=>handlePipeResult(left, def, ctx));
        }
        return handlePipeResult(left, def, ctx);
    };
});
function handlePipeResult(left, def, ctx) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aborted"])(left)) {
        return left;
    }
    return def.out._zod.run({
        value: left.value,
        issues: left.issues
    }, ctx);
}
const $ZodReadonly = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodReadonly", (inst, def)=>{
    $ZodType.init(inst, def);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "disc", ()=>def.innerType._zod.disc);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "optin", ()=>def.innerType._zod.optin);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "optout", ()=>def.innerType._zod.optout);
    inst._zod.parse = (payload, ctx)=>{
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then(handleReadonlyResult);
        }
        return handleReadonlyResult(result);
    };
});
function handleReadonlyResult(payload) {
    payload.value = Object.freeze(payload.value);
    return payload;
}
const $ZodTemplateLiteral = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodTemplateLiteral", (inst, def)=>{
    $ZodType.init(inst, def);
    const regexParts = [];
    for (const part of def.parts){
        if (part instanceof $ZodType) {
            if (!part._zod.pattern) {
                // if (!source)
                throw new Error(`Invalid template literal part, no pattern found: ${[
                    ...part._zod.traits
                ].shift()}`);
            }
            const source = part._zod.pattern instanceof RegExp ? part._zod.pattern.source : part._zod.pattern;
            if (!source) throw new Error(`Invalid template literal part: ${part._zod.traits}`);
            const start = source.startsWith("^") ? 1 : 0;
            const end = source.endsWith("$") ? source.length - 1 : source.length;
            regexParts.push(source.slice(start, end));
        } else if (part === null || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["primitiveTypes"].has(typeof part)) {
            regexParts.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["escapeRegex"])(`${part}`));
        } else {
            throw new Error(`Invalid template literal part: ${part}`);
        }
    }
    inst._zod.pattern = new RegExp(`^${regexParts.join("")}$`);
    inst._zod.parse = (payload, _ctx)=>{
        if (typeof payload.value !== "string") {
            payload.issues.push({
                input: payload.value,
                inst,
                expected: "template_literal",
                code: "invalid_type"
            });
            return payload;
        }
        inst._zod.pattern.lastIndex = 0;
        if (!inst._zod.pattern.test(payload.value)) {
            payload.issues.push({
                input: payload.value,
                inst,
                code: "invalid_format",
                format: "template_literal",
                pattern: inst._zod.pattern.source
            });
            return payload;
        }
        return payload;
    };
});
const $ZodPromise = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodPromise", (inst, def)=>{
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx)=>{
        return Promise.resolve(payload.value).then((inner)=>def.innerType._zod.run({
                value: inner,
                issues: []
            }, ctx));
    };
});
const $ZodLazy = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodLazy", (inst, def)=>{
    $ZodType.init(inst, def);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "innerType", ()=>def.getter());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "pattern", ()=>inst._zod.innerType._zod.pattern);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "disc", ()=>inst._zod.innerType._zod.disc);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "optin", ()=>inst._zod.innerType._zod.optin);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineLazy"])(inst._zod, "optout", ()=>inst._zod.innerType._zod.optout);
    inst._zod.parse = (payload, ctx)=>{
        const inner = inst._zod.innerType;
        return inner._zod.run(payload, ctx);
    };
});
const $ZodCustom = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$constructor"])("$ZodCustom", (inst, def)=>{
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheck"].init(inst, def);
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _)=>{
        return payload;
    };
    inst._zod.check = (payload)=>{
        const input = payload.value;
        const r = def.fn(input);
        if (r instanceof Promise) {
            return r.then((r)=>handleRefineResult(r, payload, input, inst));
        }
        handleRefineResult(r, payload, input, inst);
        return;
    };
});
function handleRefineResult(result, payload, input, inst) {
    if (!result) {
        const _iss = {
            code: "custom",
            input,
            inst,
            path: [
                ...inst._zod.def.path ?? []
            ],
            continue: !inst._zod.def.abort
        };
        if (inst._zod.def.params) _iss.params = inst._zod.def.params;
        payload.issues.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["issue"])(_iss));
    }
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/schemas.js [app-route] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/checks.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/core.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$doc$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/doc.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$parse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/parse.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/regexes.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$versions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/versions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/schemas.js [app-route] (ecmascript) <locals>");
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ar.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "حرف",
        verb: "أن يحوي"
    },
    file: {
        unit: "بايت",
        verb: "أن يحوي"
    },
    array: {
        unit: "عنصر",
        verb: "أن يحوي"
    },
    set: {
        unit: "عنصر",
        verb: "أن يحوي"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "number";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "مدخل",
    email: "بريد إلكتروني",
    url: "رابط",
    emoji: "إيموجي",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "تاريخ ووقت بمعيار ISO",
    date: "تاريخ بمعيار ISO",
    time: "وقت بمعيار ISO",
    duration: "مدة بمعيار ISO",
    ipv4: "عنوان IPv4",
    ipv6: "عنوان IPv6",
    cidrv4: "مدى عناوين بصيغة IPv4",
    cidrv6: "مدى عناوين بصيغة IPv6",
    base64: "نَص بترميز base64-encoded",
    base64url: "نَص بترميز base64url-encoded",
    json_string: "نَص على هيئة JSON",
    e164: "رقم هاتف بمعيار E.164",
    jwt: "JWT",
    template_literal: "مدخل"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `مدخلات غير مقبولة: يفترض إدخال ${issue.expected}، ولكن تم إدخال ${parsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `مدخلات غير مقبولة: يفترض إدخال ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `اختيار غير مقبول: يتوقع انتقاء أحد هذه الخيارات: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return ` أكبر من اللازم: يفترض أن تكون ${issue.origin ?? "القيمة"} ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "عنصر"}`;
                return `أكبر من اللازم: يفترض أن تكون ${issue.origin ?? "القيمة"} ${adj} ${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `أصغر من اللازم: يفترض لـ ${issue.origin} أن يكون ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `أصغر من اللازم: يفترض لـ ${issue.origin} أن يكون ${adj} ${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `نَص غير مقبول: يجب أن يبدأ بـ "${issue.prefix}"`;
                if (_issue.format === "ends_with") return `نَص غير مقبول: يجب أن ينتهي بـ "${_issue.suffix}"`;
                if (_issue.format === "includes") return `نَص غير مقبول: يجب أن يتضمَّن "${_issue.includes}"`;
                if (_issue.format === "regex") return `نَص غير مقبول: يجب أن يطابق النمط ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} غير مقبول`;
            }
        case "not_multiple_of":
            return `رقم غير مقبول: يجب أن يكون من مضاعفات ${issue.divisor}`;
        case "unrecognized_keys":
            return `معرف${issue.keys.length > 1 ? "ات" : ""} غريب${issue.keys.length > 1 ? "ة" : ""}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, "، ")}`;
        case "invalid_key":
            return `معرف غير مقبول في ${issue.origin}`;
        case "invalid_union":
            return "مدخل غير مقبول";
        case "invalid_element":
            return `مدخل غير مقبول في ${issue.origin}`;
        default:
            return "مدخل غير مقبول";
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/az.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "simvol",
        verb: "olmalıdır"
    },
    file: {
        unit: "bayt",
        verb: "olmalıdır"
    },
    array: {
        unit: "element",
        verb: "olmalıdır"
    },
    set: {
        unit: "element",
        verb: "olmalıdır"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "number";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    jwt: "JWT",
    template_literal: "input"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Yanlış dəyər: gözlənilən ${issue.expected}, daxil olan ${parsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Yanlış dəyər: gözlənilən ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Yanlış seçim: aşağıdakılardan biri olmalıdır: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `Çox böyük: gözlənilən ${issue.origin ?? "dəyər"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "element"}`;
                return `Çox böyük: gözlənilən ${issue.origin ?? "dəyər"} ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) return `Çox kiçik: gözlənilən ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                return `Çox kiçik: gözlənilən ${issue.origin} ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `Yanlış mətn: "${_issue.prefix}" ilə başlamalıdır`;
                if (_issue.format === "ends_with") return `Yanlış mətn: "${_issue.suffix}" ilə bitməlidir`;
                if (_issue.format === "includes") return `Yanlış mətn: "${_issue.includes}" daxil olmalıdır`;
                if (_issue.format === "regex") return `Yanlış mətn: ${_issue.pattern} şablonuna uyğun olmalıdır`;
                return `Yanlış ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `Yanlış ədəd: ${issue.divisor} ilə bölünə bilən olmalıdır`;
        case "unrecognized_keys":
            return `Tanınmayan açar${issue.keys.length > 1 ? "lar" : ""}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `${issue.origin} daxilində yanlış açar`;
        case "invalid_union":
            return "Yanlış dəyər";
        case "invalid_element":
            return `${issue.origin} daxilində yanlış dəyər`;
        default:
            return `Yanlış dəyər`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/be.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
function getBelarusianPlural(count, one, few, many) {
    const absCount = Math.abs(count);
    const lastDigit = absCount % 10;
    const lastTwoDigits = absCount % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return many;
    }
    if (lastDigit === 1) {
        return one;
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
        return few;
    }
    return many;
}
const Sizable = {
    string: {
        unit: {
            one: "сімвал",
            few: "сімвалы",
            many: "сімвалаў"
        },
        verb: "мець"
    },
    array: {
        unit: {
            one: "элемент",
            few: "элементы",
            many: "элементаў"
        },
        verb: "мець"
    },
    set: {
        unit: {
            one: "элемент",
            few: "элементы",
            many: "элементаў"
        },
        verb: "мець"
    },
    file: {
        unit: {
            one: "байт",
            few: "байты",
            many: "байтаў"
        },
        verb: "мець"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "лік";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "масіў";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "увод",
    email: "email адрас",
    url: "URL",
    emoji: "эмодзі",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO дата і час",
    date: "ISO дата",
    time: "ISO час",
    duration: "ISO працягласць",
    ipv4: "IPv4 адрас",
    ipv6: "IPv6 адрас",
    cidrv4: "IPv4 дыяпазон",
    cidrv6: "IPv6 дыяпазон",
    base64: "радок у фармаце base64",
    base64url: "радок у фармаце base64url",
    json_string: "JSON радок",
    e164: "нумар E.164",
    jwt: "JWT",
    template_literal: "увод"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Няправільны ўвод: чакаўся ${issue.expected}, атрымана ${parsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Няправільны ўвод: чакалася ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Няправільны варыянт: чакаўся адзін з ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    const maxValue = Number(issue.maximum);
                    const unit = getBelarusianPlural(maxValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
                    return `Занадта вялікі: чакалася, што ${issue.origin ?? "значэнне"} павінна ${sizing.verb} ${adj}${issue.maximum.toString()} ${unit}`;
                }
                return `Занадта вялікі: чакалася, што ${issue.origin ?? "значэнне"} павінна быць ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    const minValue = Number(issue.minimum);
                    const unit = getBelarusianPlural(minValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
                    return `Занадта малы: чакалася, што ${issue.origin} павінна ${sizing.verb} ${adj}${issue.minimum.toString()} ${unit}`;
                }
                return `Занадта малы: чакалася, што ${issue.origin} павінна быць ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `Няправільны радок: павінен пачынацца з "${_issue.prefix}"`;
                if (_issue.format === "ends_with") return `Няправільны радок: павінен заканчвацца на "${_issue.suffix}"`;
                if (_issue.format === "includes") return `Няправільны радок: павінен змяшчаць "${_issue.includes}"`;
                if (_issue.format === "regex") return `Няправільны радок: павінен адпавядаць шаблону ${_issue.pattern}`;
                return `Няправільны ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `Няправільны лік: павінен быць кратным ${issue.divisor}`;
        case "unrecognized_keys":
            return `Нераспазнаны ${issue.keys.length > 1 ? "ключы" : "ключ"}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `Няправільны ключ у ${issue.origin}`;
        case "invalid_union":
            return "Няправільны ўвод";
        case "invalid_element":
            return `Няправільнае значэнне ў ${issue.origin}`;
        default:
            return `Няправільны ўвод`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ca.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "caràcters",
        verb: "contenir"
    },
    file: {
        unit: "bytes",
        verb: "contenir"
    },
    array: {
        unit: "elements",
        verb: "contenir"
    },
    set: {
        unit: "elements",
        verb: "contenir"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "number";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "entrada",
    email: "adreça electrònica",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data i hora ISO",
    date: "data ISO",
    time: "hora ISO",
    duration: "durada ISO",
    ipv4: "adreça IPv4",
    ipv6: "adreça IPv6",
    cidrv4: "rang IPv4",
    cidrv6: "rang IPv6",
    base64: "cadena codificada en base64",
    base64url: "cadena codificada en base64url",
    json_string: "cadena JSON",
    e164: "número E.164",
    jwt: "JWT",
    template_literal: "entrada"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Tipus invàlid: s'esperava ${issue.expected}, s'ha rebut ${parsedType(issue.input)}`;
        // return `Tipus invàlid: s'esperava ${issue.expected}, s'ha rebut ${util.getParsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Valor invàlid: s'esperava ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Opció invàlida: s'esperava una de ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, " o ")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "com a màxim" : "menys de";
                const sizing = getSizing(issue.origin);
                if (sizing) return `Massa gran: s'esperava que ${issue.origin ?? "el valor"} contingués ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
                return `Massa gran: s'esperava que ${issue.origin ?? "el valor"} fos ${adj} ${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? "com a mínim" : "més de";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Massa petit: s'esperava que ${issue.origin} contingués ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Massa petit: s'esperava que ${issue.origin} fos ${adj} ${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Format invàlid: ha de començar amb "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with") return `Format invàlid: ha d'acabar amb "${_issue.suffix}"`;
                if (_issue.format === "includes") return `Format invàlid: ha d'incloure "${_issue.includes}"`;
                if (_issue.format === "regex") return `Format invàlid: ha de coincidir amb el patró ${_issue.pattern}`;
                return `Format invàlid per a ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `Número invàlid: ha de ser múltiple de ${issue.divisor}`;
        case "unrecognized_keys":
            return `Clau${issue.keys.length > 1 ? "s" : ""} no reconeguda${issue.keys.length > 1 ? "s" : ""}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `Clau invàlida a ${issue.origin}`;
        case "invalid_union":
            return "Entrada invàlida"; // Could also be "Tipus d'unió invàlid" but "Entrada invàlida" is more general
        case "invalid_element":
            return `Element invàlid a ${issue.origin}`;
        default:
            return `Entrada invàlida`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/cs.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "znaků",
        verb: "mít"
    },
    file: {
        unit: "bajtů",
        verb: "mít"
    },
    array: {
        unit: "prvků",
        verb: "mít"
    },
    set: {
        unit: "prvků",
        verb: "mít"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "číslo";
            }
        case "string":
            {
                return "řetězec";
            }
        case "boolean":
            {
                return "boolean";
            }
        case "bigint":
            {
                return "bigint";
            }
        case "function":
            {
                return "funkce";
            }
        case "symbol":
            {
                return "symbol";
            }
        case "undefined":
            {
                return "undefined";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "pole";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "regulární výraz",
    email: "e-mailová adresa",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "datum a čas ve formátu ISO",
    date: "datum ve formátu ISO",
    time: "čas ve formátu ISO",
    duration: "doba trvání ISO",
    ipv4: "IPv4 adresa",
    ipv6: "IPv6 adresa",
    cidrv4: "rozsah IPv4",
    cidrv6: "rozsah IPv6",
    base64: "řetězec zakódovaný ve formátu base64",
    base64url: "řetězec zakódovaný ve formátu base64url",
    json_string: "řetězec ve formátu JSON",
    e164: "číslo E.164",
    jwt: "JWT",
    template_literal: "vstup"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Neplatný vstup: očekáváno ${issue.expected}, obdrženo ${parsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Neplatný vstup: očekáváno ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Neplatná možnost: očekávána jedna z hodnot ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Hodnota je příliš velká: ${issue.origin ?? "hodnota"} musí mít ${adj}${issue.maximum.toString()} ${sizing.unit ?? "prvků"}`;
                }
                return `Hodnota je příliš velká: ${issue.origin ?? "hodnota"} musí být ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Hodnota je příliš malá: ${issue.origin ?? "hodnota"} musí mít ${adj}${issue.minimum.toString()} ${sizing.unit ?? "prvků"}`;
                }
                return `Hodnota je příliš malá: ${issue.origin ?? "hodnota"} musí být ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `Neplatný řetězec: musí začínat na "${_issue.prefix}"`;
                if (_issue.format === "ends_with") return `Neplatný řetězec: musí končit na "${_issue.suffix}"`;
                if (_issue.format === "includes") return `Neplatný řetězec: musí obsahovat "${_issue.includes}"`;
                if (_issue.format === "regex") return `Neplatný řetězec: musí odpovídat vzoru ${_issue.pattern}`;
                return `Neplatný formát ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `Neplatné číslo: musí být násobkem ${issue.divisor}`;
        case "unrecognized_keys":
            return `Neznámé klíče: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `Neplatný klíč v ${issue.origin}`;
        case "invalid_union":
            return "Neplatný vstup";
        case "invalid_element":
            return `Neplatná hodnota v ${issue.origin}`;
        default:
            return `Neplatný vstup`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/de.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "Zeichen",
        verb: "zu haben"
    },
    file: {
        unit: "Bytes",
        verb: "zu haben"
    },
    array: {
        unit: "Elemente",
        verb: "zu haben"
    },
    set: {
        unit: "Elemente",
        verb: "zu haben"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "Zahl";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "Array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "Eingabe",
    email: "E-Mail-Adresse",
    url: "URL",
    emoji: "Emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-Datum und -Uhrzeit",
    date: "ISO-Datum",
    time: "ISO-Uhrzeit",
    duration: "ISO-Dauer",
    ipv4: "IPv4-Adresse",
    ipv6: "IPv6-Adresse",
    cidrv4: "IPv4-Bereich",
    cidrv6: "IPv6-Bereich",
    base64: "Base64-codierter String",
    base64url: "Base64-URL-codierter String",
    json_string: "JSON-String",
    e164: "E.164-Nummer",
    jwt: "JWT",
    template_literal: "Eingabe"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Ungültige Eingabe: erwartet ${issue.expected}, erhalten ${parsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Ungültige Eingabe: erwartet ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Ungültige Option: erwartet eine von ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `Zu groß: erwartet, dass ${issue.origin ?? "Wert"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "Elemente"} hat`;
                return `Zu groß: erwartet, dass ${issue.origin ?? "Wert"} ${adj}${issue.maximum.toString()} ist`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Zu klein: erwartet, dass ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} hat`;
                }
                return `Zu klein: erwartet, dass ${issue.origin} ${adj}${issue.minimum.toString()} ist`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `Ungültiger String: muss mit "${_issue.prefix}" beginnen`;
                if (_issue.format === "ends_with") return `Ungültiger String: muss mit "${_issue.suffix}" enden`;
                if (_issue.format === "includes") return `Ungültiger String: muss "${_issue.includes}" enthalten`;
                if (_issue.format === "regex") return `Ungültiger String: muss dem Muster ${_issue.pattern} entsprechen`;
                return `Ungültig: ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `Ungültige Zahl: muss ein Vielfaches von ${issue.divisor} sein`;
        case "unrecognized_keys":
            return `${issue.keys.length > 1 ? "Unbekannte Schlüssel" : "Unbekannter Schlüssel"}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `Ungültiger Schlüssel in ${issue.origin}`;
        case "invalid_union":
            return "Ungültige Eingabe";
        case "invalid_element":
            return `Ungültiger Wert in ${issue.origin}`;
        default:
            return `Ungültige Eingabe`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/en.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "characters",
        verb: "to have"
    },
    file: {
        unit: "bytes",
        verb: "to have"
    },
    array: {
        unit: "items",
        verb: "to have"
    },
    set: {
        unit: "items",
        verb: "to have"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "number";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    jwt: "JWT",
    template_literal: "input"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Invalid input: expected ${issue.expected}, received ${parsedType(issue.input)}`;
        // return `Invalid input: expected ${issue.expected}, received ${util.getParsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Invalid input: expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Invalid option: expected one of ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `Too big: expected ${issue.origin ?? "value"} to have ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
                return `Too big: expected ${issue.origin ?? "value"} to be ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Invalid string: must start with "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with") return `Invalid string: must end with "${_issue.suffix}"`;
                if (_issue.format === "includes") return `Invalid string: must include "${_issue.includes}"`;
                if (_issue.format === "regex") return `Invalid string: must match pattern ${_issue.pattern}`;
                return `Invalid ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `Invalid number: must be a multiple of ${issue.divisor}`;
        case "unrecognized_keys":
            return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `Invalid key in ${issue.origin}`;
        case "invalid_union":
            return "Invalid input";
        case "invalid_element":
            return `Invalid value in ${issue.origin}`;
        default:
            return `Invalid input`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/es.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "caracteres",
        verb: "tener"
    },
    file: {
        unit: "bytes",
        verb: "tener"
    },
    array: {
        unit: "elementos",
        verb: "tener"
    },
    set: {
        unit: "elementos",
        verb: "tener"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "número";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "arreglo";
                }
                if (data === null) {
                    return "nulo";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "entrada",
    email: "dirección de correo electrónico",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "fecha y hora ISO",
    date: "fecha ISO",
    time: "hora ISO",
    duration: "duración ISO",
    ipv4: "dirección IPv4",
    ipv6: "dirección IPv6",
    cidrv4: "rango IPv4",
    cidrv6: "rango IPv6",
    base64: "cadena codificada en base64",
    base64url: "URL codificada en base64",
    json_string: "cadena JSON",
    e164: "número E.164",
    jwt: "JWT",
    template_literal: "entrada"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Entrada inválida: se esperaba ${issue.expected}, recibido ${parsedType(issue.input)}`;
        // return `Entrada inválida: se esperaba ${issue.expected}, recibido ${util.getParsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Entrada inválida: se esperaba ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Opción inválida: se esperaba una de ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `Demasiado grande: se esperaba que ${issue.origin ?? "valor"} tuviera ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementos"}`;
                return `Demasiado grande: se esperaba que ${issue.origin ?? "valor"} fuera ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Demasiado pequeño: se esperaba que ${issue.origin} tuviera ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Demasiado pequeño: se esperaba que ${issue.origin} fuera ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `Cadena inválida: debe comenzar con "${_issue.prefix}"`;
                if (_issue.format === "ends_with") return `Cadena inválida: debe terminar en "${_issue.suffix}"`;
                if (_issue.format === "includes") return `Cadena inválida: debe incluir "${_issue.includes}"`;
                if (_issue.format === "regex") return `Cadena inválida: debe coincidir con el patrón ${_issue.pattern}`;
                return `Inválido ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `Número inválido: debe ser múltiplo de ${issue.divisor}`;
        case "unrecognized_keys":
            return `Llave${issue.keys.length > 1 ? "s" : ""} desconocida${issue.keys.length > 1 ? "s" : ""}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `Llave inválida en ${issue.origin}`;
        case "invalid_union":
            return "Entrada inválida";
        case "invalid_element":
            return `Valor inválido en ${issue.origin}`;
        default:
            return `Entrada inválida`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/fa.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "کاراکتر",
        verb: "داشته باشد"
    },
    file: {
        unit: "بایت",
        verb: "داشته باشد"
    },
    array: {
        unit: "آیتم",
        verb: "داشته باشد"
    },
    set: {
        unit: "آیتم",
        verb: "داشته باشد"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "عدد";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "آرایه";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "ورودی",
    email: "آدرس ایمیل",
    url: "URL",
    emoji: "ایموجی",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "تاریخ و زمان ایزو",
    date: "تاریخ ایزو",
    time: "زمان ایزو",
    duration: "مدت زمان ایزو",
    ipv4: "IPv4 آدرس",
    ipv6: "IPv6 آدرس",
    cidrv4: "IPv4 دامنه",
    cidrv6: "IPv6 دامنه",
    base64: "base64-encoded رشته",
    base64url: "base64url-encoded رشته",
    json_string: "JSON رشته",
    e164: "E.164 عدد",
    jwt: "JWT",
    template_literal: "ورودی"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `ورودی نامعتبر: می‌بایست ${issue.expected} می‌بود، ${parsedType(issue.input)} دریافت شد`;
        case "invalid_value":
            if (issue.values.length === 1) {
                return `ورودی نامعتبر: می‌بایست ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])} می‌بود`;
            }
            return `گزینه نامعتبر: می‌بایست یکی از ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")} می‌بود`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `خیلی بزرگ: ${issue.origin ?? "مقدار"} باید ${adj}${issue.maximum.toString()} ${sizing.unit ?? "عنصر"} باشد`;
                }
                return `خیلی بزرگ: ${issue.origin ?? "مقدار"} باید ${adj}${issue.maximum.toString()} باشد`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `خیلی کوچک: ${issue.origin} باید ${adj}${issue.minimum.toString()} ${sizing.unit} باشد`;
                }
                return `خیلی کوچک: ${issue.origin} باید ${adj}${issue.minimum.toString()} باشد`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `رشته نامعتبر: باید با "${_issue.prefix}" شروع شود`;
                }
                if (_issue.format === "ends_with") {
                    return `رشته نامعتبر: باید با "${_issue.suffix}" تمام شود`;
                }
                if (_issue.format === "includes") {
                    return `رشته نامعتبر: باید شامل "${_issue.includes}" باشد`;
                }
                if (_issue.format === "regex") {
                    return `رشته نامعتبر: باید با الگوی ${_issue.pattern} مطابقت داشته باشد`;
                }
                return `${Nouns[_issue.format] ?? issue.format} نامعتبر`;
            }
        case "not_multiple_of":
            return `عدد نامعتبر: باید مضرب ${issue.divisor} باشد`;
        case "unrecognized_keys":
            return `کلید${issue.keys.length > 1 ? "های" : ""} ناشناس: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `کلید ناشناس در ${issue.origin}`;
        case "invalid_union":
            return `ورودی نامعتبر`;
        case "invalid_element":
            return `مقدار نامعتبر در ${issue.origin}`;
        default:
            return `ورودی نامعتبر`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/fi.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "merkkiä",
        subject: "merkkijonon"
    },
    file: {
        unit: "tavua",
        subject: "tiedoston"
    },
    array: {
        unit: "alkiota",
        subject: "listan"
    },
    set: {
        unit: "alkiota",
        subject: "joukon"
    },
    number: {
        unit: "",
        subject: "luvun"
    },
    bigint: {
        unit: "",
        subject: "suuren kokonaisluvun"
    },
    int: {
        unit: "",
        subject: "kokonaisluvun"
    },
    date: {
        unit: "",
        subject: "päivämäärän"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "number";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "säännöllinen lauseke",
    email: "sähköpostiosoite",
    url: "URL-osoite",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-aikaleima",
    date: "ISO-päivämäärä",
    time: "ISO-aika",
    duration: "ISO-kesto",
    ipv4: "IPv4-osoite",
    ipv6: "IPv6-osoite",
    cidrv4: "IPv4-alue",
    cidrv6: "IPv6-alue",
    base64: "base64-koodattu merkkijono",
    base64url: "base64url-koodattu merkkijono",
    json_string: "JSON-merkkijono",
    e164: "E.164-luku",
    jwt: "JWT",
    template_literal: "templaattimerkkijono"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Virheellinen tyyppi: odotettiin ${issue.expected}, oli ${parsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Virheellinen syöte: täytyy olla ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Virheellinen valinta: täytyy olla yksi seuraavista: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Liian suuri: ${sizing.subject} täytyy olla ${adj}${issue.maximum.toString()} ${sizing.unit}`.trim();
                }
                return `Liian suuri: arvon täytyy olla ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Liian pieni: ${sizing.subject} täytyy olla ${adj}${issue.minimum.toString()} ${sizing.unit}`.trim();
                }
                return `Liian pieni: arvon täytyy olla ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `Virheellinen syöte: täytyy alkaa "${_issue.prefix}"`;
                if (_issue.format === "ends_with") return `Virheellinen syöte: täytyy loppua "${_issue.suffix}"`;
                if (_issue.format === "includes") return `Virheellinen syöte: täytyy sisältää "${_issue.includes}"`;
                if (_issue.format === "regex") {
                    return `Virheellinen syöte: täytyy vastata säännöllistä lauseketta ${_issue.pattern}`;
                }
                return `Virheellinen ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `Virheellinen luku: täytyy olla luvun ${issue.divisor} monikerta`;
        case "unrecognized_keys":
            return `${issue.keys.length > 1 ? "Tuntemattomat avaimet" : "Tuntematon avain"}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return "Virheellinen avain tietueessa";
        case "invalid_union":
            return "Virheellinen unioni";
        case "invalid_element":
            return "Virheellinen arvo joukossa";
        default:
            return `Virheellinen syöte`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/fr.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "caractères",
        verb: "avoir"
    },
    file: {
        unit: "octets",
        verb: "avoir"
    },
    array: {
        unit: "éléments",
        verb: "avoir"
    },
    set: {
        unit: "éléments",
        verb: "avoir"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "nombre";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "tableau";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "entrée",
    email: "adresse e-mail",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "date et heure ISO",
    date: "date ISO",
    time: "heure ISO",
    duration: "durée ISO",
    ipv4: "adresse IPv4",
    ipv6: "adresse IPv6",
    cidrv4: "plage IPv4",
    cidrv6: "plage IPv6",
    base64: "chaîne encodée en base64",
    base64url: "chaîne encodée en base64url",
    json_string: "chaîne JSON",
    e164: "numéro E.164",
    jwt: "JWT",
    template_literal: "entrée"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Entrée invalide : ${issue.expected} attendu, ${parsedType(issue.input)} reçu`;
        case "invalid_value":
            if (issue.values.length === 1) return `Entrée invalide : ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])} attendu`;
            return `Option invalide : une valeur parmi ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")} attendue`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `Trop grand : ${issue.origin ?? "valeur"} doit ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "élément(s)"}`;
                return `Trop grand : ${issue.origin ?? "valeur"} doit être ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Trop petit : ${issue.origin} doit ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Trop petit : ${issue.origin} doit être ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `Chaîne invalide : doit commencer par "${_issue.prefix}"`;
                if (_issue.format === "ends_with") return `Chaîne invalide : doit se terminer par "${_issue.suffix}"`;
                if (_issue.format === "includes") return `Chaîne invalide : doit inclure "${_issue.includes}"`;
                if (_issue.format === "regex") return `Chaîne invalide : doit correspondre au modèle ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} invalide`;
            }
        case "not_multiple_of":
            return `Nombre invalide : doit être un multiple de ${issue.divisor}`;
        case "unrecognized_keys":
            return `Clé${issue.keys.length > 1 ? "s" : ""} non reconnue${issue.keys.length > 1 ? "s" : ""} : ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `Clé invalide dans ${issue.origin}`;
        case "invalid_union":
            return "Entrée invalide";
        case "invalid_element":
            return `Valeur invalide dans ${issue.origin}`;
        default:
            return `Entrée invalide`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/frCA.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "caractères",
        verb: "avoir"
    },
    file: {
        unit: "octets",
        verb: "avoir"
    },
    array: {
        unit: "éléments",
        verb: "avoir"
    },
    set: {
        unit: "éléments",
        verb: "avoir"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "number";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "entrée",
    email: "adresse courriel",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "date-heure ISO",
    date: "date ISO",
    time: "heure ISO",
    duration: "durée ISO",
    ipv4: "adresse IPv4",
    ipv6: "adresse IPv6",
    cidrv4: "plage IPv4",
    cidrv6: "plage IPv6",
    base64: "chaîne encodée en base64",
    base64url: "chaîne encodée en base64url",
    json_string: "chaîne JSON",
    e164: "numéro E.164",
    jwt: "JWT",
    template_literal: "entrée"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Entrée invalide : attendu ${issue.expected}, reçu ${parsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Entrée invalide : attendu ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Option invalide : attendu l'une des valeurs suivantes ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "≤" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `Trop grand : attendu que ${issue.origin ?? "la valeur"} ait ${adj}${issue.maximum.toString()} ${sizing.unit}`;
                return `Trop grand : attendu que ${issue.origin ?? "la valeur"} soit ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? "≥" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Trop petit : attendu que ${issue.origin} ait ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Trop petit : attendu que ${issue.origin} soit ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Chaîne invalide : doit commencer par "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with") return `Chaîne invalide : doit se terminer par "${_issue.suffix}"`;
                if (_issue.format === "includes") return `Chaîne invalide : doit inclure "${_issue.includes}"`;
                if (_issue.format === "regex") return `Chaîne invalide : doit correspondre au motif ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} invalide`;
            }
        case "not_multiple_of":
            return `Nombre invalide : doit être un multiple de ${issue.divisor}`;
        case "unrecognized_keys":
            return `Clé${issue.keys.length > 1 ? "s" : ""} non reconnue${issue.keys.length > 1 ? "s" : ""} : ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `Clé invalide dans ${issue.origin}`;
        case "invalid_union":
            return "Entrée invalide";
        case "invalid_element":
            return `Valeur invalide dans ${issue.origin}`;
        default:
            return `Entrée invalide`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/he.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "אותיות",
        verb: "לכלול"
    },
    file: {
        unit: "בייטים",
        verb: "לכלול"
    },
    array: {
        unit: "פריטים",
        verb: "לכלול"
    },
    set: {
        unit: "פריטים",
        verb: "לכלול"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "number";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "קלט",
    email: "כתובת אימייל",
    url: "כתובת רשת",
    emoji: "אימוג'י",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "תאריך וזמן ISO",
    date: "תאריך ISO",
    time: "זמן ISO",
    duration: "משך זמן ISO",
    ipv4: "כתובת IPv4",
    ipv6: "כתובת IPv6",
    cidrv4: "טווח IPv4",
    cidrv6: "טווח IPv6",
    base64: "מחרוזת בבסיס 64",
    base64url: "מחרוזת בבסיס 64 לכתובות רשת",
    json_string: "מחרוזת JSON",
    e164: "מספר E.164",
    jwt: "JWT",
    template_literal: "קלט"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `קלט לא תקין: צריך ${issue.expected}, התקבל ${parsedType(issue.input)}`;
        // return `Invalid input: expected ${issue.expected}, received ${util.getParsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `קלט לא תקין: צריך ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `קלט לא תקין: צריך אחת מהאפשרויות  ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `גדול מדי: ${issue.origin ?? "value"} צריך להיות ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
                return `גדול מדי: ${issue.origin ?? "value"} צריך להיות ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `קטן מדי: ${issue.origin} צריך להיות ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `קטן מדי: ${issue.origin} צריך להיות ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `מחרוזת לא תקינה: חייבת להתחיל ב"${_issue.prefix}"`;
                if (_issue.format === "ends_with") return `מחרוזת לא תקינה: חייבת להסתיים ב "${_issue.suffix}"`;
                if (_issue.format === "includes") return `מחרוזת לא תקינה: חייבת לכלול "${_issue.includes}"`;
                if (_issue.format === "regex") return `מחרוזת לא תקינה: חייבת להתאים לתבנית ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} לא תקין`;
            }
        case "not_multiple_of":
            return `מספר לא תקין: חייב להיות מכפלה של ${issue.divisor}`;
        case "unrecognized_keys":
            return `מפתח${issue.keys.length > 1 ? "ות" : ""} לא מזוה${issue.keys.length > 1 ? "ים" : "ה"}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `מפתח לא תקין ב${issue.origin}`;
        case "invalid_union":
            return "קלט לא תקין";
        case "invalid_element":
            return `ערך לא תקין ב${issue.origin}`;
        default:
            return `קלט לא תקין`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/hu.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "karakter",
        verb: "legyen"
    },
    file: {
        unit: "byte",
        verb: "legyen"
    },
    array: {
        unit: "elem",
        verb: "legyen"
    },
    set: {
        unit: "elem",
        verb: "legyen"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "szám";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "tömb";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "bemenet",
    email: "email cím",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO időbélyeg",
    date: "ISO dátum",
    time: "ISO idő",
    duration: "ISO időintervallum",
    ipv4: "IPv4 cím",
    ipv6: "IPv6 cím",
    cidrv4: "IPv4 tartomány",
    cidrv6: "IPv6 tartomány",
    base64: "base64-kódolt string",
    base64url: "base64url-kódolt string",
    json_string: "JSON string",
    e164: "E.164 szám",
    jwt: "JWT",
    template_literal: "bemenet"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Érvénytelen bemenet: a várt érték ${issue.expected}, a kapott érték ${parsedType(issue.input)}`;
        // return `Invalid input: expected ${issue.expected}, received ${util.getParsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Érvénytelen bemenet: a várt érték ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Érvénytelen opció: valamelyik érték várt ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `Túl nagy: ${issue.origin ?? "érték"} mérete túl nagy ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elem"}`;
                return `Túl nagy: a bemeneti érték ${issue.origin ?? "érték"} túl nagy: ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Túl kicsi: a bemeneti érték ${issue.origin} mérete túl kicsi ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Túl kicsi: a bemeneti érték ${issue.origin} túl kicsi ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `Érvénytelen string: "${_issue.prefix}" értékkel kell kezdődnie`;
                if (_issue.format === "ends_with") return `Érvénytelen string: "${_issue.suffix}" értékkel kell végződnie`;
                if (_issue.format === "includes") return `Érvénytelen string: "${_issue.includes}" értéket kell tartalmaznia`;
                if (_issue.format === "regex") return `Érvénytelen string: ${_issue.pattern} mintának kell megfelelnie`;
                return `Érvénytelen ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `Érvénytelen szám: ${issue.divisor} többszörösének kell lennie`;
        case "unrecognized_keys":
            return `Ismeretlen kulcs${issue.keys.length > 1 ? "s" : ""}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `Érvénytelen kulcs ${issue.origin}`;
        case "invalid_union":
            return "Érvénytelen bemenet";
        case "invalid_element":
            return `Érvénytelen érték: ${issue.origin}`;
        default:
            return `Érvénytelen bemenet`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/id.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "karakter",
        verb: "memiliki"
    },
    file: {
        unit: "byte",
        verb: "memiliki"
    },
    array: {
        unit: "item",
        verb: "memiliki"
    },
    set: {
        unit: "item",
        verb: "memiliki"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "number";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "input",
    email: "alamat email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "tanggal dan waktu format ISO",
    date: "tanggal format ISO",
    time: "jam format ISO",
    duration: "durasi format ISO",
    ipv4: "alamat IPv4",
    ipv6: "alamat IPv6",
    cidrv4: "rentang alamat IPv4",
    cidrv6: "rentang alamat IPv6",
    base64: "string dengan enkode base64",
    base64url: "string dengan enkode base64url",
    json_string: "string JSON",
    e164: "angka E.164",
    jwt: "JWT",
    template_literal: "input"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Input tidak valid: diharapkan ${issue.expected}, diterima ${parsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Input tidak valid: diharapkan ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Pilihan tidak valid: diharapkan salah satu dari ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `Terlalu besar: diharapkan ${issue.origin ?? "value"} memiliki ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elemen"}`;
                return `Terlalu besar: diharapkan ${issue.origin ?? "value"} menjadi ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Terlalu kecil: diharapkan ${issue.origin} memiliki ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Terlalu kecil: diharapkan ${issue.origin} menjadi ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `String tidak valid: harus dimulai dengan "${_issue.prefix}"`;
                if (_issue.format === "ends_with") return `String tidak valid: harus berakhir dengan "${_issue.suffix}"`;
                if (_issue.format === "includes") return `String tidak valid: harus menyertakan "${_issue.includes}"`;
                if (_issue.format === "regex") return `String tidak valid: harus sesuai pola ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} tidak valid`;
            }
        case "not_multiple_of":
            return `Angka tidak valid: harus kelipatan dari ${issue.divisor}`;
        case "unrecognized_keys":
            return `Kunci tidak dikenali ${issue.keys.length > 1 ? "s" : ""}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `Kunci tidak valid di ${issue.origin}`;
        case "invalid_union":
            return "Input tidak valid";
        case "invalid_element":
            return `Nilai tidak valid di ${issue.origin}`;
        default:
            return `Input tidak valid`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/it.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "caratteri",
        verb: "avere"
    },
    file: {
        unit: "byte",
        verb: "avere"
    },
    array: {
        unit: "elementi",
        verb: "avere"
    },
    set: {
        unit: "elementi",
        verb: "avere"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "numero";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "vettore";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "input",
    email: "indirizzo email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data e ora ISO",
    date: "data ISO",
    time: "ora ISO",
    duration: "durata ISO",
    ipv4: "indirizzo IPv4",
    ipv6: "indirizzo IPv6",
    cidrv4: "intervallo IPv4",
    cidrv6: "intervallo IPv6",
    base64: "stringa codificata in base64",
    base64url: "URL codificata in base64",
    json_string: "stringa JSON",
    e164: "numero E.164",
    jwt: "JWT",
    template_literal: "input"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Input non valido: atteso ${issue.expected}, ricevuto ${parsedType(issue.input)}`;
        // return `Input non valido: atteso ${issue.expected}, ricevuto ${util.getParsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Input non valido: atteso ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Opzione non valida: atteso uno tra ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `Troppo grande: ${issue.origin ?? "valore"} deve avere ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementi"}`;
                return `Troppo grande: ${issue.origin ?? "valore"} deve essere ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Troppo piccolo: ${issue.origin} deve avere ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Troppo piccolo: ${issue.origin} deve essere ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `Stringa non valida: deve iniziare con "${_issue.prefix}"`;
                if (_issue.format === "ends_with") return `Stringa non valida: deve terminare con "${_issue.suffix}"`;
                if (_issue.format === "includes") return `Stringa non valida: deve includere "${_issue.includes}"`;
                if (_issue.format === "regex") return `Stringa non valida: deve corrispondere al pattern ${_issue.pattern}`;
                return `Invalid ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `Numero non valido: deve essere un multiplo di ${issue.divisor}`;
        case "unrecognized_keys":
            return `Chiav${issue.keys.length > 1 ? "i" : "e"} non riconosciut${issue.keys.length > 1 ? "e" : "a"}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `Chiave non valida in ${issue.origin}`;
        case "invalid_union":
            return "Input non valido";
        case "invalid_element":
            return `Valore non valido in ${issue.origin}`;
        default:
            return `Input non valido`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ja.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "文字",
        verb: "である"
    },
    file: {
        unit: "バイト",
        verb: "である"
    },
    array: {
        unit: "要素",
        verb: "である"
    },
    set: {
        unit: "要素",
        verb: "である"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "数値";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "配列";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "入力値",
    email: "メールアドレス",
    url: "URL",
    emoji: "絵文字",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO日時",
    date: "ISO日付",
    time: "ISO時刻",
    duration: "ISO期間",
    ipv4: "IPv4アドレス",
    ipv6: "IPv6アドレス",
    cidrv4: "IPv4範囲",
    cidrv6: "IPv6範囲",
    base64: "base64エンコード文字列",
    base64url: "base64urlエンコード文字列",
    json_string: "JSON文字列",
    e164: "E.164番号",
    jwt: "JWT",
    template_literal: "入力値"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `無効な入力: ${issue.expected}が期待されましたが、${parsedType(issue.input)}が入力されました`;
        case "invalid_value":
            if (issue.values.length === 1) return `無効な入力: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}が期待されました`;
            return `無効な選択: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "、")}のいずれかである必要があります`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `大きすぎる値: ${issue.origin ?? "値"}は${issue.maximum.toString()}${sizing.unit ?? "要素"}${adj}である必要があります`;
                return `大きすぎる値: ${issue.origin ?? "値"}は${issue.maximum.toString()}${adj}である必要があります`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) return `小さすぎる値: ${issue.origin}は${issue.minimum.toString()}${sizing.unit}${adj}である必要があります`;
                return `小さすぎる値: ${issue.origin}は${issue.minimum.toString()}${adj}である必要があります`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `無効な文字列: "${_issue.prefix}"で始まる必要があります`;
                if (_issue.format === "ends_with") return `無効な文字列: "${_issue.suffix}"で終わる必要があります`;
                if (_issue.format === "includes") return `無効な文字列: "${_issue.includes}"を含む必要があります`;
                if (_issue.format === "regex") return `無効な文字列: パターン${_issue.pattern}に一致する必要があります`;
                return `無効な${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `無効な数値: ${issue.divisor}の倍数である必要があります`;
        case "unrecognized_keys":
            return `認識されていないキー${issue.keys.length > 1 ? "群" : ""}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, "、")}`;
        case "invalid_key":
            return `${issue.origin}内の無効なキー`;
        case "invalid_union":
            return "無効な入力";
        case "invalid_element":
            return `${issue.origin}内の無効な値`;
        default:
            return `無効な入力`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ko.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "문자",
        verb: "to have"
    },
    file: {
        unit: "바이트",
        verb: "to have"
    },
    array: {
        unit: "개",
        verb: "to have"
    },
    set: {
        unit: "개",
        verb: "to have"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "number";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "입력",
    email: "이메일 주소",
    url: "URL",
    emoji: "이모지",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO 날짜시간",
    date: "ISO 날짜",
    time: "ISO 시간",
    duration: "ISO 기간",
    ipv4: "IPv4 주소",
    ipv6: "IPv6 주소",
    cidrv4: "IPv4 범위",
    cidrv6: "IPv6 범위",
    base64: "base64 인코딩 문자열",
    base64url: "base64url 인코딩 문자열",
    json_string: "JSON 문자열",
    e164: "E.164 번호",
    jwt: "JWT",
    template_literal: "입력"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `잘못된 입력: 예상 타입은 ${issue.expected}, 받은 타입은 ${parsedType(issue.input)}입니다`;
        case "invalid_value":
            if (issue.values.length === 1) return `잘못된 입력: 값은 ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])} 이어야 합니다`;
            return `잘못된 옵션: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "또는 ")} 중 하나여야 합니다`;
        case "too_big":
            {
                const adj = issue.inclusive ? "이하" : "미만";
                const suffix = adj === "미만" ? "이어야 합니다" : "여야 합니다";
                const sizing = getSizing(issue.origin);
                const unit = sizing?.unit ?? "요소";
                if (sizing) return `${issue.origin ?? "값"}이 너무 큽니다: ${issue.maximum.toString()}${unit} ${adj}${suffix}`;
                return `${issue.origin ?? "값"}이 너무 큽니다: ${issue.maximum.toString()} ${adj}${suffix}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? "이상" : "초과";
                const suffix = adj === "이상" ? "이어야 합니다" : "여야 합니다";
                const sizing = getSizing(issue.origin);
                const unit = sizing?.unit ?? "요소";
                if (sizing) {
                    return `${issue.origin ?? "값"}이 너무 작습니다: ${issue.minimum.toString()}${unit} ${adj}${suffix}`;
                }
                return `${issue.origin ?? "값"}이 너무 작습니다: ${issue.minimum.toString()} ${adj}${suffix}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `잘못된 문자열: "${_issue.prefix}"(으)로 시작해야 합니다`;
                }
                if (_issue.format === "ends_with") return `잘못된 문자열: "${_issue.suffix}"(으)로 끝나야 합니다`;
                if (_issue.format === "includes") return `잘못된 문자열: "${_issue.includes}"을(를) 포함해야 합니다`;
                if (_issue.format === "regex") return `잘못된 문자열: 정규식 ${_issue.pattern} 패턴과 일치해야 합니다`;
                return `잘못된 ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `잘못된 숫자: ${issue.divisor}의 배수여야 합니다`;
        case "unrecognized_keys":
            return `인식할 수 없는 키: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `잘못된 키: ${issue.origin}`;
        case "invalid_union":
            return `잘못된 입력`;
        case "invalid_element":
            return `잘못된 값: ${issue.origin}`;
        default:
            return `잘못된 입력`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/mk.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "знаци",
        verb: "да имаат"
    },
    file: {
        unit: "бајти",
        verb: "да имаат"
    },
    array: {
        unit: "ставки",
        verb: "да имаат"
    },
    set: {
        unit: "ставки",
        verb: "да имаат"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "број";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "низа";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "внес",
    email: "адреса на е-пошта",
    url: "URL",
    emoji: "емоџи",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO датум и време",
    date: "ISO датум",
    time: "ISO време",
    duration: "ISO времетраење",
    ipv4: "IPv4 адреса",
    ipv6: "IPv6 адреса",
    cidrv4: "IPv4 опсег",
    cidrv6: "IPv6 опсег",
    base64: "base64-енкодирана низа",
    base64url: "base64url-енкодирана низа",
    json_string: "JSON низа",
    e164: "E.164 број",
    jwt: "JWT",
    template_literal: "внес"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Грешен внес: се очекува ${issue.expected}, примено ${parsedType(issue.input)}`;
        // return `Invalid input: expected ${issue.expected}, received ${util.getParsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Invalid input: expected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Грешана опција: се очекува една ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `Премногу голем: се очекува ${issue.origin ?? "вредноста"} да има ${adj}${issue.maximum.toString()} ${sizing.unit ?? "елементи"}`;
                return `Премногу голем: се очекува ${issue.origin ?? "вредноста"} да биде ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Премногу мал: се очекува ${issue.origin} да има ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Премногу мал: се очекува ${issue.origin} да биде ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Неважечка низа: мора да започнува со "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with") return `Неважечка низа: мора да завршува со "${_issue.suffix}"`;
                if (_issue.format === "includes") return `Неважечка низа: мора да вклучува "${_issue.includes}"`;
                if (_issue.format === "regex") return `Неважечка низа: мора да одгоара на патернот ${_issue.pattern}`;
                return `Invalid ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `Грешен број: мора да биде делив со ${issue.divisor}`;
        case "unrecognized_keys":
            return `${issue.keys.length > 1 ? "Непрепознаени клучеви" : "Непрепознаен клуч"}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `Грешен клуч во ${issue.origin}`;
        case "invalid_union":
            return "Грешен внес";
        case "invalid_element":
            return `Грешна вредност во ${issue.origin}`;
        default:
            return `Грешен внес`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ms.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "aksara",
        verb: "mempunyai"
    },
    file: {
        unit: "bait",
        verb: "mempunyai"
    },
    array: {
        unit: "elemen",
        verb: "mempunyai"
    },
    set: {
        unit: "elemen",
        verb: "mempunyai"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "nombor";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "input",
    email: "alamat e-mel",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "tarikh masa ISO",
    date: "tarikh ISO",
    time: "masa ISO",
    duration: "tempoh ISO",
    ipv4: "alamat IPv4",
    ipv6: "alamat IPv6",
    cidrv4: "julat IPv4",
    cidrv6: "julat IPv6",
    base64: "string dikodkan base64",
    base64url: "string dikodkan base64url",
    json_string: "string JSON",
    e164: "nombor E.164",
    jwt: "JWT",
    template_literal: "input"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Input tidak sah: dijangka ${issue.expected}, diterima ${parsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Input tidak sah: dijangka ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Pilihan tidak sah: dijangka salah satu daripada ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `Terlalu besar: dijangka ${issue.origin ?? "nilai"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elemen"}`;
                return `Terlalu besar: dijangka ${issue.origin ?? "nilai"} adalah ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Terlalu kecil: dijangka ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Terlalu kecil: dijangka ${issue.origin} adalah ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `String tidak sah: mesti bermula dengan "${_issue.prefix}"`;
                if (_issue.format === "ends_with") return `String tidak sah: mesti berakhir dengan "${_issue.suffix}"`;
                if (_issue.format === "includes") return `String tidak sah: mesti mengandungi "${_issue.includes}"`;
                if (_issue.format === "regex") return `String tidak sah: mesti sepadan dengan corak ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} tidak sah`;
            }
        case "not_multiple_of":
            return `Nombor tidak sah: perlu gandaan ${issue.divisor}`;
        case "unrecognized_keys":
            return `Kunci tidak dikenali: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `Kunci tidak sah dalam ${issue.origin}`;
        case "invalid_union":
            return "Input tidak sah";
        case "invalid_element":
            return `Nilai tidak sah dalam ${issue.origin}`;
        default:
            return `Input tidak sah`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/no.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "tegn",
        verb: "å ha"
    },
    file: {
        unit: "bytes",
        verb: "å ha"
    },
    array: {
        unit: "elementer",
        verb: "å inneholde"
    },
    set: {
        unit: "elementer",
        verb: "å inneholde"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "tall";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "liste";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "input",
    email: "e-postadresse",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dato- og klokkeslett",
    date: "ISO-dato",
    time: "ISO-klokkeslett",
    duration: "ISO-varighet",
    ipv4: "IPv4-område",
    ipv6: "IPv6-område",
    cidrv4: "IPv4-spekter",
    cidrv6: "IPv6-spekter",
    base64: "base64-enkodet streng",
    base64url: "base64url-enkodet streng",
    json_string: "JSON-streng",
    e164: "E.164-nummer",
    jwt: "JWT",
    template_literal: "input"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Ugyldig input: forventet ${issue.expected}, fikk ${parsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Ugyldig verdi: forventet ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Ugyldig valg: forventet en av ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `For stor(t): forventet ${issue.origin ?? "value"} til å ha ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementer"}`;
                return `For stor(t): forventet ${issue.origin ?? "value"} til å ha ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `For lite(n): forventet ${issue.origin} til å ha ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `For lite(n): forventet ${issue.origin} til å ha ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `Ugyldig streng: må starte med "${_issue.prefix}"`;
                if (_issue.format === "ends_with") return `Ugyldig streng: må ende med "${_issue.suffix}"`;
                if (_issue.format === "includes") return `Ugyldig streng: må inneholde "${_issue.includes}"`;
                if (_issue.format === "regex") return `Ugyldig streng: må matche mønsteret ${_issue.pattern}`;
                return `Ugyldig ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `Ugyldig tall: må være et multiplum av ${issue.divisor}`;
        case "unrecognized_keys":
            return `${issue.keys.length > 1 ? "Ukjente nøkler" : "Ukjent nøkkel"}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `Ugyldig nøkkel i ${issue.origin}`;
        case "invalid_union":
            return "Ugyldig input";
        case "invalid_element":
            return `Ugyldig verdi i ${issue.origin}`;
        default:
            return `Ugyldig input`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ota.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "harf",
        verb: "olmalıdır"
    },
    file: {
        unit: "bayt",
        verb: "olmalıdır"
    },
    array: {
        unit: "unsur",
        verb: "olmalıdır"
    },
    set: {
        unit: "unsur",
        verb: "olmalıdır"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "numara";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "saf";
                }
                if (data === null) {
                    return "gayb";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "giren",
    email: "epostagâh",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO hengâmı",
    date: "ISO tarihi",
    time: "ISO zamanı",
    duration: "ISO müddeti",
    ipv4: "IPv4 nişânı",
    ipv6: "IPv6 nişânı",
    cidrv4: "IPv4 menzili",
    cidrv6: "IPv6 menzili",
    base64: "base64-şifreli metin",
    base64url: "base64url-şifreli metin",
    json_string: "JSON metin",
    e164: "E.164 sayısı",
    jwt: "JWT",
    template_literal: "giren"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Fâsit giren: umulan ${issue.expected}, alınan ${parsedType(issue.input)}`;
        // return `Fâsit giren: umulan ${issue.expected}, alınan ${util.getParsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Fâsit giren: umulan ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Fâsit tercih: mûteberler ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `Fazla büyük: ${issue.origin ?? "value"}, ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"} sahip olmalıydı.`;
                return `Fazla büyük: ${issue.origin ?? "value"}, ${adj}${issue.maximum.toString()} olmalıydı.`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Fazla küçük: ${issue.origin}, ${adj}${issue.minimum.toString()} ${sizing.unit} sahip olmalıydı.`;
                }
                return `Fazla küçük: ${issue.origin}, ${adj}${issue.minimum.toString()} olmalıydı.`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `Fâsit metin: "${_issue.prefix}" ile başlamalı.`;
                if (_issue.format === "ends_with") return `Fâsit metin: "${_issue.suffix}" ile bitmeli.`;
                if (_issue.format === "includes") return `Fâsit metin: "${_issue.includes}" ihtivâ etmeli.`;
                if (_issue.format === "regex") return `Fâsit metin: ${_issue.pattern} nakşına uymalı.`;
                return `Fâsit ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `Fâsit sayı: ${issue.divisor} katı olmalıydı.`;
        case "unrecognized_keys":
            return `Tanınmayan anahtar ${issue.keys.length > 1 ? "s" : ""}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `${issue.origin} için tanınmayan anahtar var.`;
        case "invalid_union":
            return "Giren tanınamadı.";
        case "invalid_element":
            return `${issue.origin} için tanınmayan kıymet var.`;
        default:
            return `Kıymet tanınamadı.`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/pl.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "znaków",
        verb: "mieć"
    },
    file: {
        unit: "bajtów",
        verb: "mieć"
    },
    array: {
        unit: "elementów",
        verb: "mieć"
    },
    set: {
        unit: "elementów",
        verb: "mieć"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "liczba";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "tablica";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "wyrażenie",
    email: "adres email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data i godzina w formacie ISO",
    date: "data w formacie ISO",
    time: "godzina w formacie ISO",
    duration: "czas trwania ISO",
    ipv4: "adres IPv4",
    ipv6: "adres IPv6",
    cidrv4: "zakres IPv4",
    cidrv6: "zakres IPv6",
    base64: "ciąg znaków zakodowany w formacie base64",
    base64url: "ciąg znaków zakodowany w formacie base64url",
    json_string: "ciąg znaków w formacie JSON",
    e164: "liczba E.164",
    jwt: "JWT",
    template_literal: "wejście"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Nieprawidłowe dane wejściowe: oczekiwano ${issue.expected}, otrzymano ${parsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Nieprawidłowe dane wejściowe: oczekiwano ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Nieprawidłowa opcja: oczekiwano jednej z wartości ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Za duża wartość: oczekiwano, że ${issue.origin ?? "wartość"} będzie mieć ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementów"}`;
                }
                return `Zbyt duż(y/a/e): oczekiwano, że ${issue.origin ?? "wartość"} będzie wynosić ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Za mała wartość: oczekiwano, że ${issue.origin ?? "wartość"} będzie mieć ${adj}${issue.minimum.toString()} ${sizing.unit ?? "elementów"}`;
                }
                return `Zbyt mał(y/a/e): oczekiwano, że ${issue.origin ?? "wartość"} będzie wynosić ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `Nieprawidłowy ciąg znaków: musi zaczynać się od "${_issue.prefix}"`;
                if (_issue.format === "ends_with") return `Nieprawidłowy ciąg znaków: musi kończyć się na "${_issue.suffix}"`;
                if (_issue.format === "includes") return `Nieprawidłowy ciąg znaków: musi zawierać "${_issue.includes}"`;
                if (_issue.format === "regex") return `Nieprawidłowy ciąg znaków: musi odpowiadać wzorcowi ${_issue.pattern}`;
                return `Nieprawidłow(y/a/e) ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `Nieprawidłowa liczba: musi być wielokrotnością ${issue.divisor}`;
        case "unrecognized_keys":
            return `Nierozpoznane klucze${issue.keys.length > 1 ? "s" : ""}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `Nieprawidłowy klucz w ${issue.origin}`;
        case "invalid_union":
            return "Nieprawidłowe dane wejściowe";
        case "invalid_element":
            return `Nieprawidłowa wartość w ${issue.origin}`;
        default:
            return `Nieprawidłowe dane wejściowe`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/pt.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "caracteres",
        verb: "ter"
    },
    file: {
        unit: "bytes",
        verb: "ter"
    },
    array: {
        unit: "itens",
        verb: "ter"
    },
    set: {
        unit: "itens",
        verb: "ter"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "número";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "nulo";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "padrão",
    email: "endereço de e-mail",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data e hora ISO",
    date: "data ISO",
    time: "hora ISO",
    duration: "duração ISO",
    ipv4: "endereço IPv4",
    ipv6: "endereço IPv6",
    cidrv4: "faixa de IPv4",
    cidrv6: "faixa de IPv6",
    base64: "texto codificado em base64",
    base64url: "URL codificada em base64",
    json_string: "texto JSON",
    e164: "número E.164",
    jwt: "JWT",
    template_literal: "entrada"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Tipo inválido: esperado ${issue.expected}, recebido ${parsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Entrada inválida: esperado ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Opção inválida: esperada uma das ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `Muito grande: esperado que ${issue.origin ?? "valor"} tivesse ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementos"}`;
                return `Muito grande: esperado que ${issue.origin ?? "valor"} fosse ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Muito pequeno: esperado que ${issue.origin} tivesse ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Muito pequeno: esperado que ${issue.origin} fosse ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `Texto inválido: deve começar com "${_issue.prefix}"`;
                if (_issue.format === "ends_with") return `Texto inválido: deve terminar com "${_issue.suffix}"`;
                if (_issue.format === "includes") return `Texto inválido: deve incluir "${_issue.includes}"`;
                if (_issue.format === "regex") return `Texto inválido: deve corresponder ao padrão ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} inválido`;
            }
        case "not_multiple_of":
            return `Número inválido: deve ser múltiplo de ${issue.divisor}`;
        case "unrecognized_keys":
            return `Chave${issue.keys.length > 1 ? "s" : ""} desconhecida${issue.keys.length > 1 ? "s" : ""}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `Chave inválida em ${issue.origin}`;
        case "invalid_union":
            return "Entrada inválida";
        case "invalid_element":
            return `Valor inválido em ${issue.origin}`;
        default:
            return `Campo inválido`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ru.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
function getRussianPlural(count, one, few, many) {
    const absCount = Math.abs(count);
    const lastDigit = absCount % 10;
    const lastTwoDigits = absCount % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return many;
    }
    if (lastDigit === 1) {
        return one;
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
        return few;
    }
    return many;
}
const Sizable = {
    string: {
        unit: {
            one: "символ",
            few: "символа",
            many: "символов"
        },
        verb: "иметь"
    },
    file: {
        unit: {
            one: "байт",
            few: "байта",
            many: "байт"
        },
        verb: "иметь"
    },
    array: {
        unit: {
            one: "элемент",
            few: "элемента",
            many: "элементов"
        },
        verb: "иметь"
    },
    set: {
        unit: {
            one: "элемент",
            few: "элемента",
            many: "элементов"
        },
        verb: "иметь"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "число";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "массив";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "ввод",
    email: "email адрес",
    url: "URL",
    emoji: "эмодзи",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO дата и время",
    date: "ISO дата",
    time: "ISO время",
    duration: "ISO длительность",
    ipv4: "IPv4 адрес",
    ipv6: "IPv6 адрес",
    cidrv4: "IPv4 диапазон",
    cidrv6: "IPv6 диапазон",
    base64: "строка в формате base64",
    base64url: "строка в формате base64url",
    json_string: "JSON строка",
    e164: "номер E.164",
    jwt: "JWT",
    template_literal: "ввод"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Неверный ввод: ожидалось ${issue.expected}, получено ${parsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Неверный ввод: ожидалось ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Неверный вариант: ожидалось одно из ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    const maxValue = Number(issue.maximum);
                    const unit = getRussianPlural(maxValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
                    return `Слишком большое значение: ожидалось, что ${issue.origin ?? "значение"} будет иметь ${adj}${issue.maximum.toString()} ${unit}`;
                }
                return `Слишком большое значение: ожидалось, что ${issue.origin ?? "значение"} будет ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    const minValue = Number(issue.minimum);
                    const unit = getRussianPlural(minValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
                    return `Слишком маленькое значение: ожидалось, что ${issue.origin} будет иметь ${adj}${issue.minimum.toString()} ${unit}`;
                }
                return `Слишком маленькое значение: ожидалось, что ${issue.origin} будет ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `Неверная строка: должна начинаться с "${_issue.prefix}"`;
                if (_issue.format === "ends_with") return `Неверная строка: должна заканчиваться на "${_issue.suffix}"`;
                if (_issue.format === "includes") return `Неверная строка: должна содержать "${_issue.includes}"`;
                if (_issue.format === "regex") return `Неверная строка: должна соответствовать шаблону ${_issue.pattern}`;
                return `Неверный ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `Неверное число: должно быть кратным ${issue.divisor}`;
        case "unrecognized_keys":
            return `Нераспознанн${issue.keys.length > 1 ? "ые" : "ый"} ключ${issue.keys.length > 1 ? "и" : ""}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `Неверный ключ в ${issue.origin}`;
        case "invalid_union":
            return "Неверные входные данные";
        case "invalid_element":
            return `Неверное значение в ${issue.origin}`;
        default:
            return `Неверные входные данные`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/sl.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "znakov",
        verb: "imeti"
    },
    file: {
        unit: "bajtov",
        verb: "imeti"
    },
    array: {
        unit: "elementov",
        verb: "imeti"
    },
    set: {
        unit: "elementov",
        verb: "imeti"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "število";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "tabela";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "vnos",
    email: "e-poštni naslov",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datum in čas",
    date: "ISO datum",
    time: "ISO čas",
    duration: "ISO trajanje",
    ipv4: "IPv4 naslov",
    ipv6: "IPv6 naslov",
    cidrv4: "obseg IPv4",
    cidrv6: "obseg IPv6",
    base64: "base64 kodiran niz",
    base64url: "base64url kodiran niz",
    json_string: "JSON niz",
    e164: "E.164 številka",
    jwt: "JWT",
    template_literal: "vnos"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Neveljaven vnos: pričakovano ${issue.expected}, prejeto ${parsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Neveljaven vnos: pričakovano ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Neveljavna možnost: pričakovano eno izmed ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `Preveliko: pričakovano, da bo ${issue.origin ?? "vrednost"} imelo ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementov"}`;
                return `Preveliko: pričakovano, da bo ${issue.origin ?? "vrednost"} ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Premajhno: pričakovano, da bo ${issue.origin} imelo ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Premajhno: pričakovano, da bo ${issue.origin} ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Neveljaven niz: mora se začeti z "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with") return `Neveljaven niz: mora se končati z "${_issue.suffix}"`;
                if (_issue.format === "includes") return `Neveljaven niz: mora vsebovati "${_issue.includes}"`;
                if (_issue.format === "regex") return `Neveljaven niz: mora ustrezati vzorcu ${_issue.pattern}`;
                return `Neveljaven ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `Neveljavno število: mora biti večkratnik ${issue.divisor}`;
        case "unrecognized_keys":
            return `Neprepoznan${issue.keys.length > 1 ? "i ključi" : " ključ"}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `Neveljaven ključ v ${issue.origin}`;
        case "invalid_union":
            return "Neveljaven vnos";
        case "invalid_element":
            return `Neveljavna vrednost v ${issue.origin}`;
        default:
            return "Neveljaven vnos";
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ta.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "எழுத்துக்கள்",
        verb: "கொண்டிருக்க வேண்டும்"
    },
    file: {
        unit: "பைட்டுகள்",
        verb: "கொண்டிருக்க வேண்டும்"
    },
    array: {
        unit: "உறுப்புகள்",
        verb: "கொண்டிருக்க வேண்டும்"
    },
    set: {
        unit: "உறுப்புகள்",
        verb: "கொண்டிருக்க வேண்டும்"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "எண் அல்லாதது" : "எண்";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "அணி";
                }
                if (data === null) {
                    return "வெறுமை";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "உள்ளீடு",
    email: "மின்னஞ்சல் முகவரி",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO தேதி நேரம்",
    date: "ISO தேதி",
    time: "ISO நேரம்",
    duration: "ISO கால அளவு",
    ipv4: "IPv4 முகவரி",
    ipv6: "IPv6 முகவரி",
    cidrv4: "IPv4 வரம்பு",
    cidrv6: "IPv6 வரம்பு",
    base64: "base64-encoded சரம்",
    base64url: "base64url-encoded சரம்",
    json_string: "JSON சரம்",
    e164: "E.164 எண்",
    jwt: "JWT",
    template_literal: "input"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${issue.expected}, பெறப்பட்டது ${parsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `தவறான விருப்பம்: எதிர்பார்க்கப்பட்டது ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")} இல் ஒன்று`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${issue.origin ?? "மதிப்பு"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "உறுப்புகள்"} ஆக இருக்க வேண்டும்`;
                }
                return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${issue.origin ?? "மதிப்பு"} ${adj}${issue.maximum.toString()} ஆக இருக்க வேண்டும்`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} ஆக இருக்க வேண்டும்`; //
                }
                return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${issue.origin} ${adj}${issue.minimum.toString()} ஆக இருக்க வேண்டும்`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `தவறான சரம்: "${_issue.prefix}" இல் தொடங்க வேண்டும்`;
                if (_issue.format === "ends_with") return `தவறான சரம்: "${_issue.suffix}" இல் முடிவடைய வேண்டும்`;
                if (_issue.format === "includes") return `தவறான சரம்: "${_issue.includes}" ஐ உள்ளடக்க வேண்டும்`;
                if (_issue.format === "regex") return `தவறான சரம்: ${_issue.pattern} முறைபாட்டுடன் பொருந்த வேண்டும்`;
                return `தவறான ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `தவறான எண்: ${issue.divisor} இன் பலமாக இருக்க வேண்டும்`;
        case "unrecognized_keys":
            return `அடையாளம் தெரியாத விசை${issue.keys.length > 1 ? "கள்" : ""}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `${issue.origin} இல் தவறான விசை`;
        case "invalid_union":
            return "தவறான உள்ளீடு";
        case "invalid_element":
            return `${issue.origin} இல் தவறான மதிப்பு`;
        default:
            return `தவறான உள்ளீடு`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/th.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "ตัวอักษร",
        verb: "ควรมี"
    },
    file: {
        unit: "ไบต์",
        verb: "ควรมี"
    },
    array: {
        unit: "รายการ",
        verb: "ควรมี"
    },
    set: {
        unit: "รายการ",
        verb: "ควรมี"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "ไม่ใช่ตัวเลข (NaN)" : "ตัวเลข";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "อาร์เรย์ (Array)";
                }
                if (data === null) {
                    return "ไม่มีค่า (null)";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "ข้อมูลที่ป้อน",
    email: "ที่อยู่อีเมล",
    url: "URL",
    emoji: "อิโมจิ",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "วันที่เวลาแบบ ISO",
    date: "วันที่แบบ ISO",
    time: "เวลาแบบ ISO",
    duration: "ช่วงเวลาแบบ ISO",
    ipv4: "ที่อยู่ IPv4",
    ipv6: "ที่อยู่ IPv6",
    cidrv4: "ช่วง IP แบบ IPv4",
    cidrv6: "ช่วง IP แบบ IPv6",
    base64: "ข้อความแบบ Base64",
    base64url: "ข้อความแบบ Base64 สำหรับ URL",
    json_string: "ข้อความแบบ JSON",
    e164: "เบอร์โทรศัพท์ระหว่างประเทศ (E.164)",
    jwt: "โทเคน JWT",
    template_literal: "ข้อมูลที่ป้อน"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น ${issue.expected} แต่ได้รับ ${parsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `ค่าไม่ถูกต้อง: ควรเป็น ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `ตัวเลือกไม่ถูกต้อง: ควรเป็นหนึ่งใน ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "ไม่เกิน" : "น้อยกว่า";
                const sizing = getSizing(issue.origin);
                if (sizing) return `เกินกำหนด: ${issue.origin ?? "ค่า"} ควรมี${adj} ${issue.maximum.toString()} ${sizing.unit ?? "รายการ"}`;
                return `เกินกำหนด: ${issue.origin ?? "ค่า"} ควรมี${adj} ${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? "อย่างน้อย" : "มากกว่า";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `น้อยกว่ากำหนด: ${issue.origin} ควรมี${adj} ${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `น้อยกว่ากำหนด: ${issue.origin} ควรมี${adj} ${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `รูปแบบไม่ถูกต้อง: ข้อความต้องขึ้นต้นด้วย "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with") return `รูปแบบไม่ถูกต้อง: ข้อความต้องลงท้ายด้วย "${_issue.suffix}"`;
                if (_issue.format === "includes") return `รูปแบบไม่ถูกต้อง: ข้อความต้องมี "${_issue.includes}" อยู่ในข้อความ`;
                if (_issue.format === "regex") return `รูปแบบไม่ถูกต้อง: ต้องตรงกับรูปแบบที่กำหนด ${_issue.pattern}`;
                return `รูปแบบไม่ถูกต้อง: ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `ตัวเลขไม่ถูกต้อง: ต้องเป็นจำนวนที่หารด้วย ${issue.divisor} ได้ลงตัว`;
        case "unrecognized_keys":
            return `พบคีย์ที่ไม่รู้จัก: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `คีย์ไม่ถูกต้องใน ${issue.origin}`;
        case "invalid_union":
            return "ข้อมูลไม่ถูกต้อง: ไม่ตรงกับรูปแบบยูเนียนที่กำหนดไว้";
        case "invalid_element":
            return `ข้อมูลไม่ถูกต้องใน ${issue.origin}`;
        default:
            return `ข้อมูลไม่ถูกต้อง`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/tr.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "karakter",
        verb: "olmalı"
    },
    file: {
        unit: "bayt",
        verb: "olmalı"
    },
    array: {
        unit: "öğe",
        verb: "olmalı"
    },
    set: {
        unit: "öğe",
        verb: "olmalı"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "number";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "girdi",
    email: "e-posta adresi",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO tarih ve saat",
    date: "ISO tarih",
    time: "ISO saat",
    duration: "ISO süre",
    ipv4: "IPv4 adresi",
    ipv6: "IPv6 adresi",
    cidrv4: "IPv4 aralığı",
    cidrv6: "IPv6 aralığı",
    base64: "base64 ile şifrelenmiş metin",
    base64url: "base64url ile şifrelenmiş metin",
    json_string: "JSON dizesi",
    e164: "E.164 sayısı",
    jwt: "JWT",
    template_literal: "Şablon dizesi"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Geçersiz değer: beklenen ${issue.expected}, alınan ${parsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Geçersiz değer: beklenen ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Geçersiz seçenek: aşağıdakilerden biri olmalı: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `Çok büyük: beklenen ${issue.origin ?? "değer"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "öğe"}`;
                return `Çok büyük: beklenen ${issue.origin ?? "değer"} ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) return `Çok küçük: beklenen ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                return `Çok küçük: beklenen ${issue.origin} ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `Geçersiz metin: "${_issue.prefix}" ile başlamalı`;
                if (_issue.format === "ends_with") return `Geçersiz metin: "${_issue.suffix}" ile bitmeli`;
                if (_issue.format === "includes") return `Geçersiz metin: "${_issue.includes}" içermeli`;
                if (_issue.format === "regex") return `Geçersiz metin: ${_issue.pattern} desenine uymalı`;
                return `Geçersiz ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `Geçersiz sayı: ${issue.divisor} ile tam bölünebilmeli`;
        case "unrecognized_keys":
            return `Tanınmayan anahtar${issue.keys.length > 1 ? "lar" : ""}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `${issue.origin} içinde geçersiz anahtar`;
        case "invalid_union":
            return "Geçersiz değer";
        case "invalid_element":
            return `${issue.origin} içinde geçersiz değer`;
        default:
            return `Geçersiz değer`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ua.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "символів",
        verb: "матиме"
    },
    file: {
        unit: "байтів",
        verb: "матиме"
    },
    array: {
        unit: "елементів",
        verb: "матиме"
    },
    set: {
        unit: "елементів",
        verb: "матиме"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "число";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "масив";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "вхідні дані",
    email: "адреса електронної пошти",
    url: "URL",
    emoji: "емодзі",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "дата та час ISO",
    date: "дата ISO",
    time: "час ISO",
    duration: "тривалість ISO",
    ipv4: "адреса IPv4",
    ipv6: "адреса IPv6",
    cidrv4: "діапазон IPv4",
    cidrv6: "діапазон IPv6",
    base64: "рядок у кодуванні base64",
    base64url: "рядок у кодуванні base64url",
    json_string: "рядок JSON",
    e164: "номер E.164",
    jwt: "JWT",
    template_literal: "вхідні дані"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Неправильні вхідні дані: очікується ${issue.expected}, отримано ${parsedType(issue.input)}`;
        // return `Неправильні вхідні дані: очікується ${issue.expected}, отримано ${util.getParsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Неправильні вхідні дані: очікується ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Неправильна опція: очікується одне з ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `Занадто велике: очікується, що ${issue.origin ?? "значення"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "елементів"}`;
                return `Занадто велике: очікується, що ${issue.origin ?? "значення"} буде ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Занадто мале: очікується, що ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Занадто мале: очікується, що ${issue.origin} буде ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `Неправильний рядок: повинен починатися з "${_issue.prefix}"`;
                if (_issue.format === "ends_with") return `Неправильний рядок: повинен закінчуватися на "${_issue.suffix}"`;
                if (_issue.format === "includes") return `Неправильний рядок: повинен містити "${_issue.includes}"`;
                if (_issue.format === "regex") return `Неправильний рядок: повинен відповідати шаблону ${_issue.pattern}`;
                return `Неправильний ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `Неправильне число: повинно бути кратним ${issue.divisor}`;
        case "unrecognized_keys":
            return `Нерозпізнаний ключ${issue.keys.length > 1 ? "і" : ""}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `Неправильний ключ у ${issue.origin}`;
        case "invalid_union":
            return "Неправильні вхідні дані";
        case "invalid_element":
            return `Неправильне значення у ${issue.origin}`;
        default:
            return `Неправильні вхідні дані`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ur.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "حروف",
        verb: "ہونا"
    },
    file: {
        unit: "بائٹس",
        verb: "ہونا"
    },
    array: {
        unit: "آئٹمز",
        verb: "ہونا"
    },
    set: {
        unit: "آئٹمز",
        verb: "ہونا"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "نمبر";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "آرے";
                }
                if (data === null) {
                    return "نل";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "ان پٹ",
    email: "ای میل ایڈریس",
    url: "یو آر ایل",
    emoji: "ایموجی",
    uuid: "یو یو آئی ڈی",
    uuidv4: "یو یو آئی ڈی وی 4",
    uuidv6: "یو یو آئی ڈی وی 6",
    nanoid: "نینو آئی ڈی",
    guid: "جی یو آئی ڈی",
    cuid: "سی یو آئی ڈی",
    cuid2: "سی یو آئی ڈی 2",
    ulid: "یو ایل آئی ڈی",
    xid: "ایکس آئی ڈی",
    ksuid: "کے ایس یو آئی ڈی",
    datetime: "آئی ایس او ڈیٹ ٹائم",
    date: "آئی ایس او تاریخ",
    time: "آئی ایس او وقت",
    duration: "آئی ایس او مدت",
    ipv4: "آئی پی وی 4 ایڈریس",
    ipv6: "آئی پی وی 6 ایڈریس",
    cidrv4: "آئی پی وی 4 رینج",
    cidrv6: "آئی پی وی 6 رینج",
    base64: "بیس 64 ان کوڈڈ سٹرنگ",
    base64url: "بیس 64 یو آر ایل ان کوڈڈ سٹرنگ",
    json_string: "جے ایس او این سٹرنگ",
    e164: "ای 164 نمبر",
    jwt: "جے ڈبلیو ٹی",
    template_literal: "ان پٹ"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `غلط ان پٹ: ${issue.expected} متوقع تھا، ${parsedType(issue.input)} موصول ہوا`;
        case "invalid_value":
            if (issue.values.length === 1) return `غلط ان پٹ: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])} متوقع تھا`;
            return `غلط آپشن: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")} میں سے ایک متوقع تھا`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `بہت بڑا: ${issue.origin ?? "ویلیو"} کے ${adj}${issue.maximum.toString()} ${sizing.unit ?? "عناصر"} ہونے متوقع تھے`;
                return `بہت بڑا: ${issue.origin ?? "ویلیو"} کا ${adj}${issue.maximum.toString()} ہونا متوقع تھا`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `بہت چھوٹا: ${issue.origin} کے ${adj}${issue.minimum.toString()} ${sizing.unit} ہونے متوقع تھے`;
                }
                return `بہت چھوٹا: ${issue.origin} کا ${adj}${issue.minimum.toString()} ہونا متوقع تھا`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `غلط سٹرنگ: "${_issue.prefix}" سے شروع ہونا چاہیے`;
                }
                if (_issue.format === "ends_with") return `غلط سٹرنگ: "${_issue.suffix}" پر ختم ہونا چاہیے`;
                if (_issue.format === "includes") return `غلط سٹرنگ: "${_issue.includes}" شامل ہونا چاہیے`;
                if (_issue.format === "regex") return `غلط سٹرنگ: پیٹرن ${_issue.pattern} سے میچ ہونا چاہیے`;
                return `غلط ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `غلط نمبر: ${issue.divisor} کا مضاعف ہونا چاہیے`;
        case "unrecognized_keys":
            return `غیر تسلیم شدہ کی${issue.keys.length > 1 ? "ز" : ""}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, "، ")}`;
        case "invalid_key":
            return `${issue.origin} میں غلط کی`;
        case "invalid_union":
            return "غلط ان پٹ";
        case "invalid_element":
            return `${issue.origin} میں غلط ویلیو`;
        default:
            return `غلط ان پٹ`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/vi.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "ký tự",
        verb: "có"
    },
    file: {
        unit: "byte",
        verb: "có"
    },
    array: {
        unit: "phần tử",
        verb: "có"
    },
    set: {
        unit: "phần tử",
        verb: "có"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "số";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "mảng";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "đầu vào",
    email: "địa chỉ email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ngày giờ ISO",
    date: "ngày ISO",
    time: "giờ ISO",
    duration: "khoảng thời gian ISO",
    ipv4: "địa chỉ IPv4",
    ipv6: "địa chỉ IPv6",
    cidrv4: "dải IPv4",
    cidrv6: "dải IPv6",
    base64: "chuỗi mã hóa base64",
    base64url: "chuỗi mã hóa base64url",
    json_string: "chuỗi JSON",
    e164: "số E.164",
    jwt: "JWT",
    template_literal: "đầu vào"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `Đầu vào không hợp lệ: mong đợi ${issue.expected}, nhận được ${parsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `Đầu vào không hợp lệ: mong đợi ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `Tùy chọn không hợp lệ: mong đợi một trong các giá trị ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `Quá lớn: mong đợi ${issue.origin ?? "giá trị"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "phần tử"}`;
                return `Quá lớn: mong đợi ${issue.origin ?? "giá trị"} ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Quá nhỏ: mong đợi ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Quá nhỏ: mong đợi ${issue.origin} ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `Chuỗi không hợp lệ: phải bắt đầu bằng "${_issue.prefix}"`;
                if (_issue.format === "ends_with") return `Chuỗi không hợp lệ: phải kết thúc bằng "${_issue.suffix}"`;
                if (_issue.format === "includes") return `Chuỗi không hợp lệ: phải bao gồm "${_issue.includes}"`;
                if (_issue.format === "regex") return `Chuỗi không hợp lệ: phải khớp với mẫu ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} không hợp lệ`;
            }
        case "not_multiple_of":
            return `Số không hợp lệ: phải là bội số của ${issue.divisor}`;
        case "unrecognized_keys":
            return `Khóa không được nhận dạng: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `Khóa không hợp lệ trong ${issue.origin}`;
        case "invalid_union":
            return "Đầu vào không hợp lệ";
        case "invalid_element":
            return `Giá trị không hợp lệ trong ${issue.origin}`;
        default:
            return `Đầu vào không hợp lệ`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/zh-CN.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "字符",
        verb: "包含"
    },
    file: {
        unit: "字节",
        verb: "包含"
    },
    array: {
        unit: "项",
        verb: "包含"
    },
    set: {
        unit: "项",
        verb: "包含"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "非数字(NaN)" : "数字";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "数组";
                }
                if (data === null) {
                    return "空值(null)";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "输入",
    email: "电子邮件",
    url: "URL",
    emoji: "表情符号",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO日期时间",
    date: "ISO日期",
    time: "ISO时间",
    duration: "ISO时长",
    ipv4: "IPv4地址",
    ipv6: "IPv6地址",
    cidrv4: "IPv4网段",
    cidrv6: "IPv6网段",
    base64: "base64编码字符串",
    base64url: "base64url编码字符串",
    json_string: "JSON字符串",
    e164: "E.164号码",
    jwt: "JWT",
    template_literal: "输入"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `无效输入：期望 ${issue.expected}，实际接收 ${parsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `无效输入：期望 ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `无效选项：期望以下之一 ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `数值过大：期望 ${issue.origin ?? "值"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "个元素"}`;
                return `数值过大：期望 ${issue.origin ?? "值"} ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `数值过小：期望 ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `数值过小：期望 ${issue.origin} ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") return `无效字符串：必须以 "${_issue.prefix}" 开头`;
                if (_issue.format === "ends_with") return `无效字符串：必须以 "${_issue.suffix}" 结尾`;
                if (_issue.format === "includes") return `无效字符串：必须包含 "${_issue.includes}"`;
                if (_issue.format === "regex") return `无效字符串：必须满足正则表达式 ${_issue.pattern}`;
                return `无效${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `无效数字：必须是 ${issue.divisor} 的倍数`;
        case "unrecognized_keys":
            return `出现未知的键(key): ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, ", ")}`;
        case "invalid_key":
            return `${issue.origin} 中的键(key)无效`;
        case "invalid_union":
            return "无效输入";
        case "invalid_element":
            return `${issue.origin} 中包含无效值(value)`;
        default:
            return `无效输入`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/zh-tw.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "error": (()=>error),
    "parsedType": (()=>parsedType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
const Sizable = {
    string: {
        unit: "字元",
        verb: "擁有"
    },
    file: {
        unit: "位元組",
        verb: "擁有"
    },
    array: {
        unit: "項目",
        verb: "擁有"
    },
    set: {
        unit: "項目",
        verb: "擁有"
    }
};
function getSizing(origin) {
    return Sizable[origin] ?? null;
}
const parsedType = (data)=>{
    const t = typeof data;
    switch(t){
        case "number":
            {
                return Number.isNaN(data) ? "NaN" : "number";
            }
        case "object":
            {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
    }
    return t;
};
const Nouns = {
    regex: "輸入",
    email: "郵件地址",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO 日期時間",
    date: "ISO 日期",
    time: "ISO 時間",
    duration: "ISO 期間",
    ipv4: "IPv4 位址",
    ipv6: "IPv6 位址",
    cidrv4: "IPv4 範圍",
    cidrv6: "IPv6 範圍",
    base64: "base64 編碼字串",
    base64url: "base64url 編碼字串",
    json_string: "JSON 字串",
    e164: "E.164 數值",
    jwt: "JWT",
    template_literal: "輸入"
};
const error = (issue)=>{
    switch(issue.code){
        case "invalid_type":
            return `無效的輸入值：預期為 ${issue.expected}，但收到 ${parsedType(issue.input)}`;
        case "invalid_value":
            if (issue.values.length === 1) return `無效的輸入值：預期為 ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyPrimitive"])(issue.values[0])}`;
            return `無效的選項：預期為以下其中之一 ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.values, "|")}`;
        case "too_big":
            {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) return `數值過大：預期 ${issue.origin ?? "值"} 應為 ${adj}${issue.maximum.toString()} ${sizing.unit ?? "個元素"}`;
                return `數值過大：預期 ${issue.origin ?? "值"} 應為 ${adj}${issue.maximum.toString()}`;
            }
        case "too_small":
            {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `數值過小：預期 ${issue.origin} 應為 ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `數值過小：預期 ${issue.origin} 應為 ${adj}${issue.minimum.toString()}`;
            }
        case "invalid_format":
            {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `無效的字串：必須以 "${_issue.prefix}" 開頭`;
                }
                if (_issue.format === "ends_with") return `無效的字串：必須以 "${_issue.suffix}" 結尾`;
                if (_issue.format === "includes") return `無效的字串：必須包含 "${_issue.includes}"`;
                if (_issue.format === "regex") return `無效的字串：必須符合格式 ${_issue.pattern}`;
                return `無效的 ${Nouns[_issue.format] ?? issue.format}`;
            }
        case "not_multiple_of":
            return `無效的數字：必須為 ${issue.divisor} 的倍數`;
        case "unrecognized_keys":
            return `無法識別的鍵值${issue.keys.length > 1 ? "們" : ""}：${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["joinValues"])(issue.keys, "、")}`;
        case "invalid_key":
            return `${issue.origin} 中有無效的鍵值`;
        case "invalid_union":
            return "無效的輸入值";
        case "invalid_element":
            return `${issue.origin} 中有無效的值`;
        default:
            return `無效的輸入值`;
    }
};
;
function __TURBOPACK__default__export__() {
    return {
        localeError: error
    };
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/index.js [app-route] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$ar$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ar.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$az$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/az.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$be$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/be.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$ca$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ca.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$cs$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/cs.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$de$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/de.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$en$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/en.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/es.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$fa$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/fa.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$fi$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/fi.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$fr$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/fr.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$frCA$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/frCA.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$he$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/he.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$hu$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/hu.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$id$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/id.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$it$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/it.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$ja$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ja.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$ko$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ko.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$mk$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/mk.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$ms$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ms.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$no$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/no.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$ota$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ota.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$pl$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/pl.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$pt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/pt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$ru$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ru.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$sl$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/sl.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$ta$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ta.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$th$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/th.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$tr$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/tr.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$ua$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ua.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$ur$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ur.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$vi$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/vi.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$zh$2d$CN$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/zh-CN.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$zh$2d$tw$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/zh-tw.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/index.js [app-route] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$ar$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ar.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$az$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/az.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$be$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/be.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$ca$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ca.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$cs$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/cs.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$de$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/de.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$en$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/en.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/es.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$fa$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/fa.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$fi$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/fi.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$fr$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/fr.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$frCA$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/frCA.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$he$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/he.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$hu$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/hu.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$id$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/id.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$it$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/it.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$ja$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ja.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$ko$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ko.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$mk$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/mk.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$ms$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ms.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$no$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/no.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$ota$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ota.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$pl$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/pl.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$pt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/pt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$ru$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ru.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$sl$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/sl.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$ta$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ta.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$th$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/th.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$tr$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/tr.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$ua$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ua.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$ur$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/ur.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$vi$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/vi.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$zh$2d$CN$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/zh-CN.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$zh$2d$tw$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/zh-tw.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/index.js [app-route] (ecmascript) <locals>");
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/registries.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "$ZodRegistry": (()=>$ZodRegistry),
    "$input": (()=>$input),
    "$output": (()=>$output),
    "globalRegistry": (()=>globalRegistry),
    "registry": (()=>registry)
});
const $output = Symbol("ZodOutput");
const $input = Symbol("ZodInput");
class $ZodRegistry {
    constructor(){
        this._map = new WeakMap();
        this._idmap = new Map();
    }
    add(schema, ..._meta) {
        const meta = _meta[0];
        this._map.set(schema, meta);
        if (meta && typeof meta === "object" && "id" in meta) {
            if (this._idmap.has(meta.id)) {
                throw new Error(`ID ${meta.id} already exists in the registry`);
            }
            this._idmap.set(meta.id, schema);
        }
        return this;
    }
    remove(schema) {
        this._map.delete(schema);
        return this;
    }
    get(schema) {
        // return this._map.get(schema) as any;
        // inherit metadata
        const p = schema._zod.parent;
        if (p) {
            const pm = {
                ...this.get(p) ?? {}
            };
            delete pm.id; // do not inherit id
            return {
                ...pm,
                ...this._map.get(schema)
            };
        }
        return this._map.get(schema);
    }
    has(schema) {
        return this._map.has(schema);
    }
}
function registry() {
    return new $ZodRegistry();
}
const globalRegistry = /*@__PURE__*/ registry();
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/api.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "_any": (()=>_any),
    "_array": (()=>_array),
    "_base64": (()=>_base64),
    "_base64url": (()=>_base64url),
    "_bigint": (()=>_bigint),
    "_boolean": (()=>_boolean),
    "_catch": (()=>_catch),
    "_cidrv4": (()=>_cidrv4),
    "_cidrv6": (()=>_cidrv6),
    "_coercedBigint": (()=>_coercedBigint),
    "_coercedBoolean": (()=>_coercedBoolean),
    "_coercedDate": (()=>_coercedDate),
    "_coercedNumber": (()=>_coercedNumber),
    "_coercedString": (()=>_coercedString),
    "_cuid": (()=>_cuid),
    "_cuid2": (()=>_cuid2),
    "_custom": (()=>_custom),
    "_date": (()=>_date),
    "_default": (()=>_default),
    "_discriminatedUnion": (()=>_discriminatedUnion),
    "_e164": (()=>_e164),
    "_email": (()=>_email),
    "_emoji": (()=>_emoji),
    "_endsWith": (()=>_endsWith),
    "_enum": (()=>_enum),
    "_file": (()=>_file),
    "_float32": (()=>_float32),
    "_float64": (()=>_float64),
    "_gt": (()=>_gt),
    "_gte": (()=>_gte),
    "_guid": (()=>_guid),
    "_includes": (()=>_includes),
    "_int": (()=>_int),
    "_int32": (()=>_int32),
    "_int64": (()=>_int64),
    "_intersection": (()=>_intersection),
    "_ipv4": (()=>_ipv4),
    "_ipv6": (()=>_ipv6),
    "_isoDate": (()=>_isoDate),
    "_isoDateTime": (()=>_isoDateTime),
    "_isoDuration": (()=>_isoDuration),
    "_isoTime": (()=>_isoTime),
    "_jwt": (()=>_jwt),
    "_ksuid": (()=>_ksuid),
    "_lazy": (()=>_lazy),
    "_length": (()=>_length),
    "_literal": (()=>_literal),
    "_lowercase": (()=>_lowercase),
    "_lt": (()=>_lt),
    "_lte": (()=>_lte),
    "_map": (()=>_map),
    "_max": (()=>_lte),
    "_maxLength": (()=>_maxLength),
    "_maxSize": (()=>_maxSize),
    "_mime": (()=>_mime),
    "_min": (()=>_gte),
    "_minLength": (()=>_minLength),
    "_minSize": (()=>_minSize),
    "_multipleOf": (()=>_multipleOf),
    "_nan": (()=>_nan),
    "_nanoid": (()=>_nanoid),
    "_nativeEnum": (()=>_nativeEnum),
    "_negative": (()=>_negative),
    "_never": (()=>_never),
    "_nonnegative": (()=>_nonnegative),
    "_nonoptional": (()=>_nonoptional),
    "_nonpositive": (()=>_nonpositive),
    "_normalize": (()=>_normalize),
    "_null": (()=>_null),
    "_nullable": (()=>_nullable),
    "_number": (()=>_number),
    "_optional": (()=>_optional),
    "_overwrite": (()=>_overwrite),
    "_pipe": (()=>_pipe),
    "_positive": (()=>_positive),
    "_promise": (()=>_promise),
    "_property": (()=>_property),
    "_readonly": (()=>_readonly),
    "_record": (()=>_record),
    "_refine": (()=>_refine),
    "_regex": (()=>_regex),
    "_set": (()=>_set),
    "_size": (()=>_size),
    "_startsWith": (()=>_startsWith),
    "_string": (()=>_string),
    "_stringbool": (()=>_stringbool),
    "_success": (()=>_success),
    "_symbol": (()=>_symbol),
    "_templateLiteral": (()=>_templateLiteral),
    "_toLowerCase": (()=>_toLowerCase),
    "_toUpperCase": (()=>_toUpperCase),
    "_transform": (()=>_transform),
    "_trim": (()=>_trim),
    "_tuple": (()=>_tuple),
    "_uint32": (()=>_uint32),
    "_uint64": (()=>_uint64),
    "_ulid": (()=>_ulid),
    "_undefined": (()=>_undefined),
    "_union": (()=>_union),
    "_unknown": (()=>_unknown),
    "_uppercase": (()=>_uppercase),
    "_url": (()=>_url),
    "_uuid": (()=>_uuid),
    "_uuidv4": (()=>_uuidv4),
    "_uuidv6": (()=>_uuidv6),
    "_uuidv7": (()=>_uuidv7),
    "_void": (()=>_void),
    "_xid": (()=>_xid)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/checks.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/schemas.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/schemas.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
;
;
;
function _string(Class, params) {
    return new Class({
        type: "string",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _coercedString(Class, params) {
    return new Class({
        type: "string",
        coerce: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _email(Class, params) {
    return new Class({
        type: "string",
        format: "email",
        check: "string_format",
        abort: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _guid(Class, params) {
    return new Class({
        type: "string",
        format: "guid",
        check: "string_format",
        abort: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _uuid(Class, params) {
    return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _uuidv4(Class, params) {
    return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        version: "v4",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _uuidv6(Class, params) {
    return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        version: "v6",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _uuidv7(Class, params) {
    return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        version: "v7",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _url(Class, params) {
    return new Class({
        type: "string",
        format: "url",
        check: "string_format",
        abort: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _emoji(Class, params) {
    return new Class({
        type: "string",
        format: "emoji",
        check: "string_format",
        abort: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _nanoid(Class, params) {
    return new Class({
        type: "string",
        format: "nanoid",
        check: "string_format",
        abort: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _cuid(Class, params) {
    return new Class({
        type: "string",
        format: "cuid",
        check: "string_format",
        abort: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _cuid2(Class, params) {
    return new Class({
        type: "string",
        format: "cuid2",
        check: "string_format",
        abort: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _ulid(Class, params) {
    return new Class({
        type: "string",
        format: "ulid",
        check: "string_format",
        abort: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _xid(Class, params) {
    return new Class({
        type: "string",
        format: "xid",
        check: "string_format",
        abort: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _ksuid(Class, params) {
    return new Class({
        type: "string",
        format: "ksuid",
        check: "string_format",
        abort: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _ipv4(Class, params) {
    return new Class({
        type: "string",
        format: "ipv4",
        check: "string_format",
        abort: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _ipv6(Class, params) {
    return new Class({
        type: "string",
        format: "ipv6",
        check: "string_format",
        abort: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _cidrv4(Class, params) {
    return new Class({
        type: "string",
        format: "cidrv4",
        check: "string_format",
        abort: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _cidrv6(Class, params) {
    return new Class({
        type: "string",
        format: "cidrv6",
        check: "string_format",
        abort: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _base64(Class, params) {
    return new Class({
        type: "string",
        format: "base64",
        check: "string_format",
        abort: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _base64url(Class, params) {
    return new Class({
        type: "string",
        format: "base64url",
        check: "string_format",
        abort: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _e164(Class, params) {
    return new Class({
        type: "string",
        format: "e164",
        check: "string_format",
        abort: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _jwt(Class, params) {
    return new Class({
        type: "string",
        format: "jwt",
        check: "string_format",
        abort: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _isoDateTime(Class, params) {
    return new Class({
        type: "string",
        format: "datetime",
        check: "string_format",
        offset: false,
        local: false,
        precision: null,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _isoDate(Class, params) {
    return new Class({
        type: "string",
        format: "date",
        check: "string_format",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _isoTime(Class, params) {
    return new Class({
        type: "string",
        format: "time",
        check: "string_format",
        precision: null,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _isoDuration(Class, params) {
    return new Class({
        type: "string",
        format: "duration",
        check: "string_format",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _number(Class, params) {
    return new Class({
        type: "number",
        checks: [],
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _coercedNumber(Class, params) {
    return new Class({
        type: "number",
        coerce: true,
        checks: [],
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _int(Class, params) {
    return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "safeint",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _float32(Class, params) {
    return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "float32",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _float64(Class, params) {
    return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "float64",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _int32(Class, params) {
    return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "int32",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _uint32(Class, params) {
    return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "uint32",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _boolean(Class, params) {
    return new Class({
        type: "boolean",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _coercedBoolean(Class, params) {
    return new Class({
        type: "boolean",
        coerce: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _bigint(Class, params) {
    return new Class({
        type: "bigint",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _coercedBigint(Class, params) {
    return new Class({
        type: "bigint",
        coerce: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _int64(Class, params) {
    return new Class({
        type: "bigint",
        check: "bigint_format",
        abort: false,
        format: "int64",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _uint64(Class, params) {
    return new Class({
        type: "bigint",
        check: "bigint_format",
        abort: false,
        format: "uint64",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _symbol(Class, params) {
    return new Class({
        type: "symbol",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _undefined(Class, params) {
    return new Class({
        type: "undefined",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _null(Class, params) {
    return new Class({
        type: "null",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _any(Class) {
    return new Class({
        type: "any"
    });
}
function _unknown(Class) {
    return new Class({
        type: "unknown"
    });
}
function _never(Class, params) {
    return new Class({
        type: "never",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _void(Class, params) {
    return new Class({
        type: "void",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _date(Class, params) {
    return new Class({
        type: "date",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _coercedDate(Class, params) {
    return new Class({
        type: "date",
        coerce: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _nan(Class, params) {
    return new Class({
        type: "nan",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _lt(value, params) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckLessThan"]({
        check: "less_than",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params),
        value,
        inclusive: false
    });
}
function _lte(value, params) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckLessThan"]({
        check: "less_than",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params),
        value,
        inclusive: true
    });
}
;
function _gt(value, params) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckGreaterThan"]({
        check: "greater_than",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params),
        value,
        inclusive: false
    });
}
function _gte(value, params) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckGreaterThan"]({
        check: "greater_than",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params),
        value,
        inclusive: true
    });
}
;
function _positive(params) {
    return _gt(0, params);
}
function _negative(params) {
    return _lt(0, params);
}
function _nonpositive(params) {
    return _lte(0, params);
}
function _nonnegative(params) {
    return _gte(0, params);
}
function _multipleOf(value, params) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckMultipleOf"]({
        check: "multiple_of",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params),
        value
    });
}
function _maxSize(maximum, params) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckMaxSize"]({
        check: "max_size",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params),
        maximum
    });
}
function _minSize(minimum, params) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckMinSize"]({
        check: "min_size",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params),
        minimum
    });
}
function _size(size, params) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckSizeEquals"]({
        check: "size_equals",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params),
        size
    });
}
function _maxLength(maximum, params) {
    const ch = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckMaxLength"]({
        check: "max_length",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params),
        maximum
    });
    return ch;
}
function _minLength(minimum, params) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckMinLength"]({
        check: "min_length",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params),
        minimum
    });
}
function _length(length, params) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckLengthEquals"]({
        check: "length_equals",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params),
        length
    });
}
function _regex(pattern, params) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckRegex"]({
        check: "string_format",
        format: "regex",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params),
        pattern
    });
}
function _lowercase(params) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckLowerCase"]({
        check: "string_format",
        format: "lowercase",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _uppercase(params) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckUpperCase"]({
        check: "string_format",
        format: "uppercase",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _includes(includes, params) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckIncludes"]({
        check: "string_format",
        format: "includes",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params),
        includes
    });
}
function _startsWith(prefix, params) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckStartsWith"]({
        check: "string_format",
        format: "starts_with",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params),
        prefix
    });
}
function _endsWith(suffix, params) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckEndsWith"]({
        check: "string_format",
        format: "ends_with",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params),
        suffix
    });
}
function _property(property, schema, params) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckProperty"]({
        check: "property",
        property,
        schema,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _mime(types, params) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckMimeType"]({
        check: "mime_type",
        mime: types,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _overwrite(tx) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodCheckOverwrite"]({
        check: "overwrite",
        tx
    });
}
function _normalize(form) {
    return _overwrite((input)=>input.normalize(form));
}
function _trim() {
    return _overwrite((input)=>input.trim());
}
function _toLowerCase() {
    return _overwrite((input)=>input.toLowerCase());
}
function _toUpperCase() {
    return _overwrite((input)=>input.toUpperCase());
}
function _array(Class, element, params) {
    return new Class({
        type: "array",
        element,
        // get element() {
        //   return element;
        // },
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _union(Class, options, params) {
    return new Class({
        type: "union",
        options,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _discriminatedUnion(Class, discriminator, options, params) {
    return new Class({
        type: "union",
        options,
        discriminator,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _intersection(Class, left, right) {
    return new Class({
        type: "intersection",
        left,
        right
    });
}
function _tuple(Class, items, _paramsOrRest, _params) {
    const hasRest = _paramsOrRest instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$ZodType"];
    const params = hasRest ? _params : _paramsOrRest;
    const rest = hasRest ? _paramsOrRest : null;
    return new Class({
        type: "tuple",
        items,
        rest,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _record(Class, keyType, valueType, params) {
    return new Class({
        type: "record",
        keyType,
        valueType,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _map(Class, keyType, valueType, params) {
    return new Class({
        type: "map",
        keyType,
        valueType,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _set(Class, valueType, params) {
    return new Class({
        type: "set",
        valueType,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _enum(Class, values, params) {
    const entries = Array.isArray(values) ? Object.fromEntries(values.map((v)=>[
            v,
            v
        ])) : values;
    // if (Array.isArray(values)) {
    //   for (const value of values) {
    //     entries[value] = value;
    //   }
    // } else {
    //   Object.assign(entries, values);
    // }
    // const entries: util.EnumLike = {};
    // for (const val of values) {
    //   entries[val] = val;
    // }
    return new Class({
        type: "enum",
        entries,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _nativeEnum(Class, entries, params) {
    return new Class({
        type: "enum",
        entries,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _literal(Class, value, params) {
    return new Class({
        type: "literal",
        values: Array.isArray(value) ? value : [
            value
        ],
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _file(Class, params) {
    return new Class({
        type: "file",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _transform(Class, fn) {
    return new Class({
        type: "transform",
        transform: fn
    });
}
function _optional(Class, innerType) {
    return new Class({
        type: "optional",
        innerType
    });
}
function _nullable(Class, innerType) {
    return new Class({
        type: "nullable",
        innerType
    });
}
function _default(Class, innerType, defaultValue) {
    return new Class({
        type: "default",
        innerType,
        get defaultValue () {
            return typeof defaultValue === "function" ? defaultValue() : defaultValue;
        }
    });
}
function _nonoptional(Class, innerType, params) {
    return new Class({
        type: "nonoptional",
        innerType,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _success(Class, innerType) {
    return new Class({
        type: "success",
        innerType
    });
}
function _catch(Class, innerType, catchValue) {
    return new Class({
        type: "catch",
        innerType,
        catchValue: typeof catchValue === "function" ? catchValue : ()=>catchValue
    });
}
function _pipe(Class, in_, out) {
    return new Class({
        type: "pipe",
        in: in_,
        out
    });
}
function _readonly(Class, innerType) {
    return new Class({
        type: "readonly",
        innerType
    });
}
function _templateLiteral(Class, parts, params) {
    return new Class({
        type: "template_literal",
        parts,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(params)
    });
}
function _lazy(Class, getter) {
    return new Class({
        type: "lazy",
        getter
    });
}
function _promise(Class, innerType) {
    return new Class({
        type: "promise",
        innerType
    });
}
function _custom(Class, fn, _params) {
    const schema = new Class({
        type: "custom",
        check: "custom",
        fn: fn,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(_params)
    });
    return schema;
}
function _refine(Class, fn, _params = {}) {
    return _custom(Class, fn, _params);
}
function _stringbool(Classes, _params) {
    const { case: _case, error, truthy, falsy } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeParams"])(_params);
    const trueValues = new Set(truthy ?? [
        "true",
        "1",
        "yes",
        "on",
        "y",
        "enabled"
    ]);
    const falseValues = new Set(falsy ?? [
        "false",
        "0",
        "no",
        "off",
        "n",
        "disabled"
    ]);
    const _Pipe = Classes.Pipe ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$ZodPipe"];
    const _Boolean = Classes.Boolean ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$ZodBoolean"];
    const _Unknown = Classes.Unknown ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$ZodUnknown"];
    const inst = new _Unknown({
        type: "unknown",
        checks: [
            {
                _zod: {
                    check: (ctx)=>{
                        if (typeof ctx.value === "string") {
                            let data = ctx.value;
                            if (_case !== "sensitive") data = data.toLowerCase();
                            if (trueValues.has(data)) {
                                ctx.value = true;
                            } else if (falseValues.has(data)) {
                                ctx.value = false;
                            } else {
                                ctx.issues.push({
                                    code: "invalid_value",
                                    expected: "stringbool",
                                    values: [
                                        ...trueValues,
                                        ...falseValues
                                    ],
                                    input: ctx.value,
                                    inst
                                });
                            }
                        } else {
                            ctx.issues.push({
                                code: "invalid_type",
                                expected: "string",
                                input: ctx.value
                            });
                        }
                    },
                    def: {
                        check: "custom"
                    },
                    onattach: []
                }
            }
        ],
        error
    });
    return new _Pipe({
        type: "pipe",
        in: inst,
        out: new _Boolean({
            type: "boolean",
            error
        }),
        error
    });
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/function.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "$ZodFunction": (()=>$ZodFunction),
    "function": (()=>_function)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$api$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/api.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$parse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/parse.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/schemas.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/schemas.js [app-route] (ecmascript) <locals>");
;
;
;
;
class $ZodFunction {
    constructor(def){
        this._def = def;
        this.def = def;
    }
    implement(func) {
        if (typeof func !== "function") {
            throw new Error("implement() must be called with a function");
        }
        const impl = (...args)=>{
            const parsedArgs = this._def.input ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$parse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parse"])(this._def.input, args, undefined, {
                callee: impl
            }) : args;
            if (!Array.isArray(parsedArgs)) {
                throw new Error("Invalid arguments schema: not an array or tuple schema.");
            }
            const output = func(...parsedArgs);
            return this._def.output ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$parse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parse"])(this._def.output, output, undefined, {
                callee: impl
            }) : output;
        };
        return impl;
    }
    implementAsync(func) {
        if (typeof func !== "function") {
            throw new Error("implement() must be called with a function");
        }
        const impl = async (...args)=>{
            const parsedArgs = this._def.input ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$parse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseAsync"])(this._def.input, args, undefined, {
                callee: impl
            }) : args;
            if (!Array.isArray(parsedArgs)) {
                throw new Error("Invalid arguments schema: not an array or tuple schema.");
            }
            const output = await func(...parsedArgs);
            return this._def.output ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$parse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseAsync"])(this._def.output, output, undefined, {
                callee: impl
            }) : output;
        };
        return impl;
    }
    input(...args) {
        if (Array.isArray(args[0])) {
            return new $ZodFunction({
                type: "function",
                input: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$ZodTuple"]({
                    type: "tuple",
                    items: args[0],
                    rest: args[1]
                }),
                output: this._def.output
            });
        }
        return new $ZodFunction({
            type: "function",
            input: args[0],
            output: this._def.output
        });
    }
    output(output) {
        return new $ZodFunction({
            type: "function",
            input: this._def.input,
            output
        });
    }
}
function _function(params) {
    return new $ZodFunction({
        type: "function",
        input: Array.isArray(params?.input) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$api$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["_tuple"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$ZodTuple"], params?.input) : params?.input ?? null,
        output: params?.output ?? null
    });
}
;
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/to-json-schema.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "JSONSchemaGenerator": (()=>JSONSchemaGenerator),
    "toJSONSchema": (()=>toJSONSchema)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$registries$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/registries.js [app-route] (ecmascript)");
;
const formatMap = {
    guid: "uuid",
    url: "uri",
    datetime: "date-time",
    json_string: "json-string",
    regex: ""
};
class JSONSchemaGenerator {
    constructor(params){
        this.counter = 0;
        this.metadataRegistry = params?.metadata ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$registries$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["globalRegistry"];
        this.target = params?.target ?? "draft-2020-12";
        this.unrepresentable = params?.unrepresentable ?? "throw";
        this.override = params?.override ?? (()=>{});
        this.io = params?.io ?? "output";
        this.seen = new Map();
    }
    process(schema, _params = {
        path: [],
        schemaPath: []
    }) {
        var _a;
        const def = schema._zod.def;
        // check for schema in seens
        const seen = this.seen.get(schema);
        if (seen) {
            seen.count++;
            // check if cycle
            const isCycle = _params.schemaPath.includes(schema);
            if (isCycle) {
                seen.cycle = _params.path;
            }
            seen.count++;
            // break cycle
            return seen.schema;
        }
        // initialize
        const result = {
            schema: {},
            count: 1,
            cycle: undefined
        };
        this.seen.set(schema, result);
        if (schema._zod.toJSONSchema) {
            // custom method overrides default behavior
            result.schema = schema._zod.toJSONSchema();
        }
        // check if external
        // const ext = this.external?.registry.get(schema)?.id;
        // if (ext) {
        //   result.external = ext;
        // }
        const params = {
            ..._params,
            schemaPath: [
                ..._params.schemaPath,
                schema
            ],
            path: _params.path
        };
        const parent = schema._zod.parent;
        // if (parent) {
        //   // schema was cloned from another schema
        //   result.ref = parent;
        //   this.process(parent, params);
        //   this.seen.get(parent)!.isParent = true;
        // }
        if (parent) {
            // schema was cloned from another schema
            result.ref = parent;
            this.process(parent, params);
            this.seen.get(parent).isParent = true;
        } else {
            const _json = result.schema;
            switch(def.type){
                case "string":
                    {
                        const json = _json;
                        json.type = "string";
                        const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
                        if (typeof minimum === "number") json.minLength = minimum;
                        if (typeof maximum === "number") json.maxLength = maximum;
                        // custom pattern overrides format
                        if (format) {
                            json.format = formatMap[format] ?? format;
                            if (json.format === "") delete json.format; // empty format is not valid
                        }
                        if (contentEncoding) json.contentEncoding = contentEncoding;
                        if (patterns && patterns.size > 0) {
                            const regexes = [
                                ...patterns
                            ];
                            if (regexes.length === 1) json.pattern = regexes[0].source;
                            else if (regexes.length > 1) {
                                result.schema.allOf = [
                                    ...regexes.map((regex)=>({
                                            ...this.target === "draft-7" ? {
                                                type: "string"
                                            } : {},
                                            pattern: regex.source
                                        }))
                                ];
                            }
                        }
                        break;
                    }
                case "number":
                    {
                        const json = _json;
                        const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
                        if (typeof format === "string" && format.includes("int")) json.type = "integer";
                        else json.type = "number";
                        if (typeof exclusiveMinimum === "number") json.exclusiveMinimum = exclusiveMinimum;
                        if (typeof minimum === "number") {
                            json.minimum = minimum;
                            if (typeof exclusiveMinimum === "number") {
                                if (exclusiveMinimum >= minimum) delete json.minimum;
                                else delete json.exclusiveMinimum;
                            }
                        }
                        if (typeof exclusiveMaximum === "number") json.exclusiveMaximum = exclusiveMaximum;
                        if (typeof maximum === "number") {
                            json.maximum = maximum;
                            if (typeof exclusiveMaximum === "number") {
                                if (exclusiveMaximum <= maximum) delete json.maximum;
                                else delete json.exclusiveMaximum;
                            }
                        }
                        if (typeof multipleOf === "number") json.multipleOf = multipleOf;
                        break;
                    }
                case "boolean":
                    {
                        const json = _json;
                        json.type = "boolean";
                        break;
                    }
                case "bigint":
                    {
                        if (this.unrepresentable === "throw") {
                            throw new Error("BigInt cannot be represented in JSON Schema");
                        }
                        break;
                    }
                case "symbol":
                    {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Symbols cannot be represented in JSON Schema");
                        }
                        break;
                    }
                case "undefined":
                    {
                        const json = _json;
                        json.type = "null";
                        break;
                    }
                case "null":
                    {
                        _json.type = "null";
                        break;
                    }
                case "any":
                    {
                        break;
                    }
                case "unknown":
                    {
                        break;
                    }
                case "never":
                    {
                        _json.not = {};
                        break;
                    }
                case "void":
                    {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Void cannot be represented in JSON Schema");
                        }
                        break;
                    }
                case "date":
                    {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Date cannot be represented in JSON Schema");
                        }
                        break;
                    }
                case "array":
                    {
                        const json = _json;
                        const { minimum, maximum } = schema._zod.bag;
                        if (typeof minimum === "number") json.minItems = minimum;
                        if (typeof maximum === "number") json.maxItems = maximum;
                        json.type = "array";
                        json.items = this.process(def.element, {
                            ...params,
                            path: [
                                ...params.path,
                                "items"
                            ]
                        });
                        break;
                    }
                case "object":
                    {
                        const json = _json;
                        json.type = "object";
                        json.properties = {};
                        const shape = def.shape; // params.shapeCache.get(schema)!;
                        for(const key in shape){
                            json.properties[key] = this.process(shape[key], {
                                ...params,
                                path: [
                                    ...params.path,
                                    "properties",
                                    key
                                ]
                            });
                        }
                        // required keys
                        const allKeys = new Set(Object.keys(shape));
                        // const optionalKeys = new Set(def.optional);
                        const requiredKeys = new Set([
                            ...allKeys
                        ].filter((key)=>{
                            const v = def.shape[key]._zod;
                            if (this.io === "input") {
                                return v.optin === undefined;
                            } else {
                                return v.optout === undefined;
                            }
                        }));
                        json.required = Array.from(requiredKeys);
                        // catchall
                        if (def.catchall?._zod.def.type === "never") {
                            // strict
                            json.additionalProperties = false;
                        } else if (!def.catchall) {
                            // regular
                            if (this.io === "output") json.additionalProperties = false;
                        } else if (def.catchall) {
                            json.additionalProperties = this.process(def.catchall, {
                                ...params,
                                path: [
                                    ...params.path,
                                    "additionalProperties"
                                ]
                            });
                        }
                        break;
                    }
                case "union":
                    {
                        const json = _json;
                        json.anyOf = def.options.map((x, i)=>this.process(x, {
                                ...params,
                                path: [
                                    ...params.path,
                                    "anyOf",
                                    i
                                ]
                            }));
                        break;
                    }
                case "intersection":
                    {
                        const json = _json;
                        json.allOf = [
                            this.process(def.left, {
                                ...params,
                                path: [
                                    ...params.path,
                                    "allOf",
                                    0
                                ]
                            }),
                            this.process(def.right, {
                                ...params,
                                path: [
                                    ...params.path,
                                    "allOf",
                                    1
                                ]
                            })
                        ];
                        break;
                    }
                case "tuple":
                    {
                        const json = _json;
                        json.type = "array";
                        const prefixItems = def.items.map((x, i)=>this.process(x, {
                                ...params,
                                path: [
                                    ...params.path,
                                    "prefixItems",
                                    i
                                ]
                            }));
                        if (this.target === "draft-2020-12") {
                            json.prefixItems = prefixItems;
                        } else {
                            json.items = prefixItems;
                        }
                        if (def.rest) {
                            const rest = this.process(def.rest, {
                                ...params,
                                path: [
                                    ...params.path,
                                    "items"
                                ]
                            });
                            if (this.target === "draft-2020-12") {
                                json.items = rest;
                            } else {
                                json.additionalItems = rest;
                            }
                        }
                        // additionalItems
                        if (def.rest) {
                            json.items = this.process(def.rest, {
                                ...params,
                                path: [
                                    ...params.path,
                                    "items"
                                ]
                            });
                        }
                        // length
                        const { minimum, maximum } = schema._zod.bag;
                        if (typeof minimum === "number") json.minItems = minimum;
                        if (typeof maximum === "number") json.maxItems = maximum;
                        break;
                    }
                case "record":
                    {
                        const json = _json;
                        json.type = "object";
                        json.propertyNames = this.process(def.keyType, {
                            ...params,
                            path: [
                                ...params.path,
                                "propertyNames"
                            ]
                        });
                        json.additionalProperties = this.process(def.valueType, {
                            ...params,
                            path: [
                                ...params.path,
                                "additionalProperties"
                            ]
                        });
                        break;
                    }
                case "map":
                    {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Map cannot be represented in JSON Schema");
                        }
                        break;
                    }
                case "set":
                    {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Set cannot be represented in JSON Schema");
                        }
                        break;
                    }
                case "enum":
                    {
                        const json = _json;
                        json.enum = Object.values(def.entries);
                        break;
                    }
                case "literal":
                    {
                        const json = _json;
                        const vals = [];
                        for (const val of def.values){
                            if (val === undefined) {
                                if (this.unrepresentable === "throw") {
                                    throw new Error("Literal `undefined` cannot be represented in JSON Schema");
                                } else {
                                // do not add to vals
                                }
                            } else if (typeof val === "bigint") {
                                if (this.unrepresentable === "throw") {
                                    throw new Error("BigInt literals cannot be represented in JSON Schema");
                                } else {
                                    vals.push(Number(val));
                                }
                            } else {
                                vals.push(val);
                            }
                        }
                        if (vals.length === 0) {
                        // do nothing (an undefined literal was stripped)
                        } else if (vals.length === 1) {
                            const val = vals[0];
                            json.const = val;
                        } else {
                            json.enum = vals;
                        }
                        break;
                    }
                case "file":
                    {
                        if (this.unrepresentable === "throw") {
                            throw new Error("File cannot be represented in JSON Schema");
                        }
                        break;
                    }
                case "transform":
                    {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Transforms cannot be represented in JSON Schema");
                        }
                        break;
                    }
                case "nullable":
                    {
                        const inner = this.process(def.innerType, params);
                        _json.anyOf = [
                            inner,
                            {
                                type: "null"
                            }
                        ];
                        break;
                    }
                case "nonoptional":
                    {
                        this.process(def.innerType, params);
                        result.ref = def.innerType;
                        break;
                    }
                case "success":
                    {
                        const json = _json;
                        json.type = "boolean";
                        break;
                    }
                case "default":
                    {
                        this.process(def.innerType, params);
                        result.ref = def.innerType;
                        _json.default = def.defaultValue;
                        break;
                    }
                case "prefault":
                    {
                        this.process(def.innerType, params);
                        result.ref = def.innerType;
                        if (this.io === "input") _json._prefault = def.defaultValue;
                        break;
                    }
                case "catch":
                    {
                        // use conditionals
                        this.process(def.innerType, params);
                        result.ref = def.innerType;
                        let catchValue;
                        try {
                            catchValue = def.catchValue(undefined);
                        } catch  {
                            throw new Error("Dynamic catch values are not supported in JSON Schema");
                        }
                        _json.default = catchValue;
                        break;
                    }
                case "nan":
                    {
                        if (this.unrepresentable === "throw") {
                            throw new Error("NaN cannot be represented in JSON Schema");
                        }
                        break;
                    }
                case "template_literal":
                    {
                        const json = _json;
                        const pattern = schema._zod.pattern;
                        if (!pattern) throw new Error("Pattern not found in template literal");
                        json.type = "string";
                        json.pattern = pattern.source;
                        break;
                    }
                case "pipe":
                    {
                        const innerType = this.io === "input" ? def.in : def.out;
                        this.process(innerType, params);
                        result.ref = innerType;
                        break;
                    }
                case "readonly":
                    {
                        this.process(def.innerType, params);
                        result.ref = def.innerType;
                        _json.readOnly = true;
                        break;
                    }
                // passthrough types
                case "promise":
                    {
                        this.process(def.innerType, params);
                        result.ref = def.innerType;
                        break;
                    }
                case "optional":
                    {
                        this.process(def.innerType, params);
                        result.ref = def.innerType;
                        break;
                    }
                case "lazy":
                    {
                        const innerType = schema._zod.innerType;
                        this.process(innerType, params);
                        result.ref = innerType;
                        break;
                    }
                case "custom":
                    {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Custom types cannot be represented in JSON Schema");
                        }
                        break;
                    }
                default:
                    {
                        def;
                    }
            }
        }
        // metadata
        const meta = this.metadataRegistry.get(schema);
        if (meta) Object.assign(result.schema, meta);
        if (this.io === "input" && def.type === "pipe") {
            // examples/defaults only apply to output type of pipe
            delete result.schema.examples;
            delete result.schema.default;
            if (result.schema._prefault) result.schema.default = result.schema._prefault;
        }
        if (this.io === "input" && result.schema._prefault) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
        delete result.schema._prefault;
        // pulling fresh from this.seen in case it was overwritten
        const _result = this.seen.get(schema);
        return _result.schema;
    }
    emit(schema, _params) {
        const params = {
            cycles: _params?.cycles ?? "ref",
            reused: _params?.reused ?? "inline",
            // unrepresentable: _params?.unrepresentable ?? "throw",
            // uri: _params?.uri ?? ((id) => `${id}`),
            external: _params?.external ?? undefined
        };
        // iterate over seen map;
        const root = this.seen.get(schema);
        if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
        // initialize result with root schema fields
        // Object.assign(result, seen.cached);
        const makeURI = (entry)=>{
            // comparing the seen objects because sometimes
            // multiple schemas map to the same seen object.
            // e.g. lazy
            // external is configured
            const defsSegment = this.target === "draft-2020-12" ? "$defs" : "definitions";
            if (params.external) {
                const externalId = params.external.registry.get(entry[0])?.id; // ?? "__shared";// `__schema${this.counter++}`;
                // check if schema is in the external registry
                if (externalId) return {
                    ref: params.external.uri(externalId)
                };
                // otherwise, add to __shared
                const id = entry[1].defId ?? entry[1].schema.id ?? `schema${this.counter++}`;
                entry[1].defId = id;
                return {
                    defId: id,
                    ref: `${params.external.uri("__shared")}#/${defsSegment}/${id}`
                };
            }
            if (entry[1] === root) {
                return {
                    ref: "#"
                };
            }
            // self-contained schema
            const uriPrefix = `#`;
            const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
            const defId = entry[1].schema.id ?? `__schema${this.counter++}`;
            return {
                defId,
                ref: defUriPrefix + defId
            };
        };
        const extractToDef = (entry)=>{
            if (entry[1].schema.$ref) {
                return;
            }
            const seen = entry[1];
            const { ref, defId } = makeURI(entry);
            seen.def = {
                ...seen.schema
            };
            // defId won't be set if the schema is a reference to an external schema
            if (defId) seen.defId = defId;
            // wipe away all properties except $ref
            const schema = seen.schema;
            for(const key in schema){
                delete schema[key];
                schema.$ref = ref;
            }
        };
        // extract schemas into $defs
        for (const entry of this.seen.entries()){
            const seen = entry[1];
            // convert root schema to # $ref
            // also prevents root schema from being extracted
            if (schema === entry[0]) {
                // do not copy to defs...this is the root schema
                extractToDef(entry);
                continue;
            }
            // extract schemas that are in the external registry
            if (params.external) {
                const ext = params.external.registry.get(entry[0])?.id;
                if (schema !== entry[0] && ext) {
                    extractToDef(entry);
                    continue;
                }
            }
            // extract schemas with `id` meta
            const id = this.metadataRegistry.get(entry[0])?.id;
            if (id) {
                extractToDef(entry);
                continue;
            }
            // break cycles
            if (seen.cycle) {
                if (params.cycles === "throw") {
                    throw new Error("Cycle detected: " + `#/${seen.cycle?.join("/")}/<root>` + '\n\nSet the `cycles` parameter to `"ref"` to resolve cyclical schemas with defs.');
                } else if (params.cycles === "ref") {
                    extractToDef(entry);
                }
                continue;
            }
            // extract reused schemas
            if (seen.count > 1) {
                if (params.reused === "ref") {
                    extractToDef(entry);
                    continue;
                }
            }
        }
        // flatten _refs
        const flattenRef = (zodSchema, params)=>{
            const seen = this.seen.get(zodSchema);
            const schema = seen.def ?? seen.schema;
            const _schema = {
                ...schema
            };
            if (seen.ref === null) {
                return;
            }
            const ref = seen.ref;
            seen.ref = null;
            if (ref) {
                flattenRef(ref, params);
                const refSchema = this.seen.get(ref).schema;
                if (refSchema.$ref && params.target === "draft-7") {
                    schema.allOf = schema.allOf ?? [];
                    schema.allOf.push(refSchema);
                } else {
                    Object.assign(schema, refSchema);
                    Object.assign(schema, _schema); // this is to prevent overwriting any fields in the original schema
                }
            }
            if (!seen.isParent) this.override({
                zodSchema: zodSchema,
                jsonSchema: schema
            });
        };
        for (const entry of [
            ...this.seen.entries()
        ].reverse()){
            flattenRef(entry[0], {
                target: this.target
            });
        }
        const result = {};
        if (this.target === "draft-2020-12") {
            result.$schema = "https://json-schema.org/draft/2020-12/schema";
        } else if (this.target === "draft-7") {
            result.$schema = "http://json-schema.org/draft-07/schema#";
        } else {
            console.warn(`Invalid target: ${this.target}`);
        }
        Object.assign(result, root.def);
        const defs = params.external?.defs ?? {};
        for (const entry of this.seen.entries()){
            const seen = entry[1];
            if (seen.def && seen.defId) {
                defs[seen.defId] = seen.def;
            }
        }
        // set definitions in result
        if (!params.external && Object.keys(defs).length > 0) {
            if (this.target === "draft-2020-12") {
                result.$defs = defs;
            } else {
                result.definitions = defs;
            }
        }
        try {
            // this "finalizes" this schema and ensures all cycles are removed
            // each call to .emit() is functionally independent
            // though the seen map is shared
            return JSON.parse(JSON.stringify(result));
        } catch (_err) {
            throw new Error("Error converting schema to JSON.");
        }
    }
}
function toJSONSchema(input, _params) {
    if (input instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$registries$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["$ZodRegistry"]) {
        const gen = new JSONSchemaGenerator(_params);
        const defs = {};
        for (const entry of input._idmap.entries()){
            const [_, schema] = entry;
            gen.process(schema);
        }
        const schemas = {};
        const external = {
            registry: input,
            uri: _params?.uri || ((id)=>id),
            defs
        };
        for (const entry of input._idmap.entries()){
            const [key, schema] = entry;
            schemas[key] = gen.emit(schema, {
                ..._params,
                external
            });
        }
        if (Object.keys(defs).length > 0) {
            const defsSegment = gen.target === "draft-2020-12" ? "$defs" : "definitions";
            schemas.__shared = {
                [defsSegment]: defs
            };
        }
        return {
            schemas
        };
    }
    const gen = new JSONSchemaGenerator(_params);
    gen.process(input);
    return gen.emit(input, _params);
}
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/json-schema.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
;
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/index.js [app-route] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/core.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$parse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/parse.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/errors.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/schemas.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/checks.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$versions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/versions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/regexes.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$registries$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/registries.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$doc$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/doc.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$function$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/function.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$api$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/api.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$to$2d$json$2d$schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/to-json-schema.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$json$2d$schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/json-schema.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
}}),
"[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/index.js [app-route] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/core.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$parse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/parse.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/errors.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/schemas.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$checks$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/checks.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$versions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/versions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$util$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/util.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$regexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/regexes.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$locales$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/locales/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$registries$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/registries.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$doc$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/doc.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$function$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/function.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$api$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/api.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$to$2d$json$2d$schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/to-json-schema.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$json$2d$schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/json-schema.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$langchain$2f$openai$2f$node_modules$2f$zod$2f$dist$2f$esm$2f$v4$2f$core$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@langchain/openai/node_modules/zod/dist/esm/v4/core/index.js [app-route] (ecmascript) <locals>");
}}),

};

//# sourceMappingURL=c3486_zod_dist_esm_v4_5997b61f._.js.map