import React, { Component } from 'react';

import Formogen from './formogen';

import './App.css';
import logo from './logo.svg';
import preparedMetaData from './form.json';

const metaDataUrl = 'http://localhost:8000/api/v1/sample/authors/describe/';


class App extends Component {
    handleSubmit(data) {
        console.log(`<App/>, handleSubmit() - ${ data }`);
    }

    render() {
        return <div className="App">

            <div className="App-header">
                <h1>React Formogen JS</h1>
                <img src={ logo } className="App-logo" alt="logo" />
            </div>

            <div className="App-content">
                <div className="formogen">
                    <Formogen
                        metaData={ preparedMetaData }
                        metaDataUrl={ metaDataUrl }
                        onSubmit={ data => this.handleSubmit(data) }
                    />
                </div>
            </div>

        </div>;
    }
}

export default App;
