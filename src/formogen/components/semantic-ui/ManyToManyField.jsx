import React from 'react';
import { Form } from 'semantic-ui-react';
import Select from 'react-select';


import 'react-select/dist/react-select.css';

import Label from './Label';

import propTypes from '../fieldPropTypes';


ManyToManyField.propTypes = propTypes;
export default function ManyToManyField(props) {
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
    const handleChange = (val) => {
        console.log(val);
    };

    return (
        <Form.Field required={ props.required } disabled={ !props.editable }>
            <Label { ...props } />

            <Select
                closeOnSelect={ false }
                disabled={ !props.editable }
                multi={ true }
                onChange={ handleChange }
                options={ [] }
                placeholder={ props.placeholder }
                // removeSelected={this.state.removeSelected}
                // rtl={this.state.rtl}
                simpleValue={ true }
                value={ props.value }
                inputProps={ { type: 'react-type' } }  // fixing breaking semantic markup
            />

            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
}
