"use strict";

import injector from './injector';
import resolvers from './resolvers';
import {PropTypes} from 'subschema';

Object.keys(resolvers).map(function (k) {
    if (PropTypes[k] && resolvers[k]) {
        injector.resolver(PropTypes[k], resolvers[k])
    } else {
     //   console.log('missing ', k, PropTypes[k], resolvers[k]);
    }
});

export default injector;
