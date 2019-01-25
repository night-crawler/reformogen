import 'react-datepicker/dist/react-datepicker.css';
import React from 'react';
import { text, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { DateTimeField } from '~/formogen/semantic-ui/fields/DateTimeField';

import { withContainerSegmentForm } from './storyDecorators';
import { errorArray } from './sampleData';

const stories = storiesOf('Fields|DateTimeField', module).addDecorator(withContainerSegmentForm);


stories.add('default', () => {
  return (
    <DateTimeField 
      type='DateField'
      placeholder={ text('placeholder', 'some placeholder') }
      editable={ boolean('editable', true) }
      help_text={ text('help_text', 'some help text') }
      name={ text('name', 'dateTimeField') }
      verbose_name={ text('verbose_name', 'verbose name of the field') }
      displayOptions={ { width: number('displayOptions.width', 4, { range: true, min: 1, max: 16 }) } }
      onChange={ action('onChange') }
      value={ text('value', '2018-10-09T21:00:00.000Z') }
      errors={ errorArray }
    />
  );
});
