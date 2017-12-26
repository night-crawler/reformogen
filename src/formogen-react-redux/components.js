import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FormogenFormComponent from '../formogen';


export default class FormogenComponent extends Component {
    static propTypes = {
        formogenName: PropTypes.string.isRequired,

        formogenComponentDidMount: PropTypes.func.isRequired,
        formogenComponentWillUnmount: PropTypes.func.isRequired,

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

        showAsModal: PropTypes.bool,
        modalComponent: PropTypes.element,
        modalTriggerComponent: PropTypes.element,
        modalProps: PropTypes.object,

        formComponent: PropTypes.element,
        submitComponent: PropTypes.element,
    };

    componentDidMount() {
        this.props.formogenComponentDidMount(this.props.formogenName);

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
    componentWillUnmount() {
        this.props.formogenComponentWillUnmount(this.props.formogenName);
    }

    render() {
        return (
            <FormogenFormComponent
                /* misc */
                loading={ this.props.isLoading }

                locale={ this.props.locale }
                showHeader={ this.props.showHeader }
                upperFirstLabels={ this.props.upperFirstLabels }
                helpTextOnHover={ this.props.helpTextOnHover }

                /* metadata */
                title={ this.props.title }
                description={ this.props.description }
                fields={ this.props.fields }

                /* formdata */
                formData={ this.props.actualFormData }

                /* errors */
                errorsFieldMap={ this.props.fieldErrorsMap }
                nonFieldErrorsMap={ this.props.nonFieldErrorsMap }

                /* represents file progress */
                formFilesUploadProgress={ this.props.formFilesUploadProgress }

                /* modal opts */
                showAsModal={ this.props.showAsModal }
                modalComponent={ this.props.modalComponent }
                modalTriggerComponent={ this.props.modalTriggerComponent }
                modalProps={ this.props.modalProps }

                /* view redefinition opts */
                formComponent={ this.props.formComponent }
                submitComponent={ this.props.submitComponent }

                layoutTemplate={ this.props.layoutTemplate }
                fieldUpdatePropsMap={ this.props.fieldUpdatePropsMap }

                /* on actions */
                onFieldChange={ this.props.handleFieldChanged }
                onSubmit={ () => this.props.submit() }
            />
        );
    }
}
