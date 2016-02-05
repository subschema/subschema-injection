"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'subschema';
import {extendPrototype} from '../util';

export default function targetEvent(Clazz, props, key, value) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    extendPrototype(Clazz, 'componentWillMount', function targetEvent$willMount() {
        this.injected[key] = (e) => this.context.valueManager.update(this.props[value], e.target.value);
    });

    extendPrototype(Clazz, 'componentWillReceiveProps', function targetEvent$willRecieveProps(newProps) {
        if (this.props[key] !== newProps[key]) {
            this.injected[key] = (e) => this.context.valueManager.update(newProps[key], e.target.value);
        }
    });

}