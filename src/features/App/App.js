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
              formId='bla'
              getFormComponent={ () => FormComponent }
              getFieldComponent={ getFieldComponentForType }
              describeUrl='http://localhost:8000/api/v1/sample/all/describe/'
            />
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}
