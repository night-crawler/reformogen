import React from 'react';

import { Form } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.css';  // TODO: сoncretize it


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

export const ChoiceFieldComponent = (opts) => {
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
    return <Form.Select
        label={ opts.verbose_name }
        options={ makeOptions(opts.choices) }
    />;
};

export const CharFieldComponent = (opts) => {
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
    return <Form.Field
        label={ opts.verbose_name }
        type='text'
        control='input'
        maxLength={ opts.max_length }
    />;
};

export const TextFieldComponent = (opts) => {
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
    return <Form.TextArea
        label={ opts.verbose_name }
    />;
};

export const PositiveSmallIntegerFieldComponent = (opts) => {
    return <Form.Input
        label={ opts.verbose_name }
    />;
};

export const DateTimeFieldComponent = (opts) => {
    /*
        "name": "dt_death",
        "verbose_name": "death date time",
        "help_text": "",
        "blank": true,
        "null": true,
        "editable": true,
        "type": "DateTimeField",
        "required": false
     */
};

export const MultipleChoiceFieldComponent = (opts) => {
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
    opts.default_choice_render_name = 'id';
    return <Form.Input/>;
};
