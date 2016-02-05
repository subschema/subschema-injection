"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'subschema';
import {extendPrototype, clearListeners, removeListeners} from '../util';


export default function valueEvent(Clazz, props, key, value) {
    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    function handleListeners(scope, props, context) {
        const listeners = removeListeners(scope.listeners) || (scope.listeners = []);
        listeners.push(context.valueManager.addListener(props[key], (v)=> {
            scope.injected[key] = v;
            scope.forceUpdate();
        }, null, true).remove);
        return listeners;
    }

    extendPrototype(Clazz, 'componentWillMount', function valueEvent$willMount() {
        handleListeners(this, this.props, this.context);
    });

    extendPrototype(Clazz, 'componentWillReceiveProps', function valueEvent$receiveProps(newProps, context) {
        if (this.props[key] !== newProps[key]) {
            handleListeners(this, this.props, this.context);
        }
    });

    extendPrototype(Clazz, 'componentWillUnmount', clearListeners);
}