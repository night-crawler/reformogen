import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FormogenFormComponent from '../formogen';


export default class FormogenComponent extends Component {
    static propTypes = {
        actualFormData: PropTypes.object.isRequired,
        description: PropTypes.string,
        fieldErrorsMap: PropTypes.object,
        getFormData: PropTypes.func.isRequired,
        getMetaData: PropTypes.func.isRequired,
        fieldUpdatePropsMap: PropTypes.any,
        fields: PropTypes.array.isRequired,
        handleFieldChanged: PropTypes.func.isRequired,
        helpTextOnHover: PropTypes.bool,
        layoutTemplate: PropTypes.object,

        locale: PropTypes.string,
        nonFieldErrorsMap: PropTypes.object,
        showHeader: PropTypes.bool,
        submit: PropTypes.func,
        title: PropTypes.string,
        upperFirstLabels: PropTypes.bool,
        totalMetaData: PropTypes.object,
        submitUrl: PropTypes.string,

        formFilesUploadProgress: PropTypes.object,
        isLoading: PropTypes.bool,
    };

    componentDidMount() {
        this.props.getMetaData();
        this.props.getFormData();
    }
    componentWillReceiveProps({ isLoading }) {
        if (!isLoading) {
            const { submitUrl } = this.props;

            if (!submitUrl)
                throw new Error('Got an empty submitUrl');
        }
    }

    render() {
        return (
            <FormogenFormComponent
                loading={ this.props.isLoading }

                locale={ this.props.locale }
                showHeader={ this.props.showHeader }
                upperFirstLabels={ this.props.upperFirstLabels }
                helpTextOnHover={ this.props.helpTextOnHover }

                title={ this.props.title }
                description={ this.props.description }
                fields={ this.props.fields }

                formData={ this.props.actualFormData }

                onSubmit={ () => this.props.submit() }

                layoutTemplate={ this.props.layoutTemplate }
                fieldUpdatePropsMap={ this.props.fieldUpdatePropsMap }

                onFieldChange={ this.props.handleFieldChanged }

                errorsFieldMap={ this.props.fieldErrorsMap }
                nonFieldErrorsMap={ this.props.nonFieldErrorsMap }

                formFilesUploadProgress={ this.props.formFilesUploadProgress }

                onNetworkError={ () => {} }
            />
        );
    }
}
