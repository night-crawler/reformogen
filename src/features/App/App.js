import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';

import { FormogenForm } from '~/formogen-redux/FormogenForm';

import { FormComponent } from '~/formogen/semantic-ui/FormComponent';

import { getFieldComponentForType } from '~/formogen-redux/semantic-ui';


export class App extends Component {
  render() {
    return (
      <Segment color='red'>
        <FormogenForm
          formId='bla'
          getFormComponent={ () => FormComponent }
          getFieldComponent={ getFieldComponentForType }
          
          objectUrl='http://localhost:8000/api/v1/sample/all/describe/'
        />
      </Segment>
    );
  }
}
