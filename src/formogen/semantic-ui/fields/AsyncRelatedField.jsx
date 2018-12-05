import PropTypes from 'prop-types';
import React from 'react';
import { isEmpty } from 'lodash';
import { Form } from 'semantic-ui-react';
import { SelectBase } from 'react-select';

import propTypes from '../../fieldPropTypes';
import { FieldLabel } from '../FieldLabel';
import { ErrorsList } from '../ErrorsList';


import './AsyncRelatedField.css';

export class AsyncRelatedField extends React.Component {
  static propTypes = {
    ...propTypes,
    getOptionLabel: PropTypes.func,
    getOptionValue: PropTypes.func,
    isMulti: PropTypes.bool,
  };

  static defaultProps = {
    isMulti: false,
    loadOptions: payload => // eslint-disable-next-line
      console.info(`AsyncRelatedField.loadOptions(${JSON.stringify(payload)})`),
  
    getOptionLabel: ({ name, title }) => name || title,
    getOptionValue: ({ id }) => id,
  };

  constructor(props) {
    super(props);

    this.storedCallback = () => {};
    this.storedInputText = '';
    this.state = {
      openCounter: 0,
      menuIsOpen: false,
      isLoading: false,
      search: '',
    };
  }

  handleChange = value => this.props.onChange(null, { 
    name: this.props.name, 
    value: value
  });

  render() {
    return (
      <Form.Field
        className='AsyncRelatedField'
        required={ this.props.required }
        disabled={ !this.props.editable }
        width={ this.props.displayOptions.width }
        error={ !isEmpty(this.props.errors) }
      >
        <FieldLabel { ...this.props } />
        <SelectBase
          ref={ self => this.select = self }
          inputId={ `AsyncRelatedField-${this.props.formId}-${this.props.name}` }
          options={ this.props.options }
          
          inputValue={ this.state.search }
          placeholder={ this.props.placeholder }
          value={ this.props.value }

          menuIsOpen={ this.state.menuIsOpen }
          isClearable={ this.props.editable }
          isDisabled={ !this.props.editable }
          isLoading={ this.state.isLoading }
          isRtl={ this.props.isRtl }
          isMulti={ this.props.isMulti }
          
          hideSelectedOptions={ false }

          getOptionLabel={ this.props.getOptionLabel }
          getOptionValue={ this.props.getOptionValue }
  
          onChange={ this.handleChange } 
          onMenuClose={ this.handleMenuClose }
          onMenuOpen={ this.handleMenuOpen }
          onInputChange={ this.handleInputChange }
          onMenuScrollToBottom={ this.handleMenuScrollToBottom }
        />
        { !this.props.helpTextOnHover
          ? <span className='help-text'>{ this.props.help_text }</span>
          : ''
        }
        <ErrorsList messages={ this.props.errors } />
      </Form.Field>
    );
  }

  handleMenuClose = () => {
    // eslint-disable-next-line
    this.setState({
      search: '',
      menuIsOpen: false,
      isLoading: false,
    });
  }
  handleMenuOpen = async () => {
    // eslint-disable-next-line
    await this.setState(
      { menuIsOpen: true, openCounter: this.state.openCounter + 1 },
      async () => {
        // ! some magic with constants
        // When users trigger handleMenuOpen they always have the inputText cleared, so it's ok
        // to call the new search with '' query.
        // When user opens the menu we must trigger loadOptions once only to fix this strange react-select
        // behaviour when it just does not trigger handleMenuScrollToBottom on the first page.
        // Any further pagination logic must be covered in handleMenuScrollToBottom separately.
        if (this.state.openCounter === 1)
          await this.loadOptions();
      }
    );
  }
  handleInputChange = async search => {
    if (search === this.state.search)
      return;
    // eslint-disable-next-line
    await this.setState(
      { search },
      async () => await this.loadOptions()
    );
  }
  handleMenuScrollToBottom = async () => {
    await this.loadOptions();
  }
  async loadOptions() {
    const { loadOptions } = this.props;

    if (this.state.isLoading) 
      return;
    
    // eslint-disable-next-line
    await this.setState({ isLoading: true });

    await loadOptions({ 
      formId: this.props.formId,  
      searchText: this.state.search, 
      fieldName: this.props.name,
      url: this.props.data,
      callback: async () => { 
        // eslint-disable-next-line
        await this.setState({ isLoading: false });
      },
    });
  }

  componentDidMount = async () => {
    // we need this bullshit here because react-select does not trigger 
    // onMenuScrollToBottom for the FIRST time it's being rendered
    await this.loadOptions();
  }
}
