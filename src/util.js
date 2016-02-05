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
export  {applyNice, extendPrototype, execArg, push, removeListeners, clearListeners}