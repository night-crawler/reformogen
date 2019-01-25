import React from 'react';
import { storiesOf } from '@storybook/react';

import { NonFieldErrorsList } from '~/formogen/semantic-ui/NonFieldErrorsList';

import { withContainerSegmentForm } from './storyDecorators';
import { errorArray } from './sampleData';


const stories = storiesOf('Fields|NonFieldErrorsList', module).addDecorator(withContainerSegmentForm);

stories.add('default', () => {
  return (
    <NonFieldErrorsList 
      errors={ {
        Header: errorArray,
      } }
    />
  );
});
