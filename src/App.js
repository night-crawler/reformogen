import loglevel from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

import { Segment } from 'semantic-ui-react';
import React, { Component } from 'react';

import Formogen from './formogen';

import { Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.css';
import preparedMetaData from './form.json';

// TODO: it should be in formogen module
prefix.apply(loglevel, {template: '[%t] %l (%n)'});


class App extends Component {
    constructor(props) {
        super(props);

        this.log = loglevel.getLogger('App.js');
        this.log.debug('initialized');
    }

    handleSubmit(data) {
        this.log.debug(`handleSubmit() - ${ data }`);
    }

    render() {
        return (
            <div className='App'>

                <Grid columns={ 3 } stackable={ true }>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment className='formogen'>
                                <Formogen
                                    upperFirstLabels={ true }

                                    metaData={ preparedMetaData }
                                    metaDataUrl={ 'http://localhost:8000/api/v1/sample/authors/describe/' }
                                    objectCreateUrl={ 'http://localhost:8000/api/v1/sample/authors/' }
                                />
                            </Segment>
                        </Grid.Column>

                        <Grid.Column>
                            <Segment className='formogen'>
                                <Formogen
                                    locale={ 'ru' }
                                    showHeader={ true }
                                    helpTextOnHover={ true }
                                    upperFirstLabels={ true }

                                    metaDataUrl={ 'http://localhost:8000/api/v1/sample/authors/describe/' }
                                    objectCreateUrl={ 'http://localhost:8000/api/v1/sample/authors/' }

                                    fieldUpdatePropsMap={ {
                                        dt_birth: (_props, props) => Object.assign({}, _props, {timeIntervals: 5})
                                    } }
                                />
                            </Segment>
                        </Grid.Column>

                        <Grid.Column>
                            <Segment className='formogen'>
                                <Formogen
                                    locale={ 'ru' }
                                    showHeader={ true }
                                    helpTextOnHover={ true }
                                    upperFirstLabels={ true }

                                    metaDataUrl={ 'http://localhost:8000/api/v1/sample/all/describe/' }
                                    objectCreateUrl={ 'http://localhost:8000/api/v1/sample/all/' }

                                    fieldUpdatePropsMap={ {
                                        dt_birth: (_props, props) => Object.assign({}, _props, {timeIntervals: 5})
                                    } }
                                    layout={ [
                                        {
                                            header: 'Integer Group',
                                            fields: [
                                                {f_integer: {width: 8}},
                                                {f_positive_integer: {width: 8}},
                                                'f_small_integer',
                                                'f_positive_small_integer'
                                            ],
                                            width: 8,
                                        },
                                        {
                                            header: 'Float group',
                                            fields: [
                                                {f_decimal: {width: 4}},
                                                {f_float: {width: 12}},
                                            ]
                                        },
                                        {
                                            header: 'Dates',
                                            fields: [
                                                {f_date: {width: 8}},
                                                {f_time: {width: 8}},
                                                {f_dt: {width: 16}},
                                            ]
                                        },
                                        {
                                            header: 'Relations',
                                            fields: [
                                                {f_fk_embed: {width: 8}},
                                                {f_fk_rel: {width: 8}},
                                                {f_m2m_embed: {width: 8}},
                                                {f_m2m_rel: {width: 8}},
                                                {f_choice: {width: 16}},
                                            ]
                                        },
                                        {
                                            header: 'Files',
                                            fields: [
                                                {f_file: {width: 8}},
                                                {f_photo: {width: 8}}
                                            ]
                                        },
                                        {
                                            header: 'Other',
                                            fields: '*',
                                            width: 16,
                                        }
                                    ] }
                                />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            </div>
        );
    }
}

export default App;
