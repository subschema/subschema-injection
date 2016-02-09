"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'subschema';
import { resolveKey, prop} from '../util';

function resolve(value, key, props, context) {
    const resolvedPath = resolveKey(props.path, value);
    return function targetEvent$resolve(e) {
        context.valueManager.update(resolvedPath, e.target.value)
    }
}
export default function targetEvent(Clazz, key) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::prop(key, resolve)

}