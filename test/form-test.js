"use strict";
import expect from 'expect';
import React, {Component} from 'react';
import {PropTypes, decorators, ValueManager, Form, loader} from 'subschema';
import support, {into, intoWithContext, byComponent,findNode} from './support';
import injector from '../src/index.js';

describe('Form', function () {

    it('should render', function () {
        const valueManger = ValueManager();
        into(<Form valueManager={valueManger} injector={injector} schema={{
            schema:{
                "stuff":{
                    "type":"Text",
                    "validators":["required"]
                }
            }
        }}/>)
    });
});