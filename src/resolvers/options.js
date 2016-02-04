"use strict";

import React, {Component} from 'react';
import {PropTypes, tutils} from 'subschema';

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

export default function options(Clazz, props, key, value) {

    class OptionWrap extends Component {
        static defaultProps = {[key]: value};
        inject = {};

        componentWillMount() {
            //this injects the options.
            this.inject[key] = toArray(this.props[key]).map(toOptions);
        }

        componentWillReceiveProps(newProps) {
            if (this.props[value] != this.props.value) {
                this.inject[key] = toArray(this.props[key]).map(toOptions);
            }
        }

        render() {
            return <Clazz {...this.props} {...this.inject}/>
        }
    }

    return OptionWrap;
}