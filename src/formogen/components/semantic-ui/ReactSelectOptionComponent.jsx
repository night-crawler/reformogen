import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class ReactSelectOptionComponent extends Component {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        isDisabled: PropTypes.bool,
        isFocused: PropTypes.bool,
        isSelected: PropTypes.bool,
        onFocus: PropTypes.func,
        onSelect: PropTypes.func,
        option: PropTypes.object.isRequired,
    };

    handleMouseDown = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.props.onSelect(this.props.option, event);
    };

    handleMouseEnter = (event) => {
        this.props.onFocus(this.props.option, event);
    };

    handleMouseMove = (event) => {
        if (this.props.isFocused) return;
        this.props.onFocus(this.props.option, event);
    };

    render () {
        let option = this.props.option,
            title = option.printable_name || option.name || option.title;

        return (
            <div className={ this.props.className }
                onMouseDown={ this.handleMouseDown }
                onMouseEnter={ this.handleMouseEnter }
                onMouseMove={ this.handleMouseMove }
                title={ this.props.option.title }>

                { title }
                { this.props.children }
            </div>
        );
    }
}
