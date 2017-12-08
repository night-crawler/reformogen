import { connect } from 'react-redux';

import _ from 'lodash';

import { fetchMetadata, fetchFormData, submitForm } from './actions';

import FormogenComponent from '../formogen';

import { isMetaDataReady, metaData, formData } from './selectors';
import { getFieldData } from './utils';


const mapStateToProps = (state, props) => {
    return {
        isMetaDataReady: isMetaDataReady(state, props),
        metaData: metaData(state, props),
        formData: formData(state, props),
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const fetchMetaData = () => dispatch(fetchMetadata(props.metaDataUrl));
    const fetchFormData = () => props.objectUrl && dispatch(fetchFormData(props.objectUrl));
    const submit = (url, method, formData) => () => dispatch(submitForm(url, method, formData));

    return {
        submit,
        fetchMetaData,
        fetchFormData,
        dispatch,
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    console.log('');
    // let method = 'POST',
    //     url = ownProps.objectCreateUrl;

    // if (_.get(stateProps.formData, 'id')) {
    //     method = 'PATCH';
    //     url = ownProps.objectUpdateUrl || ownProps.objectUrl ||
    //         _.get(stateProps, 'formData.urls.update') ||
    //         _.get(stateProps, 'formData.urls.edit') ||
    //         _.get(stateProps, 'formData.urls.view', null);
    //     // if (!url) throw new Error('No update url specified');
    // }

    // if (!url) throw new Error('No create url specified');

    return {
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
        submit: dispatchProps.submit(url, method, getFieldData(stateProps))
    };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(FormogenComponent);
