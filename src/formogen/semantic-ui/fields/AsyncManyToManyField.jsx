import PropTypes from 'prop-types';
import React from 'react';
import { isEmpty, map } from 'lodash';
import { Form } from 'semantic-ui-react';
import AsyncSelect from 'react-select/lib/Async';

import propTypes from '../../fieldPropTypes';
import { FieldLabel } from '../FieldLabel';
import { ErrorsList } from '../ErrorsList';


AsyncManyToManyField.propTypes = {
  ...propTypes,
  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,
};
AsyncManyToManyField.defaultProps = {
  loadOptions: payload => // eslint-disable-next-line
    console.info(`AsyncManyToManyField.loadOptions(${JSON.stringify(payload)})`),
  loadMoreOptions: payload => // eslint-disable-next-line
    console.info(`AsyncManyToManyField.loadMoreOptions(${JSON.stringify(payload)})`),

  getOptionLabel: ({ name }) => name,
  getOptionValue: ({ id }) => id,
};
export function AsyncManyToManyField(props) {
  const handleChange = val => {
    props.onChange(null, { 
      name: props.name, 
      value: map(val, props.getOptionValue),
    });
  };
    
  let storedCallback = () => {};
  let storedInputText = '';

  return (
    

    <Form.Field
      required={ props.required }
      disabled={ !props.editable }
      width={ props.layoutOpts.width }
      error={ !isEmpty(props.errors) }
    >
      <FieldLabel { ...props } />
      <AsyncSelect
        inputId={ `AsyncManyToManyField-${props.formId}-${props.name}` }
        placeholder={ props.placeholder }
        isClearable={ props.editable }
        isDisabled={ !props.editable }
        isLoading={ props.isLoading }
        isRtl={ props.isRtl }
        isMulti={ true }
        cacheOptions={ true }
        defaultOptions={ true }
        loadOptions={ (inputText, callback) => {
          storedCallback = callback;
          storedInputText = inputText;
          return props.loadOptions({ 
            formId: props.formId,  
            inputText: inputText, 
            fieldName: props.name,
            url: props.data,
            callback: callback,
          });
        } }

        onMenuScrollToBottom={ () => props.loadOptions({
          formId: props.formId,  
          inputText: storedInputText, 
          fieldName: props.name,
          url: props.data,
          callback: storedCallback,
        }) }

        value={ props.value }

        getOptionLabel={ props.getOptionLabel }
        getOptionValue={ props.getOptionValue }

        onChange={ handleChange } 
      />
      { !props.helpTextOnHover
        ? <span className='help-text'>{ props.help_text }</span>
        : ''
      }
      <ErrorsList messages={ props.errors } />
    </Form.Field>
  );
}
