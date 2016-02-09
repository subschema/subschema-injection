"use strict";
import expect from 'expect';
import React, {Component} from 'react';
import {PropTypes, decorators, ValueManager} from 'subschema';
import support, {intoWithContext, byComponent,findNode} from './support';
import resolvers from '../src/resolvers';
import injectorFactory from '../src/injectorFactory';

const injector = injectorFactory();

describe("injection", function () {
    this.timeout(50000);
    Object.keys(resolvers).map(function (k) {
        if (PropTypes[k] && resolvers[k]) {
            injector.resolver(PropTypes[k], resolvers[k])
        }else{
            console.log('missing ', k, PropTypes[k], resolvers[k]);
        }
    });
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


    it('should resolve propTypes', function () {

        const Injected = injector.inject(ValueTestClass);
        const valueManager = ValueManager({'test': 'abc', more: 'd'});
        const inst = intoWithContext(<Injected value="test" other="more" stuff="what" options="a,b,c"
                                               expr="{more} {test}"/>, {
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

        expect(Object.keys(vtc.props).length).toBe(6);
        const node = findNode(vtc);
        expect(node.innerText).toBe('abc d');
    });
});