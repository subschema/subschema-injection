"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'subschema';

export default function targetEvent(Clazz, props, key, value) {

    return class TargetEventWrap extends Component {

        static contextTypes = {
            valueManager: PropTypes.valueManager
        };
        inject = {};

        componentWillMount() {
            this.inject[key] = (e) => this.context.valueManager.update(this.props[value], e.target.value);
        }

        componentWillReceiveProps(newProps) {
            if (this.props[value] !== newProps[value]) {
                this.inject[key] = (e) => this.context.valueManager.update(newProps[value], e.target.value);
            }
        }

        render() {
            return <Clazz {...this.props} {...this.inject}/>
        }

    };
}