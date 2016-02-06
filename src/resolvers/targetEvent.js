"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'subschema';
import {extendPrototype, resolveKey} from '../util';

function resolve(context, path, value) {
    const resolvedPath = resolveKey(path, value);
    return (e) => context.valueManager.update(resolvedPath, e.target.value)
}
export default function targetEvent(Clazz,  key) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    extendPrototype(Clazz, 'componentWillMount', function targetEvent$willMount() {
        this.injected[key] = resolve(this.context, this.props.path, this.props[key]);
    });

    extendPrototype(Clazz, 'componentWillReceiveProps', function targetEvent$willRecieveProps(newProps, context) {
        if (this.props[key] !== newProps[key]) {
            this.injected[key] = resolve(context, this.props.path, newProps[key]);
        }
    });

}