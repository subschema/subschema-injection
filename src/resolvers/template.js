"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'subschema';
import {extendPrototype} from '../util';

export default function template(Clazz, key) {

    Clazz.contextTypes.loader = PropTypes.loader;

    extendPrototype(Clazz, 'componentWillMount', function template$willMount() {
        this.injected[key] = this.context.loadTemplate(this.props[key]);
    });

    extendPrototype(Clazz, 'componentWillReceiveProps', function template$willRecieveProps(newProps, context) {
        if (this.props[key] !== newProps[key]) {
            this.injected[key] = context.loadTemplate(newProps[key]);
        }
    });
};