"use strict";

import {PropTypes, types} from 'subschema';
import {extendPrototype, removeListeners, clearListeners} from '../util';

const {SubstituteMixin} = types;


export default function expression(Clazz, props, key, value) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    function setupExpression(scope, propVal, context) {
        const expressionVals = {};
        const listeners = scope.expressionListeners ? removeListeners(scope.expressionListeners) : (scope.expressionListeners = []);
        const vm = context.valueManager;
        const expr = SubstituteMixin(propVal);
        expr.listen.forEach(v=> {
            if (!(v in expressionVals)) {
                //only need to listen to a value once.
                expressionVals[v] = null;
                const listener = vm.addListener(v, function (val) {
                    if (expressionVals[v] !== val) {
                        //if the values don't cange the state don't change.
                        expressionVals[v] = val;
                        scope.setState({[key]: expr.format(expressionVals)});
                    }
                }, null, true).remove;
                listeners.push(()=> {
                    console.log('remove called');
                    listener();
                });
            }
        });

        console.log('listening to ', listeners.length);
    }

    extendPrototype(Clazz, 'componentWillMount', function expression$willMount() {
        setupExpression(this, this.props[key], this.context);
        console.log('expression$componentWillMount', this.expressionListeners.length)
    });


    extendPrototype(Clazz, 'componentWillReceiveProps', function expression$willReceiveProps(newProps, context) {
        if (this.props[key] !== newProps[key]) {
            setupExpression(this, newProps[key], context);
            console.log('expression$componentWillReceiveProps', this.expressionListeners.length)
        }
    });

    extendPrototype(Clazz, 'componentWillUnmount', function () {
        console.log('expression$componentWillUnmount')
        removeListeners(this.expressionListeners);

    });

}