"use strict";

import React, {Component} from 'react';
import {PropTypes, tutils, types} from 'subschema';

const {SubstituteMixin} = types;

const push = Function.apply.bind(Array.prototype.push);

export default function expression(Clazz, props, key, value) {

    class ExpressionWrap extends Component {
        static contextTypes = {valueManager: PropTypes.valueManager};
        static defaultProps = {[key]: value};
        state = {};
        listeners = [];

        componentWillMount() {
            this.setupExpression(this.props[key]);
        }

        setupExpression(propVal) {
            const vm = this.context.valueManager;
            const expr = this._expressions = SubstituteMixin(propVal);

            push(this.listeners, expr.listen.map((v)=> vm.addListener(v, (val)=> {
                this.setState({[v]: val})
            }, null, true).remove));

        }

        componentWillReceiveProps(newProps) {
            if (this.props[key] !== newProps[key]) {
                this.setupExpression(newProps[key]);
            }
        }

        componentWillUnmount() {
            this.listeners.forEach(v=>v());
        }

        render() {
            var inject = {[key]: this._expressions.format(this.state)}
            return <Clazz {...this.props} {...inject}/>
        }

    }

    return ExpressionWrap;
}