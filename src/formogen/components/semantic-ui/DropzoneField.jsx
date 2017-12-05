import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import Dropzone from 'react-dropzone';
import { Button, Form, Icon, Image, List } from 'semantic-ui-react';

import mt_msword from '../../images/mimetypes/application-msword.png';
import mt_pdf from '../../images/mimetypes/application-pdf.png';
import mt_excel from '../../images/mimetypes/application-vnd.ms-excel.png';
import mt_powerpoint from '../../images/mimetypes/application-vnd.ms-powerpoint.png';
import mt_7zip from '../../images/mimetypes/application-x-7zip.png';
import mt_rar from '../../images/mimetypes/application-x-rar.png';
import mt_tar from '../../images/mimetypes/application-x-tar.png';
import mt_zip from '../../images/mimetypes/application-x-zip.png';
import mt_wav from '../../images/mimetypes/audio-x-wav.png';
import mt_bpm from '../../images/mimetypes/image-bmp.png';
import mt_gif from '../../images/mimetypes/image-gif.png';
import nt_jpeg from '../../images/mimetypes/image-jpeg.png';
import mt_png from '../../images/mimetypes/image-png.png';
import mt_tiff from '../../images/mimetypes/image-tiff.png';
import mt_ico from '../../images/mimetypes/image-x-ico.png';
import mt_text_plain from '../../images/mimetypes/text-plain.png';
import mt_unknown from '../../images/mimetypes/unknown.png';
import { errorsType } from '../fieldPropTypes';

import { MessageList } from './MiscComponents';


const fileTypeImageMapping = {
    'docx': mt_msword,
    'xlsx': mt_excel,
    'pptx': mt_powerpoint,
    'pdf': mt_pdf,
    '7zip': mt_7zip,
    'rar': mt_rar,
    'tar': mt_tar,
    'zip': mt_zip,
    'wav': mt_wav,
    'mp3': mt_wav,
    'bpm': mt_bpm,
    'gif': mt_gif,
    'jpeg': nt_jpeg,
    'jpg': nt_jpeg,
    'png': mt_png,
    'tiff': mt_tiff,
    'ico': mt_ico,
    'txt': mt_text_plain,
};

const UNKNOWN_FILE_TYPE = mt_unknown;


function bytesToSize(bytes) {
    if (bytes === 0) return 'n/a';

    const
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
        i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);

    if (i === 0) {
        return `${ bytes } ${ sizes[i] }`;
    }
    return `${ ( bytes / ( 1024 ** i ) ).toFixed(1) } ${ sizes[i] }`;
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
            <List divided={ true } relaxed={ true }>
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
    return (
        <List.Item>
            <List.Content floated='right' className='left aligned'>
                <Button icon={ true } size='mini' onClick={ () => onRemove(file) }>
                    <Icon name='remove' />
                </Button>
            </List.Content>
            <List.Content>
                <Image verticalAlign='middle' size='mini' src={ getFileIcon(file) } floated='left' />
                { file.name } [{ bytesToSize(file.size) }]
            </List.Content>
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

    handleDrop = (files) => {
        if (!this.state.multiple) {
            this.setState({ files });
            this.props.onChange(null, { name: this.props.name, value: files });
            return;
        }

        // build key by this triple to ensure we're adding different files
        const keyBuilder = (item) => ( `${ item.lastModified }:${ item.size }:${ item.name }` );
        const mergedFiles = _(this.state.files)
            .keyBy(keyBuilder)
            .merge(_.keyBy(files, keyBuilder))
            .values()
            .value();
        this.setState({ files: mergedFiles });
        this.props.onChange(null, { name: this.props.name, value: mergedFiles });
    };

    handleClearFiles = () => {
        this.setState({ files: [] });
        this.props.onChange(null, { name: this.props.name, value: [] });
    };

    handleRemoveFile = (fileObject) => {
        const files = _.without(this.state.files, fileObject);
        this.setState({ files });
        this.props.onChange(null, { name: this.props.name, value: files });
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
