"use strict";

import {extendPrototype} from '../util';

export default function validate(Clazz, key) {

    class AnimationComponent extends Clazz {

        render() {
            return <EventCSSTransitionGroup {...this._animation}>{this.props.children || null}</EventCSSTransitionGroup>
        }
    }
    Clazz.contextTypes.loader = PropTypes.loader;

    extendPrototype(Clazz, 'componentWillMount', function () {
        var animation = this.props[key];
        if (animation === true) {
            this._animation = defaultAnimation;
        } else if (typeof animation === 'string') {
            this._animation = this.context.loader.loadAnimation(animation);
        } else {
            this._animation = animation;
        }
    });
    return AnimationComponent;
}