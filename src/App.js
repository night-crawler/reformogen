import './formogen/components/semantic-ui/styles';
import 'moment/locale/ru';

import loglevel from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

import { Segment } from 'semantic-ui-react';
import React, { Component } from 'react';

import Formogen from './formogen-react-redux';

import { Button, Form, Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.css';
import preparedMetaData from './form.json';

import './App.css';


// TODO: it should be in formogen module
window.loglevel = loglevel;
prefix.apply(loglevel, { template: '[%t] %l (%n)' });


function FormComponent(props) {
    // it's here as an example of formogen form redefinition via props
    const _props = {
        ...props,
    };
    return <Form { ..._props } />;
}

function SubmitComponent(props) {
    // it's here as an example of formogen submit redefinition via props
    const _props = {
        ...props,
        primary: true,
        content: 'Primary',
        fluid: false,
    };
    return <Button { ..._props } />;
}


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
        const prepopulatedFormData = {
            assigned_test_field: 'hahahah!',

            name: 'Mr. Inconspicuous',
            // dt_birth: new Date(),
            // dt_death: new Date(),
            state: 30,
            vasya: 42,
        };

        // TODO: add lazy evaluation for modal mode
        // TODO: add X (cancel) to modal window
        // TODO: check undefined metaDataUrl
        return (
            <div className='App'>
                <Grid columns={ 3 } stackable={ true }>
                    <Grid.Column>
                        <Segment className='formogen'>


                            <Formogen
                                locale={ 'ru' }
                                showHeader={ true }
                                title={ 'default formId aka "default"' }

                                /* author photo form */
                                metaDataUrl={ 'http://localhost:8000/api/v1/sample/author-photos/describe/' }
                                objectCreateUrl={ 'http://localhost:8000/api/v1/sample/author-photos/' }
                                objectUrl={ 'http://localhost:8000/api/v1/sample/author-photos/1/' }

                                /* author form */
                                // metaDataUrl={ 'http://localhost:8000/api/v1/sample/authors/describe/' }
                                // objectCreateUrl={ 'http://localhost:8000/api/v1/sample/authors/' }
                                // objectUrl={ 'http://localhost:8000/api/v1/sample/authors/23/' }

                                /* misc */
                                sendFileQueueLength={ 3 }

                                /* modal opts */
                                // showAsModal={ true }
                                // modalComponent={ null }
                                // modalTriggerComponent={ <Button>Rise up evil!</Button> }
                                // modalProps={ { dimmer: 'blurring' } }

                                // formComponent={ FormComponent }
                                // submitComponent={ SubmitComponent }
                            />


                        </Segment>
                    </Grid.Column>


                    <Grid.Column>
                        <Segment className='formogen'>

                            <Formogen
                                formId='formogen-1'

                                locale={ 'ru' }
                                showHeader={ true }
                                title={ 'formId = "formogen-1"' }

                                /* author photo form */
                                // metaDataUrl={ 'http://localhost:8000/api/v1/sample/author-photos/describe/' }
                                // objectCreateUrl={ 'http://localhost:8000/api/v1/sample/author-photos/' }
                                // objectUrl={ 'http://localhost:8000/api/v1/sample/author-photos/100/' }

                                /* author form */
                                metaDataUrl={ 'http://localhost:8000/api/v1/sample/authors/describe/' }
                                objectCreateUrl={ 'http://localhost:8000/api/v1/sample/authors/' }
                                objectUrl={ 'http://localhost:8000/api/v1/sample/authors/1/' }

                                /* misc */
                                sendFileQueueLength={ 3 }

                                /* modal opts */
                                // showAsModal={ true }
                                // modalComponent={ null }
                                // modalTriggerComponent={ <Button>Rise up evil!</Button> }
                                // modalProps={ { dimmer: 'blurring' } }

                                // formComponent={ FormComponent }
                                // submitComponent={ SubmitComponent }
                            />


                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default App;
