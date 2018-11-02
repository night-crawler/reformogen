import React from 'react';
import { text, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { CharField } from '~/formogen/semantic-ui/fields/CharField';

import { ContainerSegmentFormDecorator } from './storyDecorators';
import { errorArray } from './sampleData';


const stories = storiesOf('Fields|CharField', module).addDecorator(ContainerSegmentFormDecorator);


stories.add('default', () => {
  return (
    <CharField 
      type='CharField'
      placeholder={ text('placeholder', 'some placeholder') }
      editable={ boolean('editable', true) }
      help_text={ text('help_text', 'some help text') }
      name={ text('name', 'charField') }
      verbose_name={ text('verbose_name', 'verbose name of the field') }
      layoutOpts={ { width: number('layoutOpts.width', 4, { range: true, min: 1, max: 16 }) } }
      onChange={ action('onChange') }
      errors={ errorArray }
    />
  );
});
