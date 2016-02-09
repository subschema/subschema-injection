"use strict";
import expect from 'expect';
import React, {Component} from 'react';
import {PropTypes, decorators, ValueManager} from 'subschema';
import support, {intoWithContext, byComponent,findNode, change} from '../support';
import resolvers from '../../src/resolvers';
import injectorFactory from '../../src/injectorFactory';
const injector = injectorFactory();

describe('resolvers/fieldsets', function () {
    this.timeout(50000);
    const propTypes = {
        fieldsets: PropTypes.fieldset
    };
    const defaultProps = {};


    injector.resolver(PropTypes.fieldset, resolvers.fieldset);

    it('should normalize fieldsets', function () {
        class TargetTest extends Component {
            static propTypes = propTypes;

            render() {
                return <span>hello</span>
            }
        }
        const Injected = injector.inject(TargetTest);
        const inst = intoWithContext(<Injected fieldsets={[{
        fields:'a,b',
        fieldsets:[{
            className:'stuff'
        },
        {
        fields:'c,d'
        }
        ]
        }]}/>, {}, true);

        const et = byComponent(inst, TargetTest);
        const node = findNode(et);
        expect(et.props.fieldsets.fields.length).toBe(2);

    });
    it('should normalize fieldsets deep', function () {
        class TargetTest extends Component {
            static propTypes = propTypes;

            render() {
                return <span>hello</span>
            }
        }
        const Injected = injector.inject(TargetTest);
        const inst = intoWithContext(<Injected fieldsets={[{
        fieldsets:[{
            className:'stuff',
        fields:'a,b',
        },
        {
        fields:'c,d'
        },
        {
        fieldsets:{
            fields:'e,f',
            className:'joe'
        }
        }
        ]
        }]}/>, {}, true);

        const et = byComponent(inst, TargetTest);
        const node = findNode(et);
        const fs = et.props.fieldsets;
        expect(fs.fields).toEqual('abcdef'.split(''));
        expect(fs.fieldsets[0].fieldsets[0].className).toBe('stuff');
    });
});