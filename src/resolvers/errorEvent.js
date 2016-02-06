"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'subschema';
import {extendPrototype} from '../util';
export default function errorEvent(Clazz, key) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    extendPrototype(Clazz, 'componentWillMount', function () {
        this.injected[key] = (val)=> this.context.valueManager.updateErrors(this.props[key], val);

    });

    extendPrototype(Clazz, 'componentWillReceiveProps', function (newProps, context) {
        if (this.props[key] !== newProps[key]) {
            this.injected[key] = (val)=> context.valueManager.updateErrors(newProps[key], val);
        }
    });
}