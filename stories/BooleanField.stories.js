import React from 'react';
import { text, boolean, number, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { BooleanField } from '~/formogen/semantic-ui/fields/BooleanField';

import { ContainerSegmentFormDecorator } from './storyDecorators';
import { errorArray } from './ErrorMessages.sample';

const stories = storiesOf('Fields|BooleanField', module).addDecorator(ContainerSegmentFormDecorator);


stories.add('default', () => {
  return (
    <BooleanField 
      type='BooleanField'
      placeholder={ text('placeholder', 'some placeholder') }
      editable={ boolean('editable', true) }
      help_text={ text('help_text', 'some help text') }
      name={ text('name', 'booleanField') }
      verbose_name={ text('verbose_name', 'verbose name of the field') }
      layoutOpts={ { width: number('layoutOpts.width', 4, { range: true, min: 1, max: 16 }) } }
      onChange={ action('onChange') }
      widget={ select('widget', { toggle: 'toggle', slider: 'slider', nope: '' }, '') }
      errors={ errorArray }
    />
  );
});
