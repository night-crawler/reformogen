import React from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Form as SUIForm, Grid } from 'semantic-ui-react';
import { isEmpty } from 'lodash';

import { NonFieldErrorsList } from './NonFieldErrorsList';

function DefaultSubmitComponent(props) {
  const { style, ...rest } = props;
  const patchedStyle = {
    marginTop: '20px',
    ...style,
  };
  return <Button style={ patchedStyle } { ...rest } />;
}


FormComponent.displayName = 'FormComponent';
FormComponent.propTypes = {
  loading: PropTypes.bool.isRequired,

  title: PropTypes.string,
  isTitleVisible: PropTypes.bool,

  nonFieldErrorsMap: PropTypes.object,
  formLayout: PropTypes.array.isRequired,

  submitComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
    PropTypes.instanceOf(React.Component)
  ]),
  onSubmit: PropTypes.func,
};
FormComponent.defaultProps = {
  loading: false,
  title: 'Formogen Form',
  isTitleVisible: true,
  submitComponent: DefaultSubmitComponent,
};
export function FormComponent(props) {
  const { submitComponent: SubmitComponent } = props;
  return (
    <SUIForm loading={ props.loading }>
      { props.isTitleVisible
        ? <Header as='h2' dividing={ true }>{ props.title }</Header>
        : null
      }
      <div className='layouts'>
        { !isEmpty(props.nonFieldErrorsMap) &&
          <NonFieldErrorsList errors={ props.nonFieldErrorsMap } />
        }
        { props.formLayout.map(({ header, fields }, i) =>
          <Grid key={ `layout:${i}` } columns={ 16 } className='layout'>
            { !!header &&
              <div className='sixteen wide column'>
                <Header>{ header }</Header>
              </div>
            }
            { fields }
          </Grid>
        ) }
      </div>
      <SubmitComponent
        type='submit'
        content='Submit'
        fluid={ true }

        onClick={ props.onSubmit }
      />
    </SUIForm>
  );
}
