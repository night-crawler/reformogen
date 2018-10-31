import React from 'react';
import { storiesOf } from '@storybook/react';

import { NonFieldErrorsList } from '~/formogen/semantic-ui/NonFieldErrorsList';

import { ContainerSegmentFormDecorator } from './storyDecorators';
import { errorArray } from './ErrorMessages.sample';


const stories = storiesOf('Fields|NonFieldErrorsList', module).addDecorator(ContainerSegmentFormDecorator);

stories.add('default', () => {
  return (
    <NonFieldErrorsList 
      errors={ {
        Header: errorArray,
      } }
    />
  );
});
