import loglevel from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

import { Segment } from 'semantic-ui-react';
import React, { Component } from 'react';

import Formogen from './formogen';

import { Grid } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.css';
import preparedMetaData from './form.json';


prefix.apply(loglevel, {template: '[%t] %l (%n)'});

const metaDataUrl = 'http://localhost:8000/api/v1/sample/authors/describe/';



class App extends Component {
    constructor(props) {
        super(props);
        this.log = loglevel.getLogger('App.js');
        this.log.debug('Initialized');
    }

    handleSubmit(data) {
        this.log.debug(`handleSubmit() - ${ data }`);
    }

    render() {
        return (
            <div className="App">

                {/*<div className="App-header">*/}
                {/*<h1>React Formogen JS</h1>*/}
                {/*<img src={ logo } className="App-logo" alt="logo" />*/}
                {/*</div>*/}

                <Grid columns={ 3 } stackable={ true }>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment className="formogen">
                                <Formogen
                                    metaData={ preparedMetaData }
                                    metaDataUrl={ metaDataUrl }
                                    onSubmit={ data => this.handleSubmit(data) }
                                    upperFirstLabels={ true }
                                />
                            </Segment>
                        </Grid.Column>

                        <Grid.Column>
                            <Segment className="formogen">
                                <Formogen
                                    locale='ru'
                                    showHeader={ true }
                                    helpTextOnHover={ true }
                                    metaDataUrl={ metaDataUrl }
                                    onSubmit={ data => this.handleSubmit(data) }
                                    upperFirstLabels={ true }
                                    fieldUpdatePropsMap={ {
                                        dt_birth: (_props, props) => Object.assign({}, _props, {timeIntervals: 5})
                                    } }
                                />
                            </Segment>
                        </Grid.Column>

                        <Grid.Column>
                            <Segment className="formogen">
                                <Formogen
                                    locale='ru'
                                    showHeader={ true }
                                    helpTextOnHover={ true }
                                    metaDataUrl={ 'http://localhost:8000/api/v1/sample/all/describe/' }
                                    onSubmit={ data => this.handleSubmit(data) }
                                    upperFirstLabels={ true }
                                    fieldUpdatePropsMap={ {
                                        dt_birth: (_props, props) => Object.assign({}, _props, {timeIntervals: 5})
                                    } }
                                    layout={ [
                                        {
                                            header: 'Integer Group',
                                            fields: [
                                                ['f_integer', 2], 'f_positive_integer', 'f_small_integer',
                                                'f_positive_small_integer'
                                            ],
                                            width: 8,
                                        },
                                        {
                                            header: 'Other',
                                            fields: '*',
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
