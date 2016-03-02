"use strict";
import {PropTypes as ReactPropTypes} from 'react';
import injector from './injector';
import injF from './injectorFactory';

export const injectorFactory = injF;

export const PropTypes = {
    injector: ReactPropTypes.shape({
        inject: ReactPropTypes.func.isRequired
    })
};

export default injector;
