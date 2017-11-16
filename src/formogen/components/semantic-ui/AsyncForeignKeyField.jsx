import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';
import Select from 'react-select';
import _ from 'lodash';
import PropTypes from 'prop-types';
import 'react-select/dist/react-select.css';
import fetch from 'isomorphic-fetch';
import Label from './Label';
import propTypes from '../fieldPropTypes';


class ModelInstanceOption extends Component {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        isDisabled: PropTypes.bool,
        isFocused: PropTypes.bool,
        isSelected: PropTypes.bool,
        onFocus: PropTypes.func,
        onSelect: PropTypes.func,
        option: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
    }

    handleMouseDown = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.props.onSelect(this.props.option, event);
    };

    handleMouseEnter = (event) => {
        this.props.onFocus(this.props.option, event);
    };

    handleMouseMove = (event) => {
        if (this.props.isFocused) return;
        this.props.onFocus(this.props.option, event);
    };

    render () {
        let option = this.props.option,
            title = option.printable_name || option.name || option.title;

        return (
            <div className={ this.props.className }
                onMouseDown={ this.handleMouseDown }
                onMouseEnter={ this.handleMouseEnter }
                onMouseMove={ this.handleMouseMove }
                title={ this.props.option.title }>

                { title }
                {this.props.children}
            </div>
        );
    }
}


class ModelInstanceValue extends Component {
    static propTypes = {
        children: PropTypes.node,
        placeholder: PropTypes.string,
        value: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render () {
        let value = this.props.value, title = value.printable_name || value.name || value.title;
        return (
            <div className="Select-value FUCK IT" title={ this.props.value.title }>
                <span className="Select-value-label">
                    { title}
                    {this.props.children}
                </span>
            </div>
        );
    }
}



AsyncForeignKeyField.propTypes = propTypes;
export default function AsyncForeignKeyField(props) {
    /*
        "name": "inspire_source",
        "verbose_name": "inspire source",
        "help_text": "",
        "blank": true,
        "null": false,
        "editable": true,
        "type": "ForeignKeyField",
        "required": false,
        "data": []
    */
    const handleChange = (val) => {
        props.onChange(null, {name: props.name, value: val ? val*1 : null});
    };

    const loadOptions = (input, callback) => {
        fetch(props.data)
            .then(response => response.json())
            .then(json => {
                if (_.isArray(json)) {  /* without pagination */
                    callback(null, { complete: false, options: json, });
                } else {  /* with pagination */
                    callback(null, { complete: false, options: json.results, });
                }
            });
    };

    let _props = {
        clearable: !props.required,
        closeOnSelect: true,
        disabled: !props.editable,
        multi: false,
        onChange: handleChange,
        // options: makeOptions(props.data),
        placeholder: props.placeholder,
        simpleValue: true,
        value: props.value,
        inputProps: {type: 'react-type'},  // fixes broken semantic markup
        removeSelected: true,
        loadOptions: loadOptions,

        valueKey: 'id',
        optionComponent: ModelInstanceOption,
        valueComponent: ModelInstanceValue,

        // rtl: this.state.rtl,
    };

    if (_.isFunction(props.updateProps)) {
        _props = props.updateProps(_props, props);
    }

    return (
        <Form.Field required={ props.required } disabled={ !props.editable }>
            <Label { ...props } />
            <Select.Async { ..._props } />
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : ''}
        </Form.Field>
    );
}
