import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import { FormattedMessage as Tr } from 'react-intl';

import messages from './messages';

export class Feature extends Component {
  static propTypes = {
    inverted: PropTypes.bool,
  };

  static defaultProps = {
    inverted: false,
  };

  render() {
    return (
      <Segment inverted={ this.props.inverted } basic={ true }>
        <Tr { ...messages.sample } />
      </Segment>
    );
  }
}
