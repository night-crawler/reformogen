import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import { Button, Form, Icon, Image, List, Popup } from 'semantic-ui-react';

import Measure from 'react-measure';

import Dropzone from 'react-dropzone';

import { fileTypeImageMapping, UNKNOWN_FILE_TYPE } from '../../fileTypeImageMapping';
import { splitExt, bytesToSize } from '../../utils';
import { errorsType } from '../fieldPropTypes';
import { MessageList, CaptionTruncator } from './MiscComponents';


ListContentWithProgress.propTypes = {
    percent: PropTypes.number,
    color: PropTypes.string,
    styles: PropTypes.object,
    children: PropTypes.any,
};
function ListContentWithProgress({ percent = 50, color = 'LimeGreen', styles = {}, children = {} }) {
    const defaultStyles = {
        background: `linear-gradient(90deg, #fff, ${color} ${percent}%, #fff ${percent}%, #fff 100%)`,
        backgroundRepeat: 'no-repeat',
        border: '1px solid #999',
        borderRadius: 4,  // don't touch this it's a magic number!
        height: '37px',
    };
    return (
        <List.Content className='list-content-with-progress' style={ { ...defaultStyles, styles } }>
            { children }
        </List.Content>
    );
}

const fileShape = PropTypes.shape({
    lastModified: PropTypes.number,
    lastModifiedDate: PropTypes.object,
    preview: PropTypes.string,
    size: PropTypes.number,
    type: PropTypes.string,
});

FilesPreviews.propTypes = {
    files: PropTypes.arrayOf(fileShape).isRequired,
    onClear: PropTypes.func.isRequired,
    onRemoveFile: PropTypes.func.isRequired,
    getFileIcon: PropTypes.func.isRequired,
};
function FilesPreviews({ files, onClear, getFileIcon, onRemoveFile }) {
    if (_.isEmpty(files)) {
        return null;
    }

    return (
        <div className='ui segment attached'>
            <List divided={ true } relaxed={ true } className='files-previews'>
                { files.map((file, i) => (
                    <FileItem file={ file } key={ i } getFileIcon={ getFileIcon } onRemove={ onRemoveFile } />
                )) }
            </List>
            <Button size='mini' fluid={ true } icon={ true } onClick={ onClear }>
                <Icon name='remove' />
            </Button>
        </div>
    );
}

FileItem.propTypes = {
    file: fileShape.isRequired,
    getFileIcon: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
};
function FileItem({ file, getFileIcon, onRemove }) {
    const [fileName, fileExt] = splitExt(file.name);

    return (
        <List.Item>
            <Measure bounds={ true }>
                {
                    ({ measureRef, contentRect }) =>
                        <div ref={ measureRef }>
                            <ListContentWithProgress percent={ 56 }>
                                <Image verticalAlign='middle' size='mini' src={ getFileIcon(file) } floated='left' />
                                <div className='file-representation' title={ `[${bytesToSize(file.size)}] ${file.name}` }>
                                    <strong>{ `[${bytesToSize(file.size)}]` }&nbsp;</strong>
                                    <CaptionTruncator caption={ fileName } width={ (contentRect.bounds.width || 200) - 200 } />
                                    <span>.{ fileExt }</span>
                                </div>
                                <Button icon={ true } size='mini' attached='right' floated='right'
                                    onClick={ () => onRemove(file) }>
                                    <Icon name='remove' />
                                </Button>
                            </ListContentWithProgress>
                        </div>
                }
            </Measure>
        </List.Item>
    );
}

export default class DropzoneField extends React.Component {
    static propTypes = {
        type: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        verbose_name: PropTypes.string.isRequired,
        help_text: PropTypes.string.isRequired,
        upperFirstLabel: PropTypes.bool,
        required: PropTypes.bool,
        editable: PropTypes.bool,
        updateProps: PropTypes.func,
        widget: PropTypes.string,
        errors: errorsType,
        upload_url: PropTypes.string,

        onChange: PropTypes.func.isRequired,
        getFileIcon: PropTypes.func,
        multiple: PropTypes.bool,
        accept: PropTypes.string,

        layoutOpts: PropTypes.object,
    };

    static defaultProps = {
        getFileIcon: (fileObject) => {
            let ext = fileObject.name.split('.').pop().toLowerCase();
            return fileTypeImageMapping[ext] || UNKNOWN_FILE_TYPE;
        },
        multiple: false,
    };

    constructor(props) {
        super(props);
        this.state = { files: [] };
    }

    handleDrop = (newFiles) => {
        const { onChange, upload_url, name, multiple } = this.props;
        const { files: oldFiles } = this.state;

        if (!multiple) {
            this.setState({ files: newFiles });
            onChange(null, {
                name,
                value: {files: newFiles, defaultUploadUrl: upload_url}
            });
            return;
        }

        // build key by this triple to ensure we're adding different newFiles
        const keyBuilder = (item) => `${ item.lastModified }:${ item.size }:${ item.name }`;
        const mergedFiles = _(oldFiles)
            .keyBy(keyBuilder)
            .merge(_.keyBy(newFiles, keyBuilder))
            .values()
            .value();
        this.setState({ files: mergedFiles });
        onChange(null, {
            name,
            value: {files: mergedFiles, defaultUploadUrl: upload_url}
        });
    };

    handleClearFiles = () => {
        const { name, upload_url } = this.props;
        this.setState({ files: [] });
        this.props.onChange(
            null, {
                name: name,
                value: {files: [], defaultUploadUrl: upload_url}
            });
    };

    handleRemoveFile = (fileObject) => {
        const files = _.without(this.state.files, fileObject);
        const { name, upload_url } = this.props;

        this.setState({ files });
        this.props.onChange(
            null, {
                name: name,
                value: {files, defaultUploadUrl: upload_url}
            });
    };

    render() {
        const labelText = this.props.upperFirstLabel ? _.upperFirst(this.props.verbose_name) : this.props.verbose_name;

        let _props = {
            multiple: this.props.multiple,
            onDrop: this.handleDrop,
            accept: this.props.accept,
        };

        if (_.isFunction(this.props.updateProps)) {
            _props = this.props.updateProps(_props, this.props);
        }

        return (
            <Form.Field
                required={ this.props.required }
                disabled={ !this.props.editable }
                width={ this.props.layoutOpts.width }
                error={ !_.isEmpty(this.props.errors) }
            >

                <Dropzone className='ui center aligned dropzone segment attached top'  { ..._props }>
                    <strong>{ labelText } { this.props.required && <span className='ui red'>*</span> }</strong>
                    { this.props.help_text && <div className='help-text'>{ this.props.help_text }</div> }
                    <div>
                        { !_.isEmpty(this.state.files) || 'Drop files here' }
                    </div>
                </Dropzone>

                <FilesPreviews
                    files={ this.state.files }
                    onClear={ this.handleClearFiles }
                    getFileIcon={ this.props.getFileIcon }
                    onRemoveFile={ this.handleRemoveFile }
                />
                <MessageList messages={ this.props.errors } />
            </Form.Field>
        );
    }
}
