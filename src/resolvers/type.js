"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'subschema';
import {extendPrototype} from '../util';
import defaults from 'lodash/object/defaults';
import {injector} from '../PropTypes';

const propTypes = {
    onChange: PropTypes.targetEvent,
    dataType: PropTypes.dataType,
    value: PropTypes.value,
    path: PropTypes.path
};

const defaultProps = {
    dataType: 'text'
};

function resolve(val, context) {
    const {type, ...rest} = typeof val === 'string' ? {type: val} : val;
    const def = defaults(rest, defaultProps);
    const Type = context.loader.loadType(type);
    return context.injector.inject(Type, propTypes, def);
}

export default function type(Clazz, key) {

    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz.contextTypes.injector = injector;

    extendPrototype(Clazz, 'componentWillMount', function type$willMount() {
        this.injected[key] = resolve(this.props[key], this.context);
    });

    extendPrototype(Clazz, 'componentWillReceiveProps', function type$recieveProps(newProps, context) {
        if (this.props[key] !== newProps[key]) {
            this.injected[key] = resolve(newProps[key], context);
        }
    });
}
