import React from 'react';
import { text, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { InlineManyToManyField } from '~/formogen/semantic-ui/fields/InlineManyToManyField';

import { withContainerSegmentForm } from './storyDecorators';
import { errorArray, inlineFieldData } from './sampleData';

const stories = storiesOf('Fields|ManyToManyField', module).addDecorator(withContainerSegmentForm);


class InlineManyToManyFieldWrapper extends React.Component {
  state = {
    data: inlineFieldData,
    value: [ 1 ],
  };

  render() {
    return (
      <InlineManyToManyField 
        type='InlineManyToManyField'
        placeholder={ text('placeholder', 'some placeholder') }
        editable={ boolean('editable', true) }
        help_text={ text('help_text', 'some help text') }
        name={ text('name', 'inlineManyToManyField') }
        verbose_name={ text('verbose_name', 'verbose name of the field') }
        layoutOpts={ { width: number('layoutOpts.width', 4, { range: true, min: 1, max: 16 }) } }
        onChange={ this.handleChange }
        errors={ errorArray }
        data={ this.state.data }
        value={ this.state.value }
      />
    );
  }

  handleChange = (e, { name, value }) => {
    // eslint-disable-next-line
    this.setState(
      { value },
      () => action('onChange')(e, { name, value })
    );
  };
}


stories.add('InlineManyToManyField', () => <InlineManyToManyFieldWrapper />);
