"use strict";


function applyNice(f1, f2) {
    if (f1 === f2 || !f2) return f1;
    if (!f1) return f2;
    return function applyNice$return(...args) {
        this::f1(...args);
        this::f2(...args);
    };
}

function extendPrototype(property, fn) {
    this.prototype[property] = applyNice(fn, this.prototype[property]);
    return this;
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
function extend(name, fn) {
    const fn2 = this.prototype[name];
    this.prototype[name] = applyNice(fn, fn2);
}
function didMount() {
    this.mounted = true;
}

function listener(key, fn) {
    function listener$listen(props, context) {

        if (!this._listeners) {
            this._listeners = {};
        } else if (this._listeners[key]) {
            this._listeners[key]();
        }
        this._listeners[key] = this::fn(props[key], key, props, context);
    }

    this::extend('componentDidMount', didMount);

    this::extend('componentWillMount', function listener$willMount() {
        this.mounted = false;
        this::listener$listen(this.props, this.context);
    });

    this::extend('componentWillReceiveProps', listener$listen);

    this::unmount(function () {
        this.mounted = false;
        this._listeners && this._listeners[key] && this._listeners[key]();
    });

}
function prop(key, fn) {
    //this is class scope.
    this::extend('componentWillMount', function util$prop$willMount() {
        //this is instance scope.
        this.injected[key] = this::fn(this.props[key], key, this.props, this.context);
    });

    this::extend('componentWillReceiveProps', function util$prop$receiveProps(props, context) {
        if (props[key] !== this.props[key]) {
            this.injected[key] = this::fn(props[key], key, props, context);
        }
    });

    return this;
}
function extendStatic(name, value) {
    this[name] = value;
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
function unmount(fn) {
    this.prototype.componentWillUnmount = applyNice(fn, this.prototype.componentWillUnmount);
}

export  {applyNice,listener, extend, prop, unmount, extendStatic, extendPrototype, onlyKeys, keyIn, uniqueKeys, resolveKey, execArg, push, removeListeners, clearListeners}