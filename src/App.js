import loglevel from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

import { Segment } from 'semantic-ui-react';
import React, { Component } from 'react';

import Formogen from './formogen';

import { Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.css';
import preparedMetaData from './form.json';

// TODO: it should be in formogen module
window.loglevel = loglevel;
prefix.apply(loglevel, {template: '[%t] %l (%n)'});


class App extends Component {
    constructor(props) {
        super(props);

        this.log = loglevel.getLogger('App.js');
        this.log.debug('initialized');

        this.state = {
            canRenderAuthorPhotosForms: false,
            authorPhotosMetaDataUrl: null,
        };
    }

    _render() {
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

                                    formData={ {name: 'That is prepopulated field!'} }

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
                                    layoutTemplate={ [
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

    handleAuthorEditFormLoaded = (metaData, formData) => {
        if (!formData.id)
            return;

        this.setState({
            authorPhotosMetaDataUrl: 'http://localhost:8000/api/v1/sample/author-photos/describe/',
            authorPhotosWithoutAuthorMetaDataUrl: 'http://localhost:8000/api/v1/sample/author-photos/describe_without_author/',
            authorPhotosCreateUrl: 'http://localhost:8000/api/v1/sample/author-photos/',
            canRenderAuthorPhotosForms: true,
            authorId: formData.id,

        });
    };

    render() {
        const metaDataUrl = 'http://localhost:8000/api/v1/sample/authors/describe/';
        const objectUrl = 'http://localhost:8000/api/v1/sample/authors/23/';
        const objectCreateUrl = 'http://localhost:8000/api/v1/sample/authors/';

        const prepopulatedFormData = {
            name: 'Mr. Inconspicuous',
            dt_birth: new Date(),
            dt_death: new Date(),
            state: 30,
        };

        let trash = null;

        return (
            <div className='App'>

                <Grid columns={ 3 } stackable={ true }>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment className='formogen'>
                                <Formogen
                                    locale={ 'ru' }
                                    showHeader={ true }
                                    helpTextOnHover={ true }
                                    upperFirstLabels={ true }

                                    formData={ prepopulatedFormData }

                                    metaDataUrl={ metaDataUrl }
                                    objectUrl={ objectUrl }

                                    onFetchComplete={ this.handleAuthorEditFormLoaded }
                                />
                            </Segment>
                        </Grid.Column>

                        { this.state.canRenderAuthorPhotosForms && (
                            <Grid.Column>
                                <Segment className='formogen'>
                                    <Formogen
                                        locale={ 'ru' }
                                        showHeader={ true }
                                        metaDataUrl={ this.state.authorPhotosMetaDataUrl }
                                        objectCreateUrl={ this.state.authorPhotosCreateUrl }
                                        formData={ {
                                            author: this.state.authorId,
                                        } }
                                    />
                                </Segment>
                            </Grid.Column>
                        ) }

                        { this.state.canRenderAuthorPhotosForms && (
                            <Grid.Column>
                                <Segment className='formogen'>
                                    <Formogen
                                        locale={ 'ru' }
                                        showHeader={ true }
                                        metaDataUrl={ this.state.authorPhotosWithoutAuthorMetaDataUrl }
                                        objectCreateUrl={ this.state.authorPhotosCreateUrl }

                                        pipePreSubmit={ (data) => Object.assign(data, {author: this.state.authorId}) }
                                    />
                                </Segment>
                            </Grid.Column>
                        ) }


                    </Grid.Row>
                </Grid>

            </div>
        );
    }
}

export default App;
