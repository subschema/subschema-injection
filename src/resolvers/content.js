"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'subschema';
import {extendPrototype} from '../util';
import {injector} from '../PropTypes';

function loadContent(context, content) {
    const Content = context.loader.loadType('Content');
    return injector.inject(Content, null, {content});
}

export default function content(Clazz, key) {


    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz.contextTypes.injector = injector;

    extendPrototype(Clazz, 'componentWillMount', function content$willMount() {
        this.injected[key] = loadContent(this.context, this.props[key]);
    });

    extendPrototype(Clazz, 'componentWillReceiveProps', function content$willRecieveProps(newProps, context) {
        if (this.props[key] !== newProps[key]) {
            this.injected[key] = loadContent(context, newProps[key]);
        }
    });
};