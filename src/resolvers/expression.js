"use strict";

import {PropTypes, types} from 'subschema';
import {extendPrototype, removeListeners, resolveKey, clearListeners} from '../util';

const {SubstituteMixin} = types;

function setupExpression(scope, propVal, context, key) {
    const expressionVals = {};
    const listeners = scope.expressionListeners ? removeListeners(scope.expressionListeners) : (scope.expressionListeners = []);
    const vm = context.valueManager;
    const expr = SubstituteMixin(propVal);
    expr.listen.forEach(v=> {
        if (!(v in expressionVals)) {
            //only need to listen to a value once.
            expressionVals[v] = '';
            const listener = vm.addListener(resolveKey(scope.props.path, v), function (val) {
                if (expressionVals[v] !== val) {
                    //if the values don't cange the state don't change.
                    expressionVals[v] = val;
                    scope.injected[key] = expr.format(expressionVals);
                    scope.forceUpdate();
                }
            }, null, true).remove;
            listeners.push(listener);
        }
    });
}

export default function expression(Clazz, key) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;


    extendPrototype(Clazz, 'componentWillMount', function expression$willMount() {
        setupExpression(this, this.props[key], this.context, key);
    });


    extendPrototype(Clazz, 'componentWillReceiveProps', function expression$willReceiveProps(newProps, context) {
        if (this.props[key] !== newProps[key]) {
            setupExpression(this, newProps[key], context, key);
        }
    });

    extendPrototype(Clazz, 'componentWillUnmount', function () {
        removeListeners(this.expressionListeners);
    });

}