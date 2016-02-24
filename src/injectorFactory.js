"use strict";
import React, {Component} from 'react';
import {keyIn, onlyKeys, uniqueKeys} from './util';

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
        createWrapperClass(Clazz, copyPropTypeKeys, strictProps){
            const render = strictProps !== false ? function render() {
                const {children, ...rest} = this.props;
                const props = onlyKeys(copyPropTypeKeys, this.injected, this.props);
                return <Clazz {...props} >{this.props.children}</Clazz>

            } : function loosePropsRender() {
                const {children, ...props} = this.props;
                return children ? <Clazz {...props} {...this.injected }>{children}</Clazz> : <Clazz {...props} {...this.injected }/>

            };
            //BaseInjectComponent is just a marker class.
            class InjectedClass extends BaseInjectComponent {
                static defaultProps = {};
                static contextTypes = {};
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
            const {defaultProps, propTypes} = Clazz;
            const propTypeKeys = uniqueKeys(propTypes, defaultProps, extraPropTypes);
            const [...copyPropTypeKeys] = propTypeKeys;

            const InjectedClass = this.createWrapperClass(Clazz, copyPropTypeKeys, strictProps);

            return propTypeKeys.reduce((injectedClass, key)=> {

                const propType = keyIn(key, propTypes, extraPropTypes);

                injectedClass.defaultProps[key] = keyIn(key, defaultProps, extraProps);

                const nextClass = resolveProp(injectedClass, propType, key, copyPropTypeKeys, Clazz);

                return (nextClass == null) ? injectedClass : nextClass;

            }, InjectedClass);
        }
    };
    return Injector;
}