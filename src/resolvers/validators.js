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

function makeValidate(validators, context) {
    validators = toValidators(validators, context.loader);
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

export default function validate(Clazz, key) {

    Clazz.contextTypes.loader = PropTypes.loader;

    extendPrototype(Clazz, 'componentWillMount', function validate$willMount() {
        this.injected[key] = makeValidate(this.props[key], this.context);
    });

    extendPrototype(Clazz, ' componentWillReceiveProps', function validate$receiveProps(newProps, context) {
        if (this.props[key] != newProps[key]) {
            this.injected[key] = makeValidate(newProps[key], context);
        }
    });


}