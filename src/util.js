"use strict";


function applyNice(f1, f2) {
    if (f1 === f2 || !f2) return f1;
    if (!f1) return f2;
    return function applyNice$return(...args) {
        f1.apply(this, args);
        f2.apply(this, args);
    };
}

function extendPrototype(Clazz, property, fn) {
    Clazz.prototype[property] = applyNice(fn, Clazz.prototype[property]);
    return Clazz;
}

function execArg(v) {
    v && v();
}

const push = Function.apply.bind(Array.prototype.push);

function keyIn(key, ...args) {
    for (let i = 0; i < args.length; i++) {
        if (args[i] == null) continue;
        if (key in args[i])
            return args[i][key];
    }
    return;
}
function onlyKeys(keys, ...args) {
    const ret = {};
    const length = keys.length;
    const argLength = args.length;
    KEYS: for (let i = 0; i < length; i++) {
        const key = keys[i];
        ARGS: for (let j = 0; j < argLength; j++) {
            const arg = args[j];
            if (arg == null) continue ARGS;
            if (key in arg) {
                ret[key] = arg[key];
                continue KEYS;
            }
        }
    }

    return ret;
}
function uniqueKeys(...args) {
    const keys = [];
    for (let i = 0, l = args.length; i < l; i++) {
        if (args[i] == null) continue;
        const k = Object.keys(args[i]), jl = k.length;
        for (let j = 0; j < jl; j++) {
            if (keys.indexOf(k[j]) === -1) {
                keys.push(k[j]);
            }
        }
    }
    return keys;
}
function resolveKey(path, key) {
    if (!key) {
        return path;
    }
    if (key[0] != '.') {
        return key;
    }
    var parts = path ? path.split('.') : [];
    key = key.substring(1);
    while (key[0] === '.') {
        key = key.substring(1);
        parts.pop();
    }
    if (key) {
        parts.push(key);
    }
    return parts.length === 0 ? null : parts.join('.');
}

function removeListeners(listeners) {
    if (listeners) {
        listeners.forEach(execArg);
        listeners.length = 0;
    }
    return listeners;
}
function clearListeners() {
    if (this.listeners) {
        return removeListeners(this.listeners);
    }
}
export  {applyNice, extendPrototype, onlyKeys, keyIn, uniqueKeys, resolveKey, execArg, push, removeListeners, clearListeners}