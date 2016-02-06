"use strict";

import React, {Component} from 'react';
import {PropTypes, tutils} from 'subschema';
import {extendPrototype} from '../util';

const {toArray}=tutils;
function toOptions(nval) {
    if (typeof nval === 'string') {
        return {label: nval, val: nval};
    }
    if (('label' in nval ) && ('val' in nval)) {
        return nval;
    }
    const {label, val, ...rest} = nval;
    if (!val) {
        rest.val = label;
    }
    if (!label) {
        rest.label = val;
    }
    return rest;
}

function asOptions(val) {
    return toArray(val).map(toOptions);
}
export default function options(Clazz, key) {

    extendPrototype(Clazz, 'componentWillMount', function options$componentWillMount() {
        //this injects the options.
        this.injected[key] = asOptions(this.props[key]);
    });

    extendPrototype(Clazz, 'componentWillReceiveProps', function options$willReceiveProps(newProps) {
        if (this.props[key] !== newProps[key]) {
            this.injected[key] = asOptions(newProps[key]);
        }
    });
}