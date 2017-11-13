import React from 'react';

import { Dimmer, Image, Loader, Segment } from 'semantic-ui-react';


export const LoaderComponent = () => (
    <Segment>
        <Dimmer active={ true }>
            <Loader>Loading...</Loader>
        </Dimmer>

        <Image src='/assets/images/wireframe/short-paragraph.png' />
    </Segment>
);
