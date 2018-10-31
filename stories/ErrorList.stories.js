import React from 'react';
import { text, boolean, number, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { ErrorsList } from '~/formogen/semantic-ui/common/ErrorsList';

import { FormDecorator } from './FormDecorator';


const stories = storiesOf('Fields|ErrorsList', module).addDecorator(FormDecorator);


stories.add('default', () => {
  return (
    <ErrorsList messages={ [ 'some error 1', 'some error 2' ] } />
  );
});
