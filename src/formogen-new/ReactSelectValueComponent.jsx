import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class ReactSelectValueComponent extends Component {
    static propTypes = {
        children: PropTypes.node,
        placeholder: PropTypes.string,
        value: PropTypes.object
    };

    render() {
        let value = this.props.value, title = value.printable_name || value.name || value.title;
        return (
            <div className='Select-value' title={ this.props.value.title }>
                <span className='Select-value-label'>
                    { title }
                    { this.props.children }
                </span>
            </div>
        );
    }
}
