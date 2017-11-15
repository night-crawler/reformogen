import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import propTypes from '../fieldPropTypes';


SUILabel.propTypes = propTypes;
export default function SUILabel(props) {
    const labelText = props.upperFirstLabel ? _.upperFirst(props.verbose_name) : props.verbose_name;
    if (!props.help_text || !props.helpTextOnHover) {
        return <label>{ labelText }</label>;
    }
    return (
        <label>
            <Popup
                trigger={ <Icon name="help" /> }
                content={ props.help_text }
                wide={ true }
                position='bottom left'
            />
            { labelText }
        </label>
    );
}
