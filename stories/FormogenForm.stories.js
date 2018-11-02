import React from 'react';
import { text, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { FormogenForm } from '~/formogen-redux/FormogenForm';

import { withContainerSegmentForm, withStore } from './storyDecorators';



const stories = storiesOf('redux|FormogenForm', module)
  .addDecorator(withStore)
  .addDecorator(withContainerSegmentForm);

stories.add('default', () => {
  return (
    <FormogenForm />
  );
});
