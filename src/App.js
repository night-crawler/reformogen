import loglevel from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

import { Segment } from 'semantic-ui-react';
import React, { Component } from 'react';

import FormogenReduxContainer from './formogen-react-redux';

import { Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.css';
import preparedMetaData from './form.json';

// TODO: it should be in formogen module
window.loglevel = loglevel;
prefix.apply(loglevel, { template: '[%t] %l (%n)' });


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
            assigned_test_field: 'hahahah!',

            name: 'Mr. Inconspicuous',
            // dt_birth: new Date(),
            // dt_death: new Date(),
            state: 30,
            vasya: 42,
        };

        let trash = null;

        return (
            <div className='App'>

                <Grid columns={ 3 } stackable={ true }>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment className='formogen'>
                                <FormogenReduxContainer
                                    locale={ 'ru' }
                                    showHeader={ true }
                                    helpTextOnHover={ true }
                                    upperFirstLabels={ true }

                                    initialMetaData={ preparedMetaData }
                                    initialFormData={ prepopulatedFormData }

                                    metaDataUrl={ metaDataUrl }
                                    objectUrl={ objectUrl }
                                    objectUpdateUrl={ objectUrl }
                                    objectCreateUrl={ objectCreateUrl }

                                    onFetchComplete={ this.handleAuthorEditFormLoaded }

                                    // layoutTemplate={ [
                                    //     {
                                    //         header: 'Integer Group',
                                    //         fields: [
                                    //             { name: { width: 8 } },
                                    //             { assigned_test_field: { width: 8 } },
                                    //             'is_ghostwriter',
                                    //         ],
                                    //         width: 8,
                                    //     },
                                    //     {
                                    //         header: 'rest',
                                    //         fields: '*',
                                    //         width: 8,
                                    //     }
                                    // ] }
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
