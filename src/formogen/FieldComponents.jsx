import React from 'react';
import loglevel from 'loglevel';
import { Form, Popup, Icon } from 'semantic-ui-react';
import { Dropdown } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import './custom.css';
import 'react-datepicker/dist/react-datepicker.css';


const makeOptions = (choices) => {
    /*
        const options = [
            { key: 'm', text: 'Male', value: 'male' },
            { key: 'f', text: 'Female', value: 'female' },
        ];
    */
    return choices.map( ([ key, val ]) => {
        return {
            key: key,
            value: key,
            text: val,
        };
    });
};


const defaultFieldComponentPropTypes = {
    upperFirstLabel: PropTypes.bool,
    name: PropTypes.string.isRequired,
    value: PropTypes.any,
    verbose_name: PropTypes.string.isRequired,
    help_text: PropTypes.string.isRequired,
    blank: PropTypes.bool,
    null: PropTypes.bool,
    editable: PropTypes.bool,
    type: PropTypes.string.isRequired,
    required: PropTypes.bool,
    default: PropTypes.any,
    choices: PropTypes.arrayOf(PropTypes.array),
    placeholder: PropTypes.string,
    max_length: PropTypes.number,
    helpTextOnHover: PropTypes.bool,

    locale: PropTypes.string,
    onChange: PropTypes.func,
};

const getLabel = (props) => {
    const labelText = props.upperFirstLabel ? _.upperFirst(props.verbose_name) : props.verbose_name;
    if (!props.help_text || !props.helpTextOnHover) {
        return <label>{ labelText }</label>;
    }
    return (
        <label>
            <Popup
                trigger={ <Icon name="help" /> }
                content={ props.help_text }
                wide={ true }
                position='bottom left'
            />
            { labelText }
        </label>
    );
};
getLabel.propTypes = defaultFieldComponentPropTypes;


/**
 * Generic Field Component to use in DEBUG MODE ONLY
 * @param {Object} props
 * @returns {XML}
 * @constructor
 */
export const GenericFieldComponent = (props) => {
    loglevel
        .getLogger('FieldComponents.jsx:GenericFieldComponent')
        .warn(`Using a placeholder GenericFieldComponent to render field "${props.name}" of type "${props.type}"`);
    return (
        <Form.Field required={ props.required } disabled={ !props.editable }>
            { getLabel(props) }
            <pre>
                { JSON.stringify(props, null, 4) }
            </pre>
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
};
GenericFieldComponent.propTypes = defaultFieldComponentPropTypes;


export const ChoiceFieldComponent = (props) => {
    /*
        "name": "state",
        "verbose_name": "state",
        "help_text": "",
        "blank": false,
        "null": false,
        "editable": true,
        "type": "PositiveSmallIntegerField",
        "required": true,
        "default": 255,
        "choices": [
            [0, "dead"],
            [255, "alive"],
            [30, "dried"]
        ]
     */

    return (
        <Form.Field required={ props.required } disabled={ !props.editable }>
            { getLabel(props) }
            <Form.Select
                options={ makeOptions(props.choices) }
                name={ props.name }
                onChange={ props.onChange }
            />
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
};
ChoiceFieldComponent.propTypes = defaultFieldComponentPropTypes;


export const AutocompleteChoiceFieldComponent = (props) => {
    /*
        "name": "state",
        "verbose_name": "state",
        "help_text": "",
        "blank": false,
        "null": false,
        "editable": true,
        "type": "PositiveSmallIntegerField",
        "required": true,
        "default": 255,
        "choices": [
            [0, "dead"],
            [255, "alive"],
            [30, "dried"]
        ]
     */

    // https://react.semantic-ui.com/collections/form#form-example-field-control
    return (
        <Form.Field required={ props.required } disabled={ !props.editable }>
            { getLabel(props) }
            <Dropdown
                name={ props.name }
                options={ makeOptions(props.choices) }
                onChange={ props.onChange }
                placeholder={ props.placeholder }
                search={ true }
                selection={ true } />
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
};
AutocompleteChoiceFieldComponent.propTypes = defaultFieldComponentPropTypes;


export const CharFieldComponent = (props) => {
    /*
        "name": "first_name",
        "verbose_name": "имя",
        "help_text": "Имя контактного лица для отчетов",
        "blank": true,
        "null": false,
        "editable": true,
        "max_length": 40,
        "type": "CharField",
        "required": false
    */

    return (
        <Form.Field required={ props.required } disabled={ !props.editable }>
            { getLabel(props) }
            <Form.Input
                name={ props.name }
                value={ props.value }
                onChange={ props.onChange }
                type='text'
                maxLength={ props.max_length } />
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
};
CharFieldComponent.propTypes = defaultFieldComponentPropTypes;


export const TextFieldComponent = (props) => {
    /*
        "name": "biography",
        "verbose_name": "biography",
        "help_text": "",
        "blank": true,
        "null": false,
        "editable": true,
        "type": "TextField",
        "required": false
     */

    return (
        <Form.Field required={ props.required } disabled={ !props.editable }>
            { getLabel(props) }
            <Form.TextArea
                name={ props.name }
                value={ props.value }
                onChange={ props.onChange }
            />
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
};
TextFieldComponent.propTypes = defaultFieldComponentPropTypes;


export const PositiveSmallIntegerFieldComponent = (props) => {
    return (
        <Form.Field required={ props.required } disabled={ !props.editable }>
            { getLabel(props) }
            <Form.Input
                name={ props.name }
                value={ props.value }
                onChange={ props.onChange }
                type='number'
            />
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
};
PositiveSmallIntegerFieldComponent.propTypes = defaultFieldComponentPropTypes;


/**
 * Component should receive a value in ISO format
 * @param {Object[]} props {
 *      "name": "dt_death",
        "verbose_name": "death date time",
        "help_text": "",
        "blank": true,
        "null": true,
        "editable": true,
        "type": "DateTimeField",
        "required": false
 * }
 * @param {string} props[].value - well ISO-formatted value to pass moment()
 * @returns {XML}
 * @constructor
 */
export const DateTimeFieldComponent = (props) => {
    const handleChange = (momentTimeObject, e) => {
        // proxy event with SUI-React compliant style
        props.onChange(e, {
            name: props.name,
            value: momentTimeObject ? momentTimeObject.toISOString() : null
        });
    };

    //
    const preSelectedValue = props.value ? moment(props.value) : null;
    return (
        <Form.Field required={ props.required } disabled={ !props.editable }>
            { getLabel(props) }
            <DatePicker
                name={ props.name }
                selected={ preSelectedValue }
                onChange={ handleChange }
                showTimeSelect={ true }
                timeFormat="HH:mm"
                timeIntervals={ 60 }
                locale={ props.locale }
                placeholderText={ props.placeholder || props.help_text }
                todayButton={ 'Now' }
                dateFormat="YYYY.MM.DD HH:mm"
                showYearDropdown={ true }
                showMonthDropdown={ true }
                dropdownMode="select"
            />
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
};
DateTimeFieldComponent.propTypes = defaultFieldComponentPropTypes;


export const MultipleChoiceFieldComponent = (props) => {
    /*
        "name": "inspire_source",
        "verbose_name": "inspire source",
        "help_text": "",
        "blank": true,
        "null": false,
        "editable": true,
        "type": "ManyToManyField",
        "required": false,
        "data": []
    */
    props.default_choice_render_name = 'id';
    return <Form.Input />;
};
