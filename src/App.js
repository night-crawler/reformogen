import React, { Component } from 'react';

import fetch from 'isomorphic-fetch';

import _ from 'lodash';

import Formogen from './formogen';

import logo from './logo.svg';
// import mocked_metadata from './form.json';
import './App.css';


const URL = 'http://localhost:8000/api/v1/sample/authors/describe/';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            metaData: null
        };
    }
    componentWillMount() {
        this.getMetadata();
    }

    handleSubmit(data) {
        console.log(this);
        console.log(data);
    }

    receiveData(data) {
        window.metaData = data;
        this.setState({ metaData: data });
    }

    getMetadata() {
        fetch(URL).then(response => response.json()).then(json => this.receiveData(json))
    }

    render() {
        if (_.isEmpty(this.state.metaData)) {
            return <div/>
        }

        const data = {};
        const { metaData } = this.state;

        return (
            <div className="App">

                <div className="App-header">
                    <img src={ logo } className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>

                <div className="App-intro">
                    <Formogen
                        metaData={ metaData }
                        data={ data }
                        onSubmit={ (validatedData) => this.handleSubmit(validatedData) }
                    />
                </div>

            </div>
        );
    }
}

export default App;
