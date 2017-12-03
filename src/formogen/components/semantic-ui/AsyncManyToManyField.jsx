import React, { Component } from 'react';
import PropTypes from 'prop-types';

import loglevel from 'loglevel';

import _ from 'lodash';

import * as URI from 'urijs';

import { Form } from 'semantic-ui-react';

import Select from 'react-select';

import propTypes from '../fieldPropTypes';
import Label from './Label';
import { MessageList } from './MiscComponents';
import ModelInstanceOption from './ReactSelectOptionComponent';
import ModelInstanceValue from './ReactSelectValueComponent';
import { resolveResponse } from '../../utils';



function extractPageNumber(uri) {
    const query = new URI(uri).query(true);
    return query.page || query.p || query.page_num;
}

/**
 * If value contains a list of objects like {id: 1, ...} it returns a list of ids. Any id coerces to int.
 * @param {Number|String|Array.<Number>|Array.<String>|Array.<Object>} value
 * @returns {Array.<Number>|Array}
 */
function idsList(value) {
    if (!value)
        return [];
    if (_.isEmpty(value))
        return [];

    if (_.isPlainObject(value))
        return [+value.id];


    if (_.isPlainObject(value[0])) {
        return _(value).map('id').map((v) => +v).value();
    }

    if (_.isArray(value))
        return _.map(value, (v) => +v);

    return [+value];
}


const SelectStateEvaluator = WrappedComponent => class extends Component {
    static propTypes = propTypes;

    // --------------- constructor ---------------
    constructor(props) {
        super(props);

        const id = new Date().getTime();

        this.log = loglevel.getLogger(`SelectStateEvaluator id=${ id }`);
        this.log.debug('Initialized');

        // pre-populate options from object if it's present in props
        let _value = idsList(props.value), _optionsByIdMap={};
        if (!_.isEmpty(_value) && _.isPlainObject(props.value[0])) {
            _optionsByIdMap = _.keyBy(props.value, 'id');
        }

        this.state = {
            id,

            query: '',
            queryMap: {
                '': {
                    ids: _value,
                    page: 1,
                    completed: false,
                }
            },
            optionsByIdMap: _optionsByIdMap,  /* {id: {id: 12, name: 123}} */
            options: _(_optionsByIdMap).values().value(),
            isLoading: false,
        };

    }

    // --------------- React.js standard ---------------
    componentWillMount() {
        // TODO:
        // TEMP & CRUTCH: trigger handleChange() to make sure the field's value is in correct format.
        // Since props.value can have inconsistent types we'd like to try extract ids from original value.
        this.handleChange(idsList(this.props.value));
    }

    // --------------- Misc ---------------
    preloadSelectedValues() {
        // there's no need to preload sth, it's client's responsibility
        const selectedValues = this.getValuesList();
        if (_.isEmpty(selectedValues))
            return;

        let uri = URI(this.props.data).addSearch({ id__in: selectedValues });

        this.setState({isLoading: true});
        fetch(uri)
            .then(resolveResponse)
            .then(json => this.handleOptionsLoaded('', 1, json))
            .catch((error) => this.props.onNetworkError({type: 'load', error}));
    }

    handleOptionsLoaded(query, page, dataBundle) {
        let data = dataBundle, nextPageNumber = 1;  /* without pagination */

        if (_.isPlainObject(dataBundle)) {  /* with pagination */
            data = dataBundle.results;
            nextPageNumber = dataBundle.next ? extractPageNumber(dataBundle.next) : null;
        }
        const { queryMap } = this.state;

        /* merge newly received data from response with current data */
        const optionsByIdMap = Object.assign(
            this.state.optionsByIdMap,
            _(data).keyBy('id').value()
        );

        const receivedIds = _(data).map('id').flatten().value();
        const selectedIds = _.get(queryMap, `${query}.ids`, []);
        const ids = _(selectedIds).concat(receivedIds).uniq().value();

        /* we should not remove options from current value */
        const idsWithSelectedIds = _(ids).concat(this.props.value).value();

        const options = _(optionsByIdMap).pick(idsWithSelectedIds).values().value();

        queryMap[query] = { ids, page, nextPageNumber, completed: !nextPageNumber };

        this.setState({
            query,
            optionsByIdMap,
            queryMap,
            options,
            isLoading: false,
        });
    }

    getValuesList() {
        const { value } = this.props;
        return idsList(value);
    }

    loadOptions = (query='', page=1, selectedValues=[]) => {
        this.log.debug(`loadOptions(), with query=${query} page=${page} currentValues=${selectedValues}`);

        let uri = URI(this.props.data).addSearch({ q: query, page: page });

        // there's no need to load something again
        const queryOpts = this.state.queryMap[query] || {};
        if (queryOpts.completed) {
            this.log.debug(`loadOptions(), all options for query="${query}" were completely loaded`);

            const ids = _(queryOpts.ids || []).concat(selectedValues).uniq().value();
            this.setState({ options: _(this.state.optionsByIdMap).pick(ids).values().value() });
            return;
        }

        this.setState({ isLoading: true });
        fetch(uri)
            .then(resolveResponse)
            .then(json => this.handleOptionsLoaded(query, page, json))
            .catch((error) => this.props.onNetworkError({type: 'load', error}));
    };

    handleChange = (val) => {
        this.props.onChange(null, {name: this.props.name, value: idsList(val)});
    };

    // --------------- React.js render ---------------
    render() {
        // Since props.value can have inconsistent types we'd like to try extract ids from original value.
        const _value = idsList(this.props.value);

        let _props = {
            clearable: !this.props.required,
            closeOnSelect: true,
            disabled: !this.props.editable,
            multi: this.props.multi || true,
            onChange: this.handleChange,
            placeholder: this.props.placeholder,

            value: _value,
            inputProps: {type: 'react-type'},  // fixes broken semantic markup
            removeSelected: true,

            valueKey: 'id', /* server-side model should provide `id` for object */
            // simpleValue: true,  /* we have no need to store whole objects in parent's state */

            optionComponent: ModelInstanceOption,
            valueComponent: ModelInstanceValue,

            isLoading: this.state.isLoading,

            // rtl: this.state.rtl,

            options: this.state.options,

            //_(this.state.optionsByIdMap).values().value(),

            onFocus: () => {
                this.log.debug('onFocus()');

                const { query } = this.state,
                    page = _.get(this.state.queryMap, `${this.state.query}.page`),
                    selectedValues = this.getValuesList();
                this.loadOptions(query, page, selectedValues);
            },
            onInputChange: (inputValue) => {
                this.log.debug('onInputChange()');
                this.loadOptions(inputValue, undefined, this.getValuesList());
            },
            onMenuScrollToBottom: () => {
                const nextPageNumber = _.get(this.state.queryMap, `${this.state.query}.nextPageNumber`);
                this.log.debug(`onMenuScrollToBottom(), for query="${this.state.query}" ` +
                               `and nextPageNumber=${nextPageNumber}`);

                if (!nextPageNumber) return;
                this.loadOptions(this.state.query, nextPageNumber, this.getValuesList());
            },
        };

        if (_.isFunction(this.props.updateProps)) {
            _props = this.props.updateProps(_props, this.props);
        }

        return <WrappedComponent selectProps={ _props } { ...this.props } />;
    }
};


AsyncManyToManyField.propTypes = propTypes;
function AsyncManyToManyField(props) {
    const fieldProps = _.pickBy(props, (value, key) => key !== 'selectProps');

    // handleChange ...

    return (
        <Form.Field
            required={ props.required }
            disabled={ !props.editable }
            width={ props.layoutOpts.width }
            error={ !_.isEmpty(props.errors) }
        >
            <Label { ...fieldProps } />
            <Select { ...props.selectProps } />
            { !props.helpTextOnHover ? <span className="help-text">{ props.help_text }</span> : '' }
            <MessageList messages={ props.errors } />
        </Form.Field>
    );
}

export default SelectStateEvaluator(AsyncManyToManyField);
