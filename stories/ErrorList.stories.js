import React from 'react';
import { storiesOf } from '@storybook/react';

import { ErrorsList } from '~/formogen/semantic-ui/ErrorsList';

import { withContainerSegmentForm } from './storyDecorators';


const stories = storiesOf('Fields|ErrorsList', module).addDecorator(withContainerSegmentForm);


stories.add('default', () => {
  return (
    <ErrorsList messages={ [ 'some error 1', 'some error 2' ] } />
  );
});
