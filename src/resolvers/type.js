"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'subschema';
import injector from '../injector';
import {extendPrototype} from '../util';

const {loader} = PropTypes;


export default function type(Clazz, props, key, value) {


    Clazz.contextTypes.loader = loader;

    function resolve(val, context) {
        return injector.inject(context.loader.loadType(val));
    }


    extendPrototype(Clazz, 'componentWillMount', function type$willMount() {
        this.injected[key] = resolve(this.props[key], this.context);
    });

    extendPrototype(Clazz, 'componentWillReceiveProps', function (newProps, context) {
        if (this.props[key] !== newProps[key]) {
            this.injected[key] = resolve(key, context);
        }
    });
}
