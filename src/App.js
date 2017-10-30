import React, { Component } from 'react';


import logo from './logo.svg';
import './App.css';

import static_metadata from './form.json';

import Formogen from './formogen';


const URL = 'http://localhost:8000/api/v1/sample/authors/describe/';

class App extends Component {
    handleSubmit(data) {
        console.log(this);
        console.log(data);
    }

    render() {
        return (
            <div className="App">

                <div className="App-header">
                    <img src={ logo } className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>

                <div className="App-intro">
                    <Formogen
                        metaData={ static_metadata }
                        metaDataUrl={ URL }
                        onSubmit={ (validatedData) => this.handleSubmit(validatedData) }
                    />
                </div>

            </div>
        );
    }
}

export default App;
