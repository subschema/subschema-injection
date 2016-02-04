"use strict";

import React, {Component} from 'react';
import {PropTypes} from 'subschema';

export default function template(Clazz, props, key, value) {

    class TemplateWrap extends Component {

        static contextTypes = {
            loader: PropTypes.loader
        };
        templates = {};


        constructor(props, context, ...rest) {
            super(props, context, ...rest);
            this.templates[key] = context.loadTemplate(this.props[key]) || value;
        }

        componentWillReceiveProps(newProps) {
            if (this.props[key] !== newProps[key]) {
                this.templates[key] = this.context.loadTemplate(this.props[key]) || value;
            }
        }

        render() {
            return <Clazz {...this.props} {...this.templates}/>
        }

    }
    return TemplateWrap;
};