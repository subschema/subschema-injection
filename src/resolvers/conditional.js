"use strict";
import React, {Component} from 'react';
import {prop} from '../util';
import {PropTypes} from 'subschema';

export function conditional(Clazz, key) {
    Clazz.contextType.loader = PropTypes.loader;

    Clazz::prop(key, function (value, key, props, context) {
        let {operator, ...conditional} = typeof value === 'string' ? {operator: value} : value;

        if (!conditional.path) {
            conditional.path = props.path;
        }

        if (operator == null) {
            operator = 'truthy';
        }

        if (typeof operator === 'string') {
            conditional.operator = context.loader.loadOperator(operator);
        }
        return conditional;
    });

    class Conditional extends Component {
        render() {
            const conditional = this.props[key];
            if (conditional.animate) {

            } else {

                return <Clazz {...this.props}/>
            }
        }
    }

    return Conditional;
}