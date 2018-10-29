import React from 'react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { Text } from '~/features/SampleSUI/Text';

const stories = storiesOf('Blocks|Text', module);

stories.addDecorator(withKnobs);

stories.add('default', () => {
  return (
    <Text 
      uuid='sample'
      data={ {
        text: text('text')
      } }
    />
  );
});

