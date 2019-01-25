import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Message } from 'semantic-ui-react';


ErrorsList.displayName = 'ErrorsList';
ErrorsList.propTypes = {
  header: PropTypes.string,
  messages: PropTypes.arrayOf(PropTypes.string),
  color: PropTypes.string,
};
ErrorsList.defaultProps = {
  header: 'Errors',
  color: 'red',
};
export function ErrorsList(props) {
  if (isEmpty(props.messages))
    return null;

  return (
    <Message color={ props.color }>
      { props.header && <Message.Header>{ props.header }</Message.Header> }
      <Message.List>
        { props.messages.map((msg, i) => 
          <Message.Item key={ i }>{ msg }</Message.Item>) }
      </Message.List>
    </Message>
  );
}
