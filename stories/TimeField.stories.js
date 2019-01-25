import 'react-times/css/material/default.css';
import React from 'react';
import { text, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { TimeField } from '~/formogen/semantic-ui/fields/TimeField';

import { withContainerSegmentForm } from './storyDecorators';
import { errorArray } from './sampleData';

const stories = storiesOf('Fields|TimeField', module).addDecorator(withContainerSegmentForm);


stories.add('default', () => 
  <TimeField 
    type='TimeField'
    placeholder={ text('placeholder', 'some placeholder') }
    editable={ boolean('editable', true) }
    help_text={ text('help_text', 'some help text') }
    name={ text('name', 'sampleTime') }
    verbose_name={ text('verbose_name', 'verbose name of the field') }
    displayOptions={ { width: number('displayOptions.width', 4, { range: true, min: 1, max: 16 }) } }
    onChange={ action('onChange') }
    value={ text('value', '00:22:33') }
    errors={ errorArray }
  />
);

