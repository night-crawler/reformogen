import React from 'react';
import PropTypes from 'prop-types';
import { Form, Segment } from 'semantic-ui-react';
import { isEmpty, upperFirst, keyBy, sortBy, reverse } from 'lodash';
import Dropzone from 'react-dropzone';

import { errorsType } from '../../../fieldPropTypes';
import { fileTypeImageMapping, UNKNOWN_FILE_TYPE } from '../../../fileTypeImageMapping';
import { ErrorsList } from '../../ErrorsList';

import { DirtyFilesPreview } from './DirtyFilesPreview';
import { FilesOnServerPreview } from './FilesOnServerPreview';


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

      displayOptions: PropTypes.object,
      formFilesUploadProgress: PropTypes.object,
      
      /** value is a current dirty value, previous is not here */
      value: PropTypes.array,
      initialValue: PropTypes.string,

      dropText: PropTypes.string,
    };
    static defaultProps = {
      initialValue: '',
      dropText: 'Drop files here',
      getFileIcon: (fileObject) => {
        let ext = fileObject.name.split('.').pop().toLowerCase();
        return fileTypeImageMapping[ext] || UNKNOWN_FILE_TYPE;
      },
      multiple: false,
      value: [],
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
      if (!this.props.multiple)
        return this.props.onChange(null, {
          name: this.props.name,
          value: newFiles
        });

      // build key by this triple to ensure we're adding different newFiles
      const keyBuilder = item => `${ item.lastModified }:${ item.size }:${ item.name }`;
      const newUniqueFiles = {
        ...keyBy(this.props.value, keyBuilder),
        ...keyBy(newFiles, keyBuilder) 
      } |> Object.values 
        |> (values => sortBy(values, ['size']))
        |> reverse;
      
      return this.props.onChange(null, {
        name: this.props.name,
        value: newUniqueFiles
      });
    };
    handleClearFiles = () =>
      this.props.onChange(null, {
        name: this.props.name,
        value: []
      });

    handleRemoveFile = (fileObject, i) =>
      this.props.onChange(null, {
        name: this.props.name,
        value: this.props.value.filter((file, _i) => _i !== i)
      });

    handleRemoveFileFromServer = fileUrl => {
      // eslint-disable-next-line
      console.log(fileUrl);
    }

    render() {
      const labelText = this.props.upperFirstLabel 
        ? upperFirst(this.props.verbose_name) 
        : this.props.verbose_name;

      return (
        <Form.Field
          required={ this.props.required }
          disabled={ !this.props.editable }
          width={ this.props.displayOptions.width }
          error={ !isEmpty(this.props.errors) }
        >
          <Segment
            as={ Dropzone } 
            textAlign='center'
            attached='top'
            className='dropzone'  
            multiple={ this.props.multiple }
            onDrop={ this.handleDrop }
            accept={ this.props.accept }
            acceptClassName='green'
            rejectClassName='red'
          >
            <strong>{ labelText } { this.props.required && <span className='ui red'>*</span> }</strong>
            { this.props.help_text && <div className='help-text'>{ this.props.help_text }</div> }
            <div>
              { !isEmpty(this.state.files) || this.props.dropText }
            </div>
          </Segment>

          <DirtyFilesPreview
            files={ this.props.value }
            onClear={ this.handleClearFiles }
            onDeleteFile={ this.handleRemoveFile }
          />

          <FilesOnServerPreview
            files={ this.props.initialValue }
            onDeleteFile={ this.handleRemoveFileFromServer }
            isRemovable={ !!this.props.delete_url }
          />
          <ErrorsList messages={ this.props.errors } />
        </Form.Field>
      );
    }
}
