"use strict";

import {prop} from '../util';
import {tutils} from 'subschema';

const {toArray} = tutils;

export default function fields(Clazz, key) {
    Clazz::prop(key, toArray);
}