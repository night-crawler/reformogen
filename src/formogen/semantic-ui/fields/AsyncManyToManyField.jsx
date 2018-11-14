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
  const handleChange = value => props.onChange(null, { 
    name: props.name, 
    value: value
  });
    
  let storedCallback = () => {};
  let storedInputText = '';

  console.log(`i render this AsyncManyToManyField: ${props.formId} ${props.name}`);
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
        cacheOptions={ false }
        defaultOptions={ true }
        loadOptions={ (inputText, callback) => {
          storedCallback = callback;
          storedInputText = inputText;
          props.loadOptions({ 
            formId: props.formId,  
            inputText: inputText, 
            fieldName: props.name,
            url: props.data,
            callback: callback,
          });
        } }

        onMenuOpen={ () => {
          props.loadOptions({
            formId: props.formId,  
            inputText: storedInputText, 
            fieldName: props.name,
            url: props.data,
            callback: storedCallback,
          });
        }
        }

        onMenuScrollToBottom={ () => {
          props.loadOptions({
            formId: props.formId,  
            inputText: storedInputText, 
            fieldName: props.name,
            url: props.data,
            callback: storedCallback,
          });
        } }

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
