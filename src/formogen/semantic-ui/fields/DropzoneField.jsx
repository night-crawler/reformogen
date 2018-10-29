import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Checkbox, Form, Icon, Image, List, Segment } from 'semantic-ui-react';
import Measure from 'react-measure';
import Dropzone from 'react-dropzone';

import { errorsType } from '../../fieldPropTypes';
import { fileTypeImageMapping, UNKNOWN_FILE_TYPE } from '../../fileTypeImageMapping';
import { splitExt, bytesToSize } from '../../utils';
import ErrorsList from '../common/ErrorsList';
import CaptionTruncator from '../common/CaptionTruncator';

const fileShape = PropTypes.shape({
  lastModified: PropTypes.number,
  lastModifiedDate: PropTypes.object,
  preview: PropTypes.string,
  size: PropTypes.number,
  type: PropTypes.string,
});


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


/**
 * {
 *     formFilesUploadProgress: {
 *         <fieldName>: {
 *              <fileName>: {percent: 100, status: 'ok|fail'}
 *         }
 *     }
 * }
 */

FilesPreview.propTypes = {
  files: PropTypes.arrayOf(fileShape).isRequired,
  onClear: PropTypes.func.isRequired,
  onRemoveFile: PropTypes.func.isRequired,
  getFileIcon: PropTypes.func.isRequired,
  formFilesUploadProgress: PropTypes.object
};
function FilesPreview({ files, onClear, getFileIcon, onRemoveFile, formFilesUploadProgress }) {
  if (_.isEmpty(files))
    return null;

  return (
    <Segment attached={ true }>
      <List divided={ true } relaxed={ true } className='files-previews'>
        { files.map((file, i) => {
          const progress = _.get(formFilesUploadProgress, file.name, {});
          return <FileItem
            key={ i }
            file={ file }
            getFileIcon={ getFileIcon }
            onRemove={ onRemoveFile }
            progress={ progress }
          />;
        }) }
      </List>
      <Button size='mini' fluid={ true } icon={ true } onClick={ onClear }>
        <Icon name='remove' />
      </Button>
    </Segment>
  );
}


CurrentFilesPreview.propTypes = {
  currentFiles: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  removable: PropTypes.bool,
  onRemove: PropTypes.func,
};
function CurrentFilesPreview({ currentFiles, removable = true, onRemove }) {
  const files = _.isArray(currentFiles) ? currentFiles : [currentFiles];

  const listItems = files.map((value, i) => (
    <List.Item key={ i }>
      <a href={ value } target='_blank' rel='noopener noreferrer'>
        { typeof value === 'string' ? value.split('/').slice(-1) : 'File' }
      </a>
    </List.Item>
  ));

  return (
    <Segment attached={ true }>
      <List>
        <List.Header>Currently:</List.Header>
        <List.Item>
          <List.Content floated='right'>
            { removable && <Checkbox label='clear' floated='right' onChange={ onRemove } /> }
          </List.Content>
          <List bulleted={ true }>{ listItems }</List>
        </List.Item>
      </List>
    </Segment>
  );
}


FileItem.propTypes = {
  file: fileShape.isRequired,
  getFileIcon: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  progress: PropTypes.object.isRequired,
};
function FileItem({ file, getFileIcon, onRemove, progress }) {
  const [fileName, fileExt] = splitExt(file.name);
  const { status: uploadStatus, percent = 0 } = progress;
  const color = uploadStatus === 'fail' ? '#db2828' : 'LimeGreen';

  return (
    <List.Item>
      <Measure bounds={ true }>
        {
          ({ measureRef, contentRect }) =>
            <div ref={ measureRef }>
              <ListContentWithProgress percent={ percent } color={ color }>
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
    handleDrop = (newFiles) => {
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
      const mergedFiles = _(oldFiles)
        .keyBy(keyBuilder)
        .merge(_.keyBy(newFiles, keyBuilder))
        .values()
        .value();

      this.setState({ files: mergedFiles });
      return this.props.onChange(
        null,
        {
          name: this.props.name,
          value: { files: mergedFiles, url: this.props.upload_url, action: 'upload' }
        }
      );
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
      const files = _.without(this.state.files, fileObject);
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
      const labelText = this.props.upperFirstLabel ? _.upperFirst(this.props.verbose_name) : this.props.verbose_name;

      let _props = {
        multiple: this.props.multiple,
        onDrop: this.handleDrop,
        accept: this.props.accept,
      };

      if (_.isFunction(this.props.updateProps)) {
        _props = this.props.updateProps(_props, this.props);
      }

      const showCurrentFilesPreview = this.props.value && _.isEmpty(this.state.files);

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

          <FilesPreview
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
          }

          <ErrorsList messages={ this.props.errors } />
        </Form.Field>
      );
    }
}
