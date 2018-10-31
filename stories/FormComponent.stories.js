import React from 'react';
import { text, boolean, number, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { ContainerSegmentDecorator } from './storyDecorators';

import { FormComponent } from '~/formogen/semantic-ui/FormComponent';


const stories = storiesOf('Form|FormComponent', module).addDecorator(ContainerSegmentDecorator);


stories.add('default', () => {
  return (
    <FormComponent 
      formLayout={ [] }
    />
  );
});
