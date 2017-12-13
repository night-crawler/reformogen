import loglevel from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

import { Segment } from 'semantic-ui-react';
import React, { Component } from 'react';

import Formogen from './formogen-react-redux';

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
            // canRenderAuthorPhotosForms: false,
            // authorPhotosMetaDataUrl: null,

            authorPhotosMetaDataUrl: 'http://localhost:8000/api/v1/sample/author-photos/describe/',
            authorPhotosWithoutAuthorMetaDataUrl: 'http://localhost:8000/api/v1/sample/author-photos/describe_without_author/',
            authorPhotosCreateUrl: 'http://localhost:8000/api/v1/sample/author-photos/',
            canRenderAuthorPhotosForms: true,
            // authorId: formData.id,
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
                    <Grid.Column>
                        <Segment className='formogen'>
                            <Formogen
                                locale={ 'ru' }
                                showHeader={ true }

                                metaDataUrl={ 'http://localhost:8000/api/v1/sample/author-photos/describe/' }
                                objectUrl={ 'http://localhost:8000/api/v1/sample/author-photos/1/' }
                            />
                        </Segment>
                    </Grid.Column>
                </Grid>

            </div>
        );
    }
}

export default App;
