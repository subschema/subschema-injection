"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'subschema';
import {extendPrototype} from '../util';

export default function valueEvent(Clazz, props, key, value) {
    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    extendPrototype(Clazz, 'componentWillMount', function valueEvent$willMount() {
        this.injected[key] = (val) => this.context.valueManager.update(this.props[key], val);
    });

    extendPrototype(Clazz, 'componentWillReceiveProps', function valueEvent$receiveProps(newProps, context) {
        if (this.props[key] !== newProps[key]) {
            this.injected[key] = (val) => context.valueManager.update(newProps[key], val);
        }
    });

}