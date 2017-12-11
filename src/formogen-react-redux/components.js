import React from 'react';
import PropTypes from 'prop-types';

import FormogenFormComponent from '../formogen/components/semantic-ui';


export default class FormogenReactReduxComponent extends React.Component {
    static propTypes = {
        description: PropTypes.string,
        fetchFormData: PropTypes.func.isRequired,
        fetchMetaData: PropTypes.func.isRequired,
        fieldUpdatePropsMap: PropTypes.any,
        fields: PropTypes.array.isRequired,
        handleFieldChanged: PropTypes.func.isRequired,
        helpTextOnHover: PropTypes.bool,
        isMetaDataReady: PropTypes.bool,
        layoutTemplate: PropTypes.object,
        locale: PropTypes.string,
        actualFormData: PropTypes.object.isRequired,
        showHeader: PropTypes.bool,
        submit: PropTypes.func,
        title: PropTypes.string,
        upperFirstLabels: PropTypes.bool,
        totalMetaData: PropTypes.object
    };

    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.fetchMetaData();
        this.props.fetchFormData();
    }

    render() {
        return (
            <FormogenFormComponent
                loading={ !this.props.isMetaDataReady }

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

                onFieldChange={ (...args) => this.props.handleFieldChanged(...args) }


                // TODO:
                errorsFieldMap={ {} }
                nonFieldErrorsMap={ {} }

                onNetworkError={ () => {} }
            />
        );
    }
}
