"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'subschema';
import {extendPrototype, resolveKey} from '../util';

function resolve(context, path, value) {
    const resolvedPath = resolveKey(path, value);
    return (v) => context.valueManager.update(resolvedPath, v);
}

export default function valueEvent(Clazz, key) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    extendPrototype(Clazz, 'componentWillMount', function valueEvent$willMount() {
        this.injected[key] = resolve(this.context, this.props.path, this.props[key]);
    });

    extendPrototype(Clazz, 'componentWillReceiveProps', function valueEvent$receiveProps(newProps, context) {
        if (this.props[key] !== newProps[key]) {
            this.injected[key] = resolve(context, newProps.path, newProps[key]);
        }
    });

}