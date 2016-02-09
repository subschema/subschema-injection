"use strict";

import {prop} from '../util';
import {tutils } from 'subschema';

const {titlelize} = tutils;

function resolve(value, key, props) {
    if (value === false) {
        return '';
    }
    if (value) {
        return value;
    }
    return titlelize(props.name || props.id || props.path);
}

export default function valueEvent(Clazz, key) {

    Clazz::prop(key, resolve);

}