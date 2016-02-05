"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'subschema';

export default function errorEvent(Clazz, props, key, value) {

    return class ErrorEventWrap extends Component {
        static defaultProps = {[key]: value};
        static contextTypes = {
            valueManager: PropTypes.valueManager
        };

        componentWillMount() {
            this.rest = {
                [key]: (val)=> this.context.valueManager.updateErrors(this.props[value], val)

            };
        }

        componentWillReceiveProps(newProps) {
            if (this.props[key] != this.props[key]) {
                this.rest = {
                    [key]: (val)=> this.context.valueManager.updateErrors(this.props[value], val)
                };
            }
        }

        render() {
            return <Clazz {...this.props} {...this.rest}/>
        }

    };
}