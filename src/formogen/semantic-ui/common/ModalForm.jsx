import React from 'react';
import PropTypes from 'prop-types';

import { Button, Header, Modal } from 'semantic-ui-react';


ModalFormComponent.displayName = 'ModalForm';
ModalFormComponent.propTypes = {
    loading: PropTypes.bool,

    title: PropTypes.string,
    showTitle: PropTypes.bool,

    nonFieldErrorsMap: PropTypes.object,
    formLayout: PropTypes.array.isRequired,

    submitCaption: PropTypes.string,
    onSubmit: PropTypes.func,

    triggerComponent: PropTypes.element,
    formComponent: PropTypes.element,
    actionComponent: PropTypes.element,
};
ModalFormComponent.defaultProps = {
    submitCaption: 'Submit',
    triggerComponent: <Button content='Show Form' />,
};
function ModalFormComponent(props) {
    const { formComponent: FormComponent } = props;
    return (
        <Modal trigger={ props.triggerComponent }>
            {
                props.showTitle &&
                <Modal.Header>
                    <Header as='h2'>{ props.title }</Header>
                </Modal.Header>
            }

            <Modal.Content>
                <Modal.Description>

                    <FormComponent
                        loading={ props.loading }
                        nonFieldErrorsMap={ props.nonFieldErrorsMap }
                        showTitle={ false }
                        showSubmit={ false }

                        formLayout={ props.formLayout }
                    />

                </Modal.Description>
            </Modal.Content>

            <Modal.Actions>
                {
                    props.actionComponent
                        ? props.actionComponent
                        : <Button
                            type='submit'
                            content={ props.submitCaption }

                            onClick={ props.onSubmit }
                            onKeyPress={ props.onSubmit }
                        />
                }
            </Modal.Actions>
        </Modal>
    );
}

export default ModalFormComponent;
