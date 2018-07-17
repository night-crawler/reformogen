import React, { Component } from 'react';
import PropTypes from 'prop-types';

import loglevel from 'loglevel';

import FormogenFormComponent from '../formogen';


export default class FormogenComponent extends Component {
    static propTypes = {
        formId: PropTypes.string.isRequired,

        componentDidMount: PropTypes.func.isRequired,
        componentWillUnmount: PropTypes.func.isRequired,

        actualFormData: PropTypes.object.isRequired,
        fieldErrorsMap: PropTypes.object,

        getFormData: PropTypes.func.isRequired,
        getMetaData: PropTypes.func.isRequired,

        title: PropTypes.string,
        description: PropTypes.string,
        fields: PropTypes.array.isRequired,

        fieldUpdatePropsMap: PropTypes.any,
        handleFieldChanged: PropTypes.func.isRequired,
        helpTextOnHover: PropTypes.bool,
        layoutTemplate: PropTypes.object,

        locale: PropTypes.string,
        nonFieldErrorsMap: PropTypes.object,
        showHeader: PropTypes.bool,
        submit: PropTypes.func,
        upperFirstLabels: PropTypes.bool,
        totalMetaData: PropTypes.object,
        submitUrl: PropTypes.string,

        formFilesUploadProgress: PropTypes.object,
        isLoading: PropTypes.bool,

        showAsModal: PropTypes.bool,
        modalComponent: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.element,
            PropTypes.instanceOf(React.Component)
        ]),
        modalTriggerComponent: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.element,
            PropTypes.instanceOf(React.Component)
        ]),
        modalProps: PropTypes.object,

        formComponent: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.element,
            PropTypes.instanceOf(React.Component)
        ]),
        submitComponent: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.element,
            PropTypes.instanceOf(React.Component)
        ]),
    };
    static defaultProps = {
        fields: [],

        formFilesUploadProgress: {},
        fieldErrorsMap: {},
    };

    constructor(props) {
        super(props);

        this.logger = loglevel.getLogger(`FormogenReduxComponent[${props.formId}]`);
        this.logger.debug('Initialized');
    }

    componentDidMount() {
        this.props.componentDidMount();
        this.props.getMetaData();
        this.props.getFormData();
    }
    componentWillReceiveProps({ isLoading }) {
        this.logger.debug('componentWillReceiveProps()');

        if (isLoading) return;

        if (!this.props.submitUrl)
            throw new Error('Got an empty submitUrl');
    }
    componentWillUnmount() {
        this.props.componentWillUnmount();
    }
    render() {
        this.logger.debug('render()');
        return (
            <FormogenFormComponent
                /* unique form id */
                formId={ this.props.formId }

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
