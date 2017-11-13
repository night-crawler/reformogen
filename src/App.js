import React, { Component } from 'react';

import Formogen from './formogen';

import { Grid } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.css';
import preparedMetaData from './form.json';

const metaDataUrl = 'http://localhost:8000/api/v1/sample/authors/describe/';


class App extends Component {
    handleSubmit(data) {
        console.log(`<App/>, handleSubmit() - ${ data }`);
    }

    render() {
        return (
            <div className="App">


                {/*<div className="App-header">*/}
                {/*<h1>React Formogen JS</h1>*/}
                {/*<img src={ logo } className="App-logo" alt="logo" />*/}
                {/*</div>*/}

                <Grid columns={ 2 } stackable={ true }>
                    <Grid.Row>
                        <Grid.Column>
                            <div className="formogen">
                                <Formogen
                                    metaData={ preparedMetaData }
                                    metaDataUrl={ metaDataUrl }
                                    onSubmit={ data => this.handleSubmit(data) }
                                    upperFirstLabels={ true }
                                />
                            </div>
                        </Grid.Column>

                        <Grid.Column>
                            <div className="formogen">
                                <Formogen
                                    metaDataUrl={ metaDataUrl }
                                    onSubmit={ data => this.handleSubmit(data) }
                                    upperFirstLabels={ true }
                                />
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>


            </div>
        );
    }
}

export default App;
