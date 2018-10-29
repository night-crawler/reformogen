import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, render, shallow } from 'enzyme';
import 'raf/polyfill';
import React from 'react';
import { IntlProvider, intlShape } from 'react-intl';

global.React = React;

global.shallow = shallow;
global.render = render;
global.mount = mount;

window.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
  return 0;
};

console.error = message => {
  throw new Error(message);
};


/*
 * https://medium.com/@sapegin/testing-react-intl-components-with-jest-and-enzyme-f9d43d9c923e
 */

// Create IntlProvider to retrieve React Intl context
const intlProvider = new IntlProvider(
  {
    locale: 'en',
    messages: {
      message1: 'Hello world'
    }
  },
  {}
);
const { intl } = intlProvider.getChildContext();

// `intl` prop is required when using injectIntl HOC
const nodeWithIntlProp = node => React.cloneElement(node, { intl });

// shallow() with React Intl context
global.shallowWithIntl = (node, { context, ...options } = {}) => {
  return shallow(nodeWithIntlProp(node), {
    ...options,
    context: {
      ...context,
      intl
    }
  });
};
// mount() with React Intl context
global.mountWithIntl = (
  node,
  { context, childContextTypes, ...options } = {}
) => {
  return mount(nodeWithIntlProp(node), {
    ...options,
    context: {
      ...context,
      intl
    },
    childContextTypes: {
      intl: intlShape,
      ...childContextTypes
    }
  });
};

configure({ adapter: new Adapter() });
