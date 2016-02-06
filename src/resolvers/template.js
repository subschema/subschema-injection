"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'subschema';
import {extendPrototype} from '../util';
import {injector} from '../PropTypes';

const propTypes = {
    className: PropTypes.cssClass,
    id: PropTypes.id
};

function loadTemplate(context, value) {
    const {template, ...rest} = typeof value === 'string' ? {template: value} : value;
    if (template === false) {
        return null;
    }
    const Template = context.loader.loadTemplate(template);
    return injector.inject(Template, propTypes);
}

export default function template(Clazz, key) {


    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz.contextTypes.injector = injector;

    extendPrototype(Clazz, 'componentWillMount', function template$willMount() {
        this.injected[key] = loadTemplate(this.context, this.props[key]);
    });

    extendPrototype(Clazz, 'componentWillReceiveProps', function template$willRecieveProps(newProps, context) {
        if (this.props[key] !== newProps[key]) {
            this.injected[key] = loadTemplate(context, newProps[key]);
        }
    });
};