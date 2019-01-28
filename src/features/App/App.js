import React, { Component } from 'react';
import { Segment, Grid, Button } from 'semantic-ui-react';
import { FormogenForm } from 'reformogen-redux/build/FormogenForm';

import { FormComponent } from '~/formogen/semantic-ui/FormComponent';

import { getFieldComponentForType } from 'reformogen-redux/build/semantic-ui';


export class App extends Component {
  state = { showFirst: true };
  
  render() {
    return (
      <Grid columns='3'>
        <Grid.Column>
          <Button content='Check clean up' fluid={ true } onClick={ () => {
            // eslint-disable-next-line          
            this.setState({ showFirst: !this.state.showFirst })
          } } />
          { this.state.showFirst && 
            <Segment color='red'>
              <FormogenForm
                formId='form-1'
                locale='ru'
                getFormComponent={ () => FormComponent }
                getFieldComponent={ getFieldComponentForType }
                describeUrl='http://localhost:8000/api/v1/sample/authors/describe/'
                createUrl='http://localhost:8000/api/v1/sample/authors/'
              />
            </Segment>
          }
        </Grid.Column>
        
        <Grid.Column>
          <Segment color='red'>
            <FormogenForm
              formId='form-2'
              getFormComponent={ () => FormComponent }
              getFieldComponent={ getFieldComponentForType }
              describeUrl='http://localhost:8000/api/v1/sample/authors/1/describe_object/'
              objectUrl='http://localhost:8000/api/v1/sample/authors/1/'
            />
          </Segment>
        </Grid.Column>

        <Grid.Column>
          <Segment color='red'>
            <FormogenForm
              formId='form-3'
              getFormComponent={ () => FormComponent }
              getFieldComponent={ getFieldComponentForType }
              describeUrl='http://localhost:8000/api/v1/sample/books/1/describe_object/'
              objectUrl='http://localhost:8000/api/v1/sample/books/1/'
            />
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}
