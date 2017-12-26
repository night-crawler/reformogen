import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

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

CaptionTruncator.propTypes = {
    caption: PropTypes.string,
    width: PropTypes.number
};
export function CaptionTruncator({ caption, width = 0 }) {
    return (
        <span
            style={ {
                display: 'inline-block',
                maxWidth: width,
                textShadow: '0 0 1px white',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
            } }
        >
            { caption }
        </span>
    );
}
