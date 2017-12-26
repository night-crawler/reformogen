import React from 'react';
import PropTypes from 'prop-types';

import { Modal as SUIModal } from 'semantic-ui-react';


Modal.propTypes = {
    trigger: PropTypes.element.isRequired,
    actions: PropTypes.element.isRequired,
    children: PropTypes.element.isRequired,
    header: PropTypes.element,
    modalProps: PropTypes.object,
};
export default function Modal({ trigger, actions, children, header, modalProps = {} }) {
    return (
        <SUIModal trigger={ trigger } { ...modalProps }>
            { header && <SUIModal.Header>{ header }</SUIModal.Header> }
            <SUIModal.Content>
                <SUIModal.Description>
                    { children }
                </SUIModal.Description>
            </SUIModal.Content>
            <SUIModal.Actions>
                { actions }
            </SUIModal.Actions>
        </SUIModal>
    );
}
