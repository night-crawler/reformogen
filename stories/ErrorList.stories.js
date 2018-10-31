import React from 'react';
import { storiesOf } from '@storybook/react';

import { ErrorsList } from '~/formogen/semantic-ui/ErrorsList';

import { ContainerSegmentFormDecorator } from './storyDecorators';


const stories = storiesOf('Fields|ErrorsList', module).addDecorator(ContainerSegmentFormDecorator);


stories.add('default', () => {
  return (
    <ErrorsList messages={ [ 'some error 1', 'some error 2' ] } />
  );
});
