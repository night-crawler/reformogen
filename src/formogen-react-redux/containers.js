import React  from 'react';

import { connect } from 'react-redux';

import { fetchMetadata, fetchFormData, submitForm } from './actions';

import FormogenFormComponent from '../formogen/components/semantic-ui';

import { createStructuredSelector } from 'reselect';
import {
    isFormDataReady, isMetaDataReady,
    metaData, formData,
    submitUrl, submitMethod,

    changedFormData,
} from './selectors';

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchMetaData: () => props.objectUrl && dispatch(fetchFormData(props.objectUrl)),
        fetchFormData: () => dispatch(fetchMetadata(props.metaDataUrl)),
        dispatch,
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { dispatch } = dispatchProps;

    return {
        ...ownProps,
        ...stateProps,
        ...dispatchProps,

        // stateProps.formData, stateProps.changedFormData
        submit: () => {
            console.log('formData', ownProps.formData);
            console.log('receivedFormData', stateProps.formData);
            console.log('changedFormData', stateProps.changedFormData);
            dispatch(submitForm(stateProps.submitUrl, stateProps.submitMethod, stateProps.changedFormData));
        }
    };
};

class FormogenReactReduxComponent extends React.Component {  // ACTUALLY WRAPPER
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        // только этот компонент должен что-либо знать о получении данных
        this.props.fetchMetaData();
        this.props.fetchFormData();
    }
    handleFieldChange = (event, { name, value }) => {
        this.log.debug(`handleFieldChange(): setting formData field "${ name }" to ${ typeof value }`, value);


        this.setState(currentState => {
            return { formData: Object.assign({}, currentState.formData, { [name]: value }) };
        });
    };
    render() {
        // бедненький тупой формаген ничего не знает о получении данных (никаких fetch методов он не вызывает)
        return (
            <FormogenFormComponent
                loading={ !this.props.isMetaDataReady }
                fields={ this.props.metaData.fields }
                title={ this.props.metaData.title }

                formData={ this.props.formData }

                onSubmit={ () => this.props.submit() }

                locale={ this.props.locale }
                showHeader={ this.props.showHeader }
                upperFirstLabels={ this.props.upperFirstLabels }
                helpTextOnHover={ this.props.helpTextOnHover }


                layoutTemplate={ this.props.layoutTemplate }

                errorsFieldMap={ {} }
                nonFieldErrorsMap={ {} }

                fieldUpdatePropsMap={ this.props.fieldUpdatePropsMap }

                // callbacks
                onFieldChange={ () => {} }
                onNetworkError={ () => {} }
            />
        );
    }
}

export default connect(
    createStructuredSelector({
        isFormDataReady, isMetaDataReady,
        metaData, formData,
        submitUrl, submitMethod,

        changedFormData,
    }),
    mapDispatchToProps,
    mergeProps
)(FormogenReactReduxComponent);
