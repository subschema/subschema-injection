"use strict";
import React, {Component} from 'react';
import {keyIn, onlyKeys, uniqueKeys, extendPrototype, listener, unmount, prop as property} from './util';


export class BaseInjectComponent extends Component {
    state = {};
    injected = {};
}

function hasAnyKeys(obj) {
    if (!obj) return false;
    return Object.keys(obj).length > 0;
}
export default function injector(resolvers = []) {

    function resolveProp(propType) {
        if (propType == null) {
            return propType;
        }
        const length = resolvers.length;
        for (let i = 0; i < length; i++) {
            const resolver = resolvers[i], pT = resolver.propType;

            if (pT === propType || pT.isRequired === propType) {
                return resolver;
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
        unmount,
        listener,
        property,
        extendPrototype,
        createWrapperClass(Clazz, copyPropTypeKeys, strictProps){
            const {defaultProps, propTypes} = Clazz;
            const render = strictProps !== false ? function render() {
                const props = onlyKeys(copyPropTypeKeys, this.injected, this.props);
                return <Clazz {...props} {...this.injected } >{this.props.children}</Clazz>

            } : function loosePropsRender() {
                return <Clazz {...this.props} {...this.injected }>{this.props.children}</Clazz>

            };
            const {name} = Clazz;
            //BaseInjectComponent is just a marker class.
            class InjectedClass extends BaseInjectComponent {
                static defaultProps = {};
                static contextTypes = {};
                static displayName =  `${name}$Wrapper`;
                render = render;
            }
            return InjectedClass
        },
        /**
         * Injects properties based propType.
         *
         * @param Clazz - class to wrap.
         * @param extraPropTypes - extra prop types if the component does not have the propType than it will use this propType, otherwise the
         * the class'es default propType will be used.
         * @param extraProps - If a component has a defaultProp than it will use that otherwise it will use this.
         * @param strictProps - If false than it will pass all props on to component, otherwise it just passes defined props.
         * @returns {*}
         */

        inject(Clazz, extraPropTypes, extraProps, strictProps){
            const hasExtra = hasAnyKeys(extraPropTypes) || hasAnyKeys(extraProps);

            const {defaultProps, propTypes} = Clazz;

            const propTypeKeys = uniqueKeys(propTypes, defaultProps, extraPropTypes);

            const [...copyPropTypeKeys] = propTypeKeys;

            const start = hasExtra ? this.createWrapperClass(Clazz, copyPropTypeKeys, strictProps) : null;

            const injected = propTypeKeys.reduce((injectedClass, key)=> {

                const resolver = resolveProp(keyIn(key, propTypes, extraPropTypes));
                //resolver is null, nothing to do just return.
                if (resolver == null) {
                    return injectedClass;
                }
                //injectedClass may be null if it didn't have any extras.  So we will create if it is.
                injectedClass = injectedClass || this.createWrapperClass(Clazz, copyPropTypeKeys, strictProps);

                //Add default props to this thing.
                injectedClass.defaultProps[key] = keyIn(key, defaultProps, extraProps);

                //Resolver could return a different class.
                const nextClass = this::resolver.resolve(injectedClass, key, propTypeKeys, Clazz);

                //If a different class was null, return the original class.
                return (nextClass == null) ? injectedClass : nextClass;
            }, start);
            return injected || Clazz;
        }
    };
    return Injector;
}