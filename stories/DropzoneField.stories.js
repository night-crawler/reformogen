import React from 'react';
import { text, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { DropzoneField } from '~/formogen/semantic-ui/fields/DropzoneField';

import { withContainerSegmentForm } from './storyDecorators';
import { errorArray } from './sampleData';


const stories = storiesOf('Fields|DropzoneField', module).addDecorator(withContainerSegmentForm);


const files = [
  {
    lastModified: 1542093930314,
    lastModifiedDate: new Date(),
    name: 'po4ka.jpg',
    size: 196927,
    type: 'image/jpeg',
  },
  {
    lastModified: 1542093930314,
    lastModifiedDate: new Date(),
    name: 'this field name is very long, so long we have to truncate it, really.png',
    size: 196927,
    type: 'image/png',
  }
];

stories.add('default', () => {
  return (
    <DropzoneField 
      initialValue='http://localhost:8000/media/po4ka.jpg'
      type='DropzoneField'
      placeholder={ text('placeholder', 'some placeholder') }
      
      editable={ boolean('editable', true) }
      multiple={ boolean('multiple', true) }
      delete_url='http://localhost:8000/media/po4ka.jpg'

      help_text={ text('help_text', 'some help text') }
      name={ text('name', 'DropzoneField') }
      verbose_name={ text('verbose_name', 'verbose name of the field') }
      layoutOpts={ { width: number('layoutOpts.width', 4, { range: true, min: 1, max: 16 }) } }
      onChange={ action('onChange') }
      value={ files }
      errors={ errorArray }
    />
  );
});
