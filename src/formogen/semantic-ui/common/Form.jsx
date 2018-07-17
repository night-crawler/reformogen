import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import { Button, Header, Form, Grid } from 'semantic-ui-react';

import NonFieldErrorsList from './NonFieldErrorsList';


FormComponent.displayName = 'Form';
FormComponent.propTypes = {
    loading: PropTypes.bool.isRequired,

    title: PropTypes.string,
    showTitle: PropTypes.bool,

    nonFieldErrorsMap: PropTypes.object,
    formLayout: PropTypes.array.isRequired,

    submitComponent: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.element,
        PropTypes.instanceOf(React.Component)
    ]),
    onSubmit: PropTypes.func,
};
FormComponent.defaultProps = {
    title: 'Formogen Form',
    showTitle: true,
    submitComponent: Button,
};
function FormComponent(props) {
    const { submitComponent: SubmitComponent } = props;
    return (
        <Form loading={ props.loading }>
            {
                props.showTitle
                    ? <Header as='h2' dividing={ true }>{ props.title }</Header>
                    : null
            }
            <div className='layouts'>
                {
                    !_.isEmpty(props.nonFieldErrorsMap) &&
                    <NonFieldErrorsList errors={ props.nonFieldErrorsMap } />
                }
                {
                    props.formLayout.map(({ header, fields }, i) =>
                        <Grid key={ `layout:${i}` } columns={ 16 } className='layout'>
                            {
                                !!header &&
                                <div className='sixteen wide column'>
                                    <Header>{ header }</Header>
                                </div>
                            }
                            { fields }
                        </Grid>
                    )
                }
            </div>
            <SubmitComponent
                type='submit'
                content='Submit'
                fluid={ true }

                onClick={ props.onSubmit }
            />
        </Form>
    );
}

export default FormComponent;
