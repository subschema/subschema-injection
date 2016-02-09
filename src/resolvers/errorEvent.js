"use strict";

import {resolveKey, prop} from '../util';

function errorUpdate(value, key, props, context) {
    const resolvedKey = resolveKey(props.path, value);
    return (val)=> context.valueManager.updateErrors(resolvedKey, val);
}

export default function errorEvent(Clazz, key) {

    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::prop(errorUpdate);

}