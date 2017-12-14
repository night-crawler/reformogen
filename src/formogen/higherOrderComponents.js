import React from 'react';

import loglevel from 'loglevel';

import _ from 'lodash';

import * as URI from 'urijs';

import { resolveResponse, getDisplayName, idsList, extractPageNumber } from './utils';
import propTypes from './components/fieldPropTypes';
import ModelInstanceOption from './components/ReactSelectOptionComponent';
import ModelInstanceValue from './components/ReactSelectValueComponent';


export default function ({ WrappedComponent, multi = true }) {
    class WithSelectState extends React.Component {
        static propTypes = propTypes;
        static id = new Date().getTime();

        // --------------- constructor ---------------
        constructor(props) {
            super(props);

            this.log = loglevel.getLogger(`${WithSelectState.displayName} id=${WithSelectState.id}`);
            this.log.debug('Initialized');

            // TODO: fetch it from props
            const valueKey = 'id';

            // TODO: user can assign custom values as a React-Select's valueKey
            const keysList = idsList(props.value);
            let optionsByKeyMap = {};

            if (!_.isEmpty(keysList)) {
                if (multi && _.isPlainObject(props.value[0])) {
                    optionsByKeyMap = _.keyBy(props.value, valueKey);
                }
                if (!multi && _.isPlainObject(props.value)) {
                    const key = props.value[valueKey];
                    optionsByKeyMap = { [key]: props.value };
                }
            }

            this.log.debug('WE GOT optionsByKeyMap', optionsByKeyMap);
            this.log.debug('WE GOT keysList', keysList);
            this.log.debug('WE GOT options', _(optionsByKeyMap).values().value());


            this.state = {
                isLoading: false,
                options: _(optionsByKeyMap).values().value(),

                valueKey,

                optionsByKeyMap,
                query: '',
                queryMap: {
                    '': {
                        keysList: keysList,
                        page: 1,
                        completed: false,
                    }
                },
            };

        }
        // --------------- Misc ---------------
        handleOptionsLoaded(query, page, dataBundle) {
            /* without pagination */
            let data = dataBundle, nextPageNumber = 1;

            if (_.isPlainObject(dataBundle)) {
                /* with pagination */
                data = dataBundle.results;
                nextPageNumber = dataBundle.next ? extractPageNumber(dataBundle.next) : null;
            }
            const { valueKey, queryMap, optionsByKeyMap } = this.state;

            /* merge newly received data from response with current data */
            const currentOptionsByKeyMap = Object.assign({}, optionsByKeyMap, _(data).keyBy(valueKey).value());

            const receivedKeys = _(data).map(valueKey).flatten().value();
            const selectedKeys = _.get(queryMap, `${query}.keysList`, []);
            const keysList = _(selectedKeys).concat(receivedKeys).uniq().value();

            /* we should not remove options from current value */
            // this.log.debug('pre handleOptionsLoaded(), keysList', keysList);
            // this.log.debug('pre handleOptionsLoaded(), getValueKeyList', this.getValueKeyList());
            const keysWithSelectedKeys = _(keysList).concat(this.getValueKeyList()).value();
            // this.log.debug('pre handleOptionsLoaded(), keysWithSelectedKeys', keysWithSelectedKeys);

            const options = _(currentOptionsByKeyMap).pick(keysWithSelectedKeys).values().value();

            queryMap[query] = { keysList, page, nextPageNumber, completed: !nextPageNumber };

            this.log.debug('handleOptionsLoaded(), options', options);

            this.setState({
                isLoading: false,
                options,

                optionsByKeyMap: currentOptionsByKeyMap,
                query,
                queryMap,
            });
        }

        getValueKeyList() {
            const valueKeyList = idsList(this.props.value);  // TODO: user can assign custom values as a React-Select's valueKey
            this.log.debug('getValueKeyList(), value=', this.props.value, 'valueKeyList=', valueKeyList);

            return valueKeyList;
        }

        loadOptions = (query = '', page = 1, selectedValues = []) => {
            this.log.debug(`loadOptions(), with query="${query}" page=${page} currentValues=${selectedValues}`);

            let uri = URI(this.props.data).addSearch({ q: query, page: page });

            // there's no need to load something again
            const queryOpts = this.state.queryMap[query] || {};
            if (queryOpts.completed) {
                this.log.debug(`loadOptions(), all options for query="${query}" were completely loaded`);

                const keysList = _(queryOpts.keysList || []).concat(selectedValues).uniq().value();
                const options = _(this.state.optionsByKeyMap).pick(keysList).values().value();

                this.setState({ options });
                return;
            }

            this.setState({ isLoading: true });

            fetch(uri)
                .then(resolveResponse)
                .then(json => this.handleOptionsLoaded(query, page, json))
                .catch((error) => this.props.onNetworkError({ type: 'load', error }));
        };

        handleChange = (val) => {
            // TODO: user can assign custom values as a React-Select's valueKey
            const value = multi ? idsList(val) : _.get(val, this.state.valueKey, null);
            this.log.debug(`handleChange(), name="${this.props.name}", value=`, value);

            this.props.onChange(null, { name: this.props.name, value: value });
        };

        // --------------- React.js render ---------------
        render() {
            let selectProps = {
                /* TODO: add a comment */
                clearable: !this.props.required,
                closeOnSelect: true,
                disabled: !this.props.editable,
                placeholder: this.props.placeholder,

                /* TODO: add a comment */
                multi: multi,

                /* TODO: add a comment */
                value: this.props.value,

                /* fixes broken semantic markup */
                inputProps: { type: 'react-type' },

                /* TODO: add a comment */
                removeSelected: true,

                /* server-side model should provide `id` for object */
                valueKey: this.state.valueKey,

                /* we have no need to store whole objects in parent's state */
                // simpleValue: true,

                /* TODO: add a comment */
                searchable: true,

                /* TODO: add a comment */
                optionComponent: ModelInstanceOption,
                valueComponent: ModelInstanceValue,

                /* TODO: add a comment */
                isLoading: this.state.isLoading,

                /* TODO: add a comment */
                /* server-side filtering */
                filterOption: () => true,

                /* TODO: add a comment */
                // rtl: this.state.rtl,

                /* TODO: add a comment */
                options: this.state.options,

                /* TODO: add a comment */
                onChange: this.handleChange,
                onFocus: () => {
                    this.log.debug('onFocus()');
                    const { query, queryMap } = this.state;

                    this.loadOptions(query, _.get(queryMap, `${query}.page`), this.getValueKeyList());
                },
                onInputChange: (inputValue) => {
                    this.log.debug(`onInputChange(), inputValue="${inputValue}"`);
                    this.loadOptions(inputValue, undefined, this.getValueKeyList());
                },
                onMenuScrollToBottom: () => {
                    const nextPageNumber = _.get(this.state.queryMap, `${this.state.query}.nextPageNumber`);
                    this.log.debug(`onMenuScrollToBottom(), for query="${this.state.query}" ` +
                        `and nextPageNumber=${nextPageNumber}`);

                    if (!nextPageNumber) return;
                    this.loadOptions(this.state.query, nextPageNumber, this.getValueKeyList());
                },
            };

            if (_.isFunction(this.props.updateProps)) {
                selectProps = this.props.updateProps(selectProps, this.props);
            }

            return <WrappedComponent selectProps={ selectProps } { ...this.props } />;
        }
    }

    WithSelectState.displayName = `WithSelectState(${getDisplayName(WrappedComponent)})`;
    return WithSelectState;
}
