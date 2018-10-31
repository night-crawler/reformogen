import 'react-datepicker/dist/react-datepicker.css';
import React from 'react';
import { text, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { DateField } from '~/formogen/semantic-ui/fields/DateField';

import { ContainerSegmentFormDecorator } from './storyDecorators';
import { errorArray } from './ErrorMessages.sample';

const stories = storiesOf('Fields|DateField', module).addDecorator(ContainerSegmentFormDecorator);


stories.add('default', () => {
  return (
    <DateField 
      type='DateField'
      placeholder={ text('placeholder', 'some placeholder') }
      editable={ boolean('editable', true) }
      help_text={ text('help_text', 'some help text') }
      name={ text('name', 'dateField') }
      verbose_name={ text('verbose_name', 'verbose name of the field') }
      layoutOpts={ { width: number('layoutOpts.width', 4, { range: true, min: 1, max: 16 }) } }
      onChange={ action('onChange') }
      value={ text('value', '2018-10-09T21:00:00.000Z') }
      errors={ errorArray }
    />
  );
});
