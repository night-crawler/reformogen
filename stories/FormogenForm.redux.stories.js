import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, boolean, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { FormogenForm } from '~/formogen/FormogenForm';

import { withContainerSegment } from './storyDecorators';


const stories = storiesOf('Form|FormogenForm', module)
  .addDecorator(withContainerSegment);

stories.add('default', () => {
  return (
    <FormogenForm 
      actions={ {
        bootstrap: action('actions.bootstrap')
      } }
    />
  );
});
