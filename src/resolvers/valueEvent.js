"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'subschema';

export default function valueEvent(Clazz, props, key, value) {

    return class ValueEventWrap extends Component {

        static contextTypes = {
            valueManager: PropTypes.valueManager
        };

        componentWillMount() {
            this.rest = {
                [key]: (val)=> this.context.valueManager.update(this.props[value], val)

            };
        }

        componentWillReceiveProps(newProps) {
            if (this.props[value] != this.props.value) {
                this.rest = {
                    [key]: (val)=> this.context.valueManager.update(this.props[value], val)
                };
            }
        }

        render() {
            return <Clazz {...this.props} {...this.rest}/>
        }

    };
}