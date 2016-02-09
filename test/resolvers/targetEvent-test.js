"use strict";
import expect from 'expect';
import React, {Component} from 'react';
import {PropTypes, decorators, ValueManager} from 'subschema';
import support, {intoWithContext, byComponent,findNode, change} from 'subschema-test-support/src/index.js';
import resolvers from '../../src/resolvers';
import injectorFactory from '../../src/injectorFactory';

const injector = injectorFactory();
injector.resolver(PropTypes.targetEvent, resolvers.targetEvent);
injector.resolver(PropTypes.value, resolvers.value);
injector.resolver(PropTypes.dataType, resolvers.dataType);

describe('resolvers/targetEvent', function () {
    this.timeout(10000);
    const propTypes = {
        onChange: PropTypes.targetEvent,
        value: PropTypes.value,
        dataType: PropTypes.dataType,
        path: PropTypes.path
    };

    const defaultProps = {
        value: '.',
        dataType: 'text'
    };

    class TargetTest extends Component {

        render() {
            return <input {...this.props}/>
        }
    }


    it('should follow change lifecyle', function () {
        const Injected = injector.inject(TargetTest, propTypes, defaultProps);
        const valueManager = ValueManager({'other': 'stuff', more: 'd'});
        const inst = intoWithContext(<Injected path="hello"/>, {
            valueManager

        }, true);

        const et = byComponent(inst, TargetTest);
        const node = findNode(et);
        expect(et.props.type).toBe('text');
        change(et, 'world');
        expect(valueManager.path('hello')).toBe('world');
    });

});