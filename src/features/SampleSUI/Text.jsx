import React from 'react';
import PropTypes from 'prop-types';
import { Form, Checkbox, Segment } from 'semantic-ui-react';

export class Text extends React.Component {
  static propTypes = {
    uuid: PropTypes.string,
    data: PropTypes.any,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Segment as={ Form } className='Text Block' color='brown'>
        { this.props.uuid } - { JSON.stringify(this.props.data) }
        <Checkbox
          label='EN > RU'
          toggle={ true }
        />
      </Segment>
    );
  }
}
