import React, { Component } from 'react';
import { Segment, Grid } from 'semantic-ui-react';

import { FormogenForm } from '~/formogen-redux/FormogenForm';

import { FormComponent } from '~/formogen/semantic-ui/FormComponent';

import { getFieldComponentForType } from '~/formogen-redux/semantic-ui';


export class App extends Component {
  render() {
    return (
      <Grid columns='2'>
        <Grid.Column>
          <Segment color='red'>
            <FormogenForm
              formId='bla-1'
              getFormComponent={ () => FormComponent }
              getFieldComponent={ getFieldComponentForType }
              describeUrl='http://localhost:8000/api/v1/sample/authors/describe/'
            />
          </Segment>
        </Grid.Column>

        <Grid.Column>
          <Segment color='red'>
            <FormogenForm
              formId='bla-2'
              getFormComponent={ () => FormComponent }
              getFieldComponent={ getFieldComponentForType }
              describeUrl='http://localhost:8000/api/v1/sample/authors/1/describe_object/'
              objectUrl='http://localhost:8000/api/v1/sample/authors/1/'
            />
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}
