"use strict";
import React, {Component} from 'react';
import {keyIn,onlyKeys, uniqueKeys} from './util';

export class BaseInjectComponent extends Component {
    state = {};
    injected = {};
}

export default function injector(resolvers = []) {

    function resolveProp(injectedClass, propType, key, propTypeKeys, Clazz) {
        const length = resolvers.length;
        for (let i = 0; i < length; i++) {
            const resolver = resolvers[i], pT = resolver.propType;

            if (pT === propType || pT.isRequired === propType) {
                return resolver.resolve(injectedClass, key, propTypeKeys, Clazz);
            }
        }
        return null;
    }

    const Injector = {
        resolver(propType, resolve){
            if (propType == null || resolve == null) {
                throw new Error('must define both a propType and a resolver');
            }
            resolvers.push({
                propType,
                resolve
            });
        },


        inject(Clazz, extraPropTypes, extraProps, strictProps){
            const {defaultProps, propTypes} = Clazz;
            const propTypeKeys = uniqueKeys(propTypes, extraPropTypes, defaultProps);
            const [...copyPropTypeKeys] = propTypeKeys;
            const render = strictProps !== false ? function render() {
                const props = onlyKeys(copyPropTypeKeys, this.injected, this.props);
                return <Clazz {...props} >{this.props.children}</Clazz>

            } : function loosePropsRender() {
                return <Clazz {...this.props} {...this.injected }>{this.props.children}</Clazz>

            };
            //BaseInjectComponent is just a marker class.
            class InjectedClass extends BaseInjectComponent {
                static defaultProps = {};
                static contextTypes = {};
                render = render;
            }
            if ('template' in Clazz){
                InjectedClass.template = Clazz.template;
            }

            return propTypeKeys.reduce((injectedClass, key)=> {

                const propType = keyIn(key, extraPropTypes, propTypes);

                injectedClass.defaultProps[key] = keyIn(key, extraProps, defaultProps);

                const nextClass = resolveProp(injectedClass, propType, key, copyPropTypeKeys, Clazz);

                return (nextClass == null) ? injectedClass : nextClass;

            }, InjectedClass);
        }
    };
    return Injector;
}