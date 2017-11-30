import React, {Component} from 'react';
import _ from 'lodash';
import * as URI from 'urijs';
import {Form} from 'semantic-ui-react';
import Select from 'react-select';
import propTypes from '../fieldPropTypes';
import Label from './Label';
import {MessageList} from './MiscComponents';
import ModelInstanceOption from './ReactSelectOptionComponent';
import ModelInstanceValue from './ReactSelectValueComponent';

import {resolveResponse} from '../../utils';
import loglevel from 'loglevel';


function extractPageNumber(uri) {
    const query = new URI(uri).query(true);
    return query.page || query.p || query.page_num;
}


export default class AsyncManyToManyField extends Component {
    static propTypes = propTypes;

    constructor(props) {
        super(props);

        this.log = loglevel.getLogger('AsyncManyToManyField');
        this.log.debug('Initialized');

        this.state = {
            query: '',
            queryMap: {
                '': {
                    ids: new Set(),
                    page: 1,
                    completed: false,
                }
            },
            optionsByIdMap: {},  /* {id: {id: 12, name: 123}} */
            options: [],
            isLoading: false,
        };
    }

    componentWillMount() {
        this.loadOptions(this.state.query);
    }

    preloadSelectedValues() { /* todo */ }

    handleOptionsLoaded(query, page, dataBundle) {
        let data = dataBundle, nextPageNumber=1;  /* without pagination */

        if (_.isObject(dataBundle)) {  /* with pagination */
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
        const currentIds = _.get(queryMap, `${query}.ids`, []);
        const ids = _(currentIds).concat(receivedIds).uniq().value();

        /* we should not remove options from current value */
        const idsWithCurrentValue = _(ids).concat(this.props.value).value();

        const options = _(optionsByIdMap).pick(idsWithCurrentValue).values().value();

        queryMap[query] = { ids, page, nextPageNumber, completed: !nextPageNumber };

        this.setState({
            query,
            optionsByIdMap,
            queryMap,
            options,
            isLoading: false,
        });
    }

    loadOptions = (query='', page=1) => {
        let uri = URI(this.props.data).addSearch({ q: query, page: page });

        // ==== there's no need to load something again
        const queryOpts = this.state.queryMap[query] || {};
        if (queryOpts.completed) {
            const ids = _(queryOpts.ids || []).concat(this.props.value).uniq().value();
            this.setState({ options: _(this.state.optionsByIdMap).pick(ids).values().value() });
            return;
        }
        // === /
        this.setState({isLoading: true});
        fetch(uri)
            .then(resolveResponse)
            .then(json => this.handleOptionsLoaded(query, page, json))
            .catch((error) => this.props.onNetworkError({type: 'load', error}));
    };
    
    handleChange = (val) => {
        let plainIds = val.map(({id}) => (id * 1));
        this.props.onChange(null, {name: this.props.name, value: plainIds});
    };

    render() {

        let _props = {
            clearable: !this.props.required,
            closeOnSelect: true,
            disabled: !this.props.editable,
            multi: true,
            onChange: this.handleChange,
            placeholder: this.props.placeholder,

            value: this.props.value,
            inputProps: {type: 'react-type'},  // fixes broken semantic markup
            removeSelected: true,

            valueKey: 'id', /* server-side model should provide `id` for object */
            // simpleValue: true,  /* we have no need to store whole objects in parent's state */

            optionComponent: ModelInstanceOption,
            valueComponent: ModelInstanceValue,

            isLoading: this.state.isLoading,

            // rtl: this.state.rtl,

            onInputChange: (inputValue) => this.loadOptions(inputValue),
            onMenuScrollToBottom: () => {
                const nextPageNumber = _.get(this.state.queryMap, `${this.state.query}.nextPageNumber`);
                this.log.debug('onMenuScrollToBottom()', this.state.query, nextPageNumber);
                if (!nextPageNumber)
                    return;
                this.loadOptions(this.state.query, nextPageNumber);
            },
            options: this.state.options,
            //_(this.state.optionsByIdMap).values().value(),
        };

        if (_.isFunction(this.props.updateProps)) {
            _props = this.props.updateProps(_props, this.props);
        }

        return (
            <Form.Field
                required={ this.props.required }
                disabled={ !this.props.editable }
                width={ this.props.layoutOpts.width }
                error={ !_.isEmpty(this.props.errors) }
            >
                <Label { ...this.props } />
                <Select { ..._props } />
                {!this.props.helpTextOnHover ? <span className="help-text">{this.props.help_text}</span> : ''}
                <MessageList messages={ this.props.errors } />
            </Form.Field>
        );
    }

}
