"use strict";

import React, {Component} from 'react';
import {PropTypes, tutils} from 'subschema';
import {prop} from '../util';

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
    Clazz::prop(key, asOptions);
}