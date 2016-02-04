"use strict";

function keyIn(key, ...args) {
    for (let i = 0; i < args.length; i++) {
        if (args[i] == null) continue;
        if (key in args[i])
            return args[i][key];
    }
    return;
}
function uniqueKeys(...args) {
    const keys = [];
    for (let i = 0, l = args.length; i < l; i++) {
        if (args[i] == null) continue;
        const k = Object.keys(args[i]), jl = k.length;
        for (let j = 0; j < jl; j++) {
            if (keys.indexOf(k[j]) === -1) {
                keys.push(k[j]);
            }
        }
    }
    return keys;
}

const resolvers = [];

const Loader = {
    keyIn,
    resolver(propType, resolve){
        if (propType == null || resolve == null) {
            throw new Error('must define both a propType and a resolver');
        }
        resolvers.push({
            propType,
            resolve
        });
    },
    resolveProp(Clazz, props, propType, key, value){
        const length = resolvers.length;
        for (let i = 0; i < length; i++) {
            const resolver = resolvers[i];
            if (resolver.propType === propType || resolver.propType.isRequired === propType) {
                return resolver.resolve(Clazz, props, key, value);
            }
        }
    },

    inject(Clazz, extraPropTypes, extraProps){
        const {defaultProps, propTypes} = Clazz;
        const propTypeKeys = uniqueKeys(propTypes, extraPropTypes);
        propTypeKeys.reduce((ret, key)=> {
            if (!(key in ret)) {
                const propType = keyIn(key, extraPropTypes, propTypes);
                const propValue = keyIn(key, extraProps, defaultProps)
                const Clz = this.resolveProp(Clazz, ret, propType, key, propValue);
                if (Clz != null) {
                    Clazz = Clz;
                }
            }
            return ret;
        }, {});
        return Clazz;
    }
};

export default Loader;