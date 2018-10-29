import React from 'react';
import PropTypes from 'prop-types';


export const ReactComponentType = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.element,
  PropTypes.instanceOf(React.Component)
]);

export const ComponentOrStringType = PropTypes.oneOfType([
  PropTypes.string,
  ReactComponentType
]);

export function defaultCallback(name) {
  return (...args) => {
    // eslint-disable-next-line
    console.warn(`${name} was called with`, args);
  };
}
