"use strict";

import React, {Component} from 'react';
import {extendPrototype, resolveKey} from '../util';
import {tutils } from 'subschema';

const {titlelize} = tutils;

function resolve(props, value) {
    if (value === false) {
        return '';
    }
    if (value) {
        return value;
    }
    return titlelize(props.name || props.id || props.path);
}

export default function valueEvent(Clazz, key) {

    extendPrototype(Clazz, 'componentWillMount', function valueEvent$willMount() {
        this.injected[key] = resolve(this.props, this.props[key]);
    });

    extendPrototype(Clazz, 'componentWillReceiveProps', function valueEvent$receiveProps(newProps) {
        if (this.props[key] !== newProps[key]) {
            this.injected[key] = resolve(newProp, newProps[key]);
        }
    });

}