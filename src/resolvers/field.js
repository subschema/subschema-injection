"use strict";
import React from 'react';
import {extend, prop} from '../util';
import {PropTypes, tutils} from 'subschema';
import {loadTemplate} from './template';
import {loadType} from './type';
import {loadValidators} from './validate';

const {FREEZE_OBJ} = tutils;

export const settings = {
    type: 'Text',
    template: 'EditorTemplate'
};

function bare(value) {

    const {type, template, ...rest} = value;
    return rest;
}
function spreadable(value, key = 'template') {
    if (value == null) {
        return FREEZE_OBJ;
    }
    if (typeof value === 'string') {
        return {[key]: value}
    }
    if ((!key in value)) {
        return FREEZE_OBJ;
    }
    return value;
}

export default function field(Clazz, key, propList) {

    const setts = bare(settings);

    Clazz.contextTypes.loader = PropTypes.loader;
    Clazz.contextTypes.injector = PropTypes.injector;
    Clazz.contextTypes.valueManager = PropTypes.valueManager;

    Clazz::prop(key, function field$prop(value, key, props, context, OrigClazz) {

            if (value == null) {
                var {...copy} = settings;
                value = copy;
            } else if (typeof value === 'string') {
                value = {type: value}
            } else if (!value.type) {
                value.type = settings.type;
            }
            if (value.validators) {
                value.validators = loadValidators(value.validators, key, props, context);
            }


            const Type = loadType(value.type, null, null, context);
            let Template;
            if ('template' in Type) {
                //template is false with no override.
                if (Type.template === false && (value.template == null)) {
                    return {Type};
                }
                const lookup = {...spreadable(settings.template), ...spreadable(value.template), ...spreadable(Type.template)};
                Template = loadTemplate(lookup, key, props, context);
            } else {
                const lookup = {...spreadable(settings.template), ...spreadable(value.template)};
                Template = loadTemplate(lookup, key, props, context);
            }

            return {
                ...setts,
                ...bare(value),
                Type,
                Template
            }
        }
    );


}