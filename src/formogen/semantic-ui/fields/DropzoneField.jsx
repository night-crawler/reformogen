import React from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Form, Icon, Image, List, Segment } from 'semantic-ui-react';
import { isEmpty, get, upperFirst, without, isArray, keyBy } from 'lodash';
import Measure from 'react-measure';
import Dropzone from 'react-dropzone';

import { errorsType } from '../../fieldPropTypes';
import { fileTypeImageMapping, UNKNOWN_FILE_TYPE } from '../../fileTypeImageMapping';
import { splitExt, bytesToSize } from '../../utils';
import { ErrorsList } from '../ErrorsList';
import { CaptionTruncator } from '../CaptionTruncator';



export class DropzoneField extends React.Component {
    static propTypes = {
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      verbose_name: PropTypes.string.isRequired,
      help_text: PropTypes.string,
      upperFirstLabel: PropTypes.bool,
      required: PropTypes.bool,
      editable: PropTypes.bool,
      updateProps: PropTypes.func,
      widget: PropTypes.string,
      errors: errorsType,

      upload_url: PropTypes.string,
      delete_url: PropTypes.string,

      onChange: PropTypes.func.isRequired,
      getFileIcon: PropTypes.func,
      multiple: PropTypes.bool,
      accept: PropTypes.string,

      layoutOpts: PropTypes.object,
      formFilesUploadProgress: PropTypes.object,

      value: PropTypes.string,
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

    handleRemoveCurrentFiles = (event, { checked }) => {
      if (checked) {
        return this.props.onChange(
          null,
          {
            name: this.props.name,
            value: { files: [{ name: this.props.value }], url: this.props.delete_url, action: 'delete' }
          }
        );
      }

      return this.props.onChange(
        null,
        {
          name: this.props.name,
          value: { files: [], url: this.props.upload_url, action: 'upload' }
        }
      );
    };
    handleDrop = newFiles => {
      const { files: oldFiles } = this.state;

      if (!this.props.multiple) {
        this.setState({ files: newFiles });
        return this.props.onChange(
          null,
          {
            name: this.props.name,
            value: { files: newFiles, url: this.props.upload_url, action: 'upload' }
          }
        );
      }

      // build key by this triple to ensure we're adding different newFiles
      const keyBuilder = (item) => `${ item.lastModified }:${ item.size }:${ item.name }`;

      
      
    };
    handleClearFiles = () => {
      this.setState({ files: [] });
      this.props.onChange(
        null,
        {
          name: this.props.name,
          value: { files: [], url: this.props.upload_url, action: 'upload' }
        }
      );
    };
    handleRemoveFile = (fileObject) => {
      const files = without(this.state.files, fileObject);
      this.setState({ files });

      return this.props.onChange(
        null,
        {
          name: this.props.name,
          value: { files, url: this.props.upload_url, action: 'upload' }
        }
      );
    };

    render() {
      const labelText = this.props.upperFirstLabel 
        ? upperFirst(this.props.verbose_name) 
        : this.props.verbose_name;

      return (
        <Form.Field
          required={ this.props.required }
          disabled={ !this.props.editable }
          width={ this.props.layoutOpts.width }
          error={ !isEmpty(this.props.errors) }
        >
          <Dropzone 
            className='ui center aligned dropzone segment attached top'  
            multiple={ this.props.multiple }
            onDrop={ this.handleDrop }
            accept={ this.props.accept }
          >
            <strong>{ labelText } { this.props.required && <span className='ui red'>*</span> }</strong>
            { this.props.help_text && <div className='help-text'>{ this.props.help_text }</div> }
            <div>
              { !isEmpty(this.state.files) || 'Drop files here' }
            </div>
          </Dropzone>

          {/* <FilesPreview
            files={ this.state.files }
            onClear={ this.handleClearFiles }
            getFileIcon={ this.props.getFileIcon }
            onRemoveFile={ this.handleRemoveFile }
            formFilesUploadProgress={ this.props.formFilesUploadProgress }
          />

          {
            showCurrentFilesPreview &&
            <CurrentFilesPreview
              currentFiles={ this.props.value }
              removable={ !!this.props.delete_url }
              onRemove={ this.handleRemoveCurrentFiles }
            />
          } */}

          <ErrorsList messages={ this.props.errors } />
        </Form.Field>
      );
    }
}
