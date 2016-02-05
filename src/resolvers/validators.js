"use strict";

import React, {Component} from 'react';
import {PropTypes, tutils} from 'subschema';
import {extendPrototype} from '../util';

const {toArray, FREEZE_OBJ}=tutils;

function initValidators(nval) {
    if (typeof nval === 'function') {
        return nval;
    }
    if (typeof nval === 'string') {
        return this.loadValidator(nval)(FREEZE_OBJ);
    }
    return this.loadValidator(nval.type)(nval);
}
function toValidators(val, loader) {
    return toArray(val).map(initValidators, loader)
}

export default function validate(Clazz, props, key, value) {

    Clazz.contextTypes.loader = PropTypes.loader;

    extendPrototype(Clazz, 'componentWillMount', function validate$willMount() {
        this.injected[key] = makeValidate(toValidators(this.props[key], this.context.loader));
    });

    extendPrototype(Clazz, ' componentWillReceiveProps', function validate$receiveProps(newProps, context) {
        if (this.props[key] != newProps[key]) {
            this.injected[key] = makeValidate(toValidators(newProps[key], context.loader));
        }
    });

    function makeValidate(validators) {
        return (value)=> {
            const length = validators.length;
            for (let i = 0; i < length; i++) {
                var error = validators[i](value);
                if (error !== null) {
                    return error;
                }
            }
        };
    }
}