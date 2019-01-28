import React from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Form as SUIForm, Grid } from 'semantic-ui-react';
import { isEmpty } from 'lodash';

import { NonFieldErrorsList } from './NonFieldErrorsList';

DefaultSubmitComponent.propTypes = {
  style: PropTypes.shape
};

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
  fieldsets: PropTypes.array,

  submitComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
    PropTypes.instanceOf(React.Component)
  ]),
  onSubmit: PropTypes.func,
};
FormComponent.defaultProps = {
  loading: false,
  title: '',
  isTitleVisible: true,
  submitComponent: DefaultSubmitComponent,
  fieldsets: [],

  onSubmit: (...args) => // eslint-disable-next-line
    console.warn('FormComponent.onSubmit', args)
};
export function FormComponent(props) {
  const { submitComponent: SubmitComponent } = props;
  return (
    <SUIForm loading={ props.loading } onSubmit={ () => props.onSubmit() }>
      { props.isTitleVisible && props.title
        ? <Header as='h2' dividing={ true }>{ props.title }</Header>
        : null
      }
      <div className='layouts'>
        { !isEmpty(props.nonFieldErrorsMap) &&
          <NonFieldErrorsList errors={ props.nonFieldErrorsMap } />
        }
        { props.fieldsets.map(({ header, fields }, i) =>
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

        onSubmit={ props.onSubmit }
      />
    </SUIForm>
  );
}
