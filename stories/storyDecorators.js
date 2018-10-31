import React from 'react';
import { Form, Segment, Container } from 'semantic-ui-react';


export const ContainerSegmentFormDecorator = storyFn =>
  <Container fluid={ true }>
    <Segment basic={ true } color='red'>
      <Form>
        { storyFn() }
      </Form>
    </Segment>
  </Container>;

export const ContainerSegmentDecorator = storyFn =>
  <Container fluid={ true }>
    <Segment basic={ true } color='red'>
      { storyFn() }
    </Segment>
  </Container>;
