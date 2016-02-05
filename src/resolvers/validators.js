"use strict";

import React, {Component} from 'react';
import {PropTypes, tutils} from 'subschema';

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

export default function validate(Clazz, props, key, value) {

    class ValidateWrap extends Component {
        static contextTypes = PropTypes.contextTypes;
        static defaultProps = {[key]: value};
        inject = {};

        componentWillMount() {
            //this injects the options.
            this.validators = toArray(this.props[key]).map(initValidators, this.context.loader);
        }

        componentWillReceiveProps(newProps) {
            if (this.props[key] != newProps[key]) {
                this.validators = toArray(newProps[key]).map(initValidators, this.context.loader);
            }
        }

        validate = (value)=> {
            const length = this.validators.length;
            for (let i = 0; i < length; i++) {
                var error = this.validators[i](value);
                if (error !== null) {
                    return error;
                }
            }
        };

        render() {
            const inject = {[key]: this.validate}
            return <Clazz {...this.props} {...inject}/>
        }
    }

    return ValidateWrap;
}