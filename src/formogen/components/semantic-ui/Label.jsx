import React from 'react';
import { Popup } from 'semantic-ui-react';
import _ from 'lodash';
import propTypes from '../fieldPropTypes';


SUILabel.propTypes = propTypes;
export default function SUILabel(props) {
    const labelText = props.upperFirstLabel ? _.upperFirst(props.verbose_name) : props.verbose_name;
    if (!props.help_text || !props.helpTextOnHover) {
        return <label>{ labelText }</label>;
    }
    /* replaced trigger's <Icon name="help" /> with <i> to prevent react warning:
     * Warning: Stateless function components cannot be given refs. Attempts to access this ref will fail.
     */
    return (
        <label>
            <Popup
                trigger={ <i className="icon help" /> }

                content={ props.help_text }
                wide={ true }
                position='bottom left'
            />
            { labelText }
        </label>
    );
}
