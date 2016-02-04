"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'subschema';
import injector from '../injector';

const {loader} = PropTypes;

export default function type(Clazz, props, key, value) {
    class TypeWrap extends Component {
        static contextTypes = {loader};
        static defaultProps = {[key]: value};
        types = {};

        resolve(key) {
            return injector.inject(this.context.loader.loadType(this.props[key]));
        }

        componentWillMount() {
            this.types[key] = this.resolve(key);
        }

        componentWillReceiveProps(newProps) {
            if (this.props[key] !== newProps[key]) {
                this.types[key] = this.resolve(key);
            }
        }

        render() {
            return <Clazz {...this.props} {...this.types}/>
        }
    }
    return TypeWrap;
}