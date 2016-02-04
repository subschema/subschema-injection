"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'subschema';


export default function valueEvent(Clazz, props, key, value) {

    class ValueWrap extends Component {

        static contextTypes = {
            valueManager: PropTypes.valueManager
        };

        listeners = [];
        state = {};

        componentWillMount() {
            this.listeners.push(this.context.valueManager.addListener(this.props[key] || value, (v)=> {
                this.setState({[key]: v});
            }, null, true).remove);
        }

        componentWillUnmount() {
            this.listeners.remove.forEach(v=>v());
        }

        render() {
            return <Clazz {...this.props} {...this.state}/>
        }

    }
    return ValueWrap;
}