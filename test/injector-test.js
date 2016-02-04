"use strict";
import expect from 'expect';
import React, {Component} from 'react';
import {PropTypes, decorators, ValueManager} from 'subschema';
import injector from '../src/injector';
import support, {intoWithContext, byComponent} from 'subschema-test-support/src/index.js';
import resolvers from '../src/resolvers';


function twoUnique(fn1, fn2) {
    if (fn1 === fn2) return fn1;
    if (!fn2) return fn1;
    if (!fn1) return fn2;
    return function twoUnique$both(...args) {
        fn1.apply(this, args);
        fn2.apply(this, args);
    }
}
describe("injection", function () {

    class ValueTestClass extends Component {
        static propTypes = {
            stuff: PropTypes.string,
            other: PropTypes.value,
            options: PropTypes.options,
            expr: PropTypes.expression,
            value: PropTypes.value/*,
             onChange: PropTypes.valueEvent,
             onError: PropTypes.errorEvent*/
        };

        static defaultProps = {
            value: ".",
        };

        render() {
            return <span>{this.props.value} {this.props.other}</span>
        }
    }
    Object.keys(resolvers).map((k)=>injector.resolver(PropTypes[k], resolvers[k]));

    it('should return first key', function () {
        expect(injector.keyIn('stuff', {stuff: 1}, {stuff: null})).toBe(1);
        expect(injector.keyIn('stuff', {}, {stuff: 1})).toBe(1);
        expect(injector.keyIn('stuff', null, {stuff: 1})).toBe(1);

    });

    it('should resolve propTypes', function () {

        const Injected = injector.inject(ValueTestClass);
        const valueManager = ValueManager({'test': 'abc', more: 'd'});
        const inst = intoWithContext(<Injected value="test" other="more" stuff="what" options="a,b,c" expr="{more} {test}"/>, {
            valueManager
        }, true);

        expect(inst).toExist();
        const vtc = byComponent(inst, ValueTestClass);
        expect(vtc).toExist();
        expect(vtc.props.value).toBe('abc');
        expect(vtc.props.other).toBe('d');
        expect(vtc.props.stuff).toBe('what');
        expect(vtc.props.options[0].val).toBe('a');
        expect(vtc.props.options[1].label).toBe('b');
        expect(vtc.props.expr).toBe('d abc');

        expect(Object.keys(vtc.props).length).toBe(5);
    });
});