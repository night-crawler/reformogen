import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import { Dimmer, Image, Loader, Message, Segment } from 'semantic-ui-react';


export const LoaderComponent = () => (
    <Segment>
        <Dimmer active={ true }>
            <Loader>Loading...</Loader>
        </Dimmer>

        <Image src='/assets/images/wireframe/short-paragraph.png' />
    </Segment>
);

MessageList.propTypes = {
    header: PropTypes.string,
    messages: PropTypes.arrayOf(PropTypes.string),
    color: PropTypes.string,
};
export function MessageList({ header = '', messages, color = 'red' }) {
    if (_.isEmpty(messages)) {
        return null;
    }
    return (
        <Message color={ color }>
            { header && <Message.Header>{ header }</Message.Header> }
            <Message.List>
                { messages.map((msg, i) => <Message.Item key={ i }>{ msg }</Message.Item>) }
            </Message.List>
        </Message>
    );
}
