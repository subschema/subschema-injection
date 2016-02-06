"use strict";
import React, {Component} from 'react';
import {keyIn,onlyKeys, uniqueKeys} from './util';

export class BaseInjectComponent extends Component {
    state = {};
    injected = {};
}

export default function injector(resolvers = []) {

    function resolveProp(Clazz, propType, key, propTypeKeys) {
        const length = resolvers.length;
        for (let i = 0; i < length; i++) {
            const resolver = resolvers[i], pT = resolver.propType;

            if (pT === propType || pT.isRequired === propType) {
                return resolver.resolve(Clazz, key, propTypeKeys);
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
                return <Clazz {...props} />

            } : function loosePropsRender() {
                return <Clazz {...this.props} {...this.injected }/>

            };
            //BaseInjectComponent is just a marker class.
            class InjectedClass extends BaseInjectComponent {
                static defaultProps = {};
                static contextTypes = {};
                render = render;
            }

            return propTypeKeys.reduce((injectedClass, key)=> {

                const propType = keyIn(key, extraPropTypes, propTypes);

                injectedClass.defaultProps[key] = keyIn(key, extraProps, defaultProps);

                const nextClass = resolveProp(injectedClass, propType, key, copyPropTypeKeys);

                return (nextClass == null) ? injectedClass : nextClass;

            }, InjectedClass);
        }
    };
    return Injector;
}