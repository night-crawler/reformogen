import React from 'react';

import _ from 'lodash';

import { Dimmer, Image, Loader, Segment } from 'semantic-ui-react';
import { Message } from 'semantic-ui-react';


export const LoaderComponent = () => (
    <Segment>
        <Dimmer active={ true }>
            <Loader>Loading...</Loader>
        </Dimmer>

        <Image src='/assets/images/wireframe/short-paragraph.png' />
    </Segment>
);


export const MessageList = ({ header = '', messages, color = 'red' }) => {
    if (_.isEmpty(messages)) {
        return null;
    }
    return (
        <Message color={ color }>
            { header && <Message.Header>{ header }</Message.Header> }
            <Message.List>
                { !_.isEmpty(messages) && messages.map((msg, i) => <Message.Item key={ i }>{ msg }</Message.Item>) }
            </Message.List>
        </Message>
    );
};
