"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'subschema';
import {prop} from '../util';
import {injector} from '../PropTypes';

function loadContent(content, key, props, context) {
    const Content = context.loader.loadType('Content');
    return injector.inject(Content, null, {content});
}

export default function content(Clazz, key) {


    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz.contextTypes.injector = injector;

    Clazz:prop(key, loadContent);

};