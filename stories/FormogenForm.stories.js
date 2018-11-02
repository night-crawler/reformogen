import React from 'react';
import { text, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { FormogenForm } from '~/formogen/FormogenForm';

import { withContainerSegmentForm, withStore } from './storyDecorators';
import { errorArray } from './sampleData';



const stories = storiesOf('Form|FormogenForm', module)
  .addDecorator(withStore)
  .addDecorator(withContainerSegmentForm);

stories.add('default', () => {
  return (
    <FormogenForm />
  );
});
