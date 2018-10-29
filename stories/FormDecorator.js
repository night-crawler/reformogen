import React from 'react';
import { Form, Segment, Container } from 'semantic-ui-react';


export const FormDecorator = storyFn =>
  <Container fluid={ true }>
    <Segment basic={ true } color='red'>
      <Form>
        { storyFn() }
      </Form>
    </Segment>
  </Container>;
