"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'subschema';
import {extendPrototype, clearListeners, removeListeners, resolveKey} from '../util';

function handleListeners(scope, valueManager, path, key, value) {
    const listeners = removeListeners(scope.valueListeners) || (scope.valueListeners = []);
    const resolvedPath = resolveKey(path, value);
    listeners.push(valueManager.addListener(resolvedPath, (v)=> {
        scope.injected[key] = v;
        scope.forceUpdate();
    }, null, true).remove);
}

export default function value(Clazz, key) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    extendPrototype(Clazz, 'componentWillMount', function value$willMount() {
        handleListeners(this, this.context.valueManager, this.props.path, key, this.props[key]);
    });

    extendPrototype(Clazz, 'componentWillReceiveProps', function value$receiveProps(newProps, context) {
        if (this.props[key] !== newProps[key] || this.props.path !== newProps.path) {
            handleListeners(this, context.valueManager, newProps.path, key, newProps[key]);
        }
    });

    extendPrototype(Clazz, 'componentWillUnmount', function value$unmount() {
        removeListeners(this.valueListeners);
    });
}