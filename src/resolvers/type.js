"use strict";

import {PropTypes} from 'subschema';
import {prop} from '../util';
import {injector} from '../PropTypes';

const propTypes = {
    onChange: PropTypes.targetEvent,
    onBlur: PropTypes.blurValidate,
    value: PropTypes.value,
    id: PropTypes.id,
    name: PropTypes.name,
    className: PropTypes.typeClass
};

//Expose for configurability
export const settings = {
    type: 'Text'
};

export function loadType(val, key, props, context) {
    const {type, ...rest} = typeof val === 'string' ? {
        ...settings,
        type: val
    } : val == null ? settings : {...settings, ...val};

    const Type = context.loader.loadType(type);

    return context.injector.inject(Type, propTypes, rest);
}

export default function type(Clazz, key) {

    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz.contextTypes.injector = injector;

    Clazz::prop(key, loadType);
}
