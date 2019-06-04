import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash'
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import IconRemove from 'material-ui/svg-icons/content/remove-circle-outline';
import IconAdd from 'material-ui/svg-icons/content/add-circle-outline';
import IconDescription from 'material-ui/svg-icons/action/description';
import IconParagraphs from 'material-ui/svg-icons/action/view-headline';
import IconVideo from 'material-ui/svg-icons/av/videocam';
import IconImage from 'material-ui/svg-icons/editor/insert-photo';
import IconLink from 'material-ui/svg-icons/content/link';
import IconVideoLink from 'material-ui/svg-icons/av/video-library';
import IconDocument from 'material-ui/svg-icons/editor/attach-file';

import NormalFlatButton from '../../../components/common/NormalFlatButton';
import NormalTextField from '../../../components/common/NormalTextField';
import VideoPicker from '../../../components/common/VideoPicker';
import ImagePicker from '../../../components/common/ImagePicker';
import FilePicker from '../../../components/common/FilePicker';
import Padding from '../../../components/common/Padding';
import WrapDialogue from '../../../components/common/WrapDialogue';

import urlUtils from '../../utils/urlUtils'

import colors from '../../../styles/colors';
import layout from '../../../styles/layout';

const style = {
  attribute: {
    margin: 4,
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'center'
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
  longTextField: {
    width: '80%'
  },
  media: {
    height: 100
  },
  row: {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'center'
  },
  attrButton: {
    height: 50,
    width: 50,
  },
  chosenNewAttrFields: {
    padding: 20,
    borderStyle: 'solid',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: colors.accent
  }
}

class InstructionEditor extends Component {
	constructor(props) {
    super(props);

    this.state = {
      category: this.props.category,
      showChosenNewAttrField: [],
      newDocument: {}
    }

    this.update = this.update.bind(this)
    this.addAttributeEditor = this.addAttributeEditor.bind(this)
    // Attributes
    this.attrDescription = this.attrDescription.bind(this)
    this.attrParagraphs = this.attrParagraphs.bind(this)
    this.attrVideo = this.attrVideo.bind(this)
    this.attrImage = this.attrImage.bind(this)
    this.attrWebsite = this.attrWebsite.bind(this)
    this.attrYoutube = this.attrYoutube.bind(this)
    this.attrDocumentList = this.attrDocumentList.bind(this)
    this.attrAddDocument = this.attrAddDocument.bind(this)
    this.attrWistia = this.attrWistia.bind(this)
  }

	componentWillReceiveProps(nextProps) {
		this.setState({category: nextProps.category})
	}

  update(name, value) {
    let category = Object.assign({}, this.state.category, {
      [name]: value
    });
    this.setState({category});

    this.props.onChange(category);
  }

  // ----- Attributes -----
  attrDescription() {
    return (
      <NormalTextField floatingLabelText='Description'
        style={style.longTextField}
        hintText='Enter description here...'
        value={this.state.category.categoryDesc}
        onChange={(event, newValue)=>this.update('categoryDesc', newValue)}/>
    )
  }

  attrParagraphs() {
    return (
      <NormalTextField floatingLabelText='Text'
        style={style.longTextField}
        hintText='Enter text here...'
        multiLine={true}
        rows={2}
        rowsMax={10}
        value={this.state.category.categoryContent}
        onChange={(event, newValue)=>this.update('categoryContent', newValue)}/>
    )
  }

  attrVideo() {
    return (
      <VideoPicker
        videoUrl={this.state.category.videoUrl}
        userId={this.props.userId}
        appId={this.props.appId}
        previewStyle={style.media}
        handleSubmit={(videoUrl)=>this.update('videoUrl', videoUrl)}
      />
    )
  }

  attrImage() {
    return (
      <ImagePicker
        imageUrl={this.state.category.imageUrl}
        userId={this.props.userId}
        previewStyle={style.media}
        handleSubmit={(imageUrl)=>this.update('imageUrl', imageUrl)}
      />
    )
  }

  attrWebsite() {
    let website = this.state.category.website
    if(!website) {
      website = {}
    }
    return (
      <div style={style.row}>
        <NormalTextField
          floatingLabelText='Website Name'
          hintText='e.g. Homepage'
          value={website.name}
          errorText={_.isEmpty(website.name) ? 'Website name is required' : ''}
          onChange={(event, newValue)=>this.update('website', {...website, name: newValue})}
        />
        <Padding width={20}/>
        <NormalTextField
          floatingLabelText='Website URL'
          hintText='e.g. https://www.homepage.com'
          value={website.url}
          errorText={!_.isEmpty(website.url) && urlUtils.isValidUrl(website.url) ? '' : 'Invalid website URL'}
          onChange={(event, newValue)=>this.update('website', {...website, url: newValue})}
        />
      </div>
    )
  }

  attrAddDocument() {
    const addDocument = () => {
      let documents = this.state.category.documents
      if(_.isEmpty(documents)) {
        documents = []
      }
      let newDoc = {
        name: this.state.newDocument.name,
        url: this.state.newDocument.url,
      }
      let newDocuments = _.slice(documents);
      newDocuments.push(newDoc);
      let category = this.state.category
      category.documents = newDocuments;
      this.setState({
        category,
        newDocument: {}
      });
      this.refs.addInstContentDialogue.close()
    }

    return (
      <div style={style.row}>
        <NormalTextField
          floatingLabelText="Document Name"
          errorText={_.isEmpty(this.state.newDocument.name) ? "This field is required" : ""}
          value={this.state.newDocument.name}
          onChange={(event)=>this.setState({newDocument: {...this.state.newDocument, name: event.target.value}})}/>
        <FilePicker
          fileUrl={this.state.newDocument.url}
          userId={this.props.userId}
          appId={this.props.appId}
          handleSubmit={(fileUrl)=>this.setState({newDocument: {...this.state.newDocument, url: fileUrl}})}
        />
        <RaisedButton primary={true} label="ADD" onClick={()=>addDocument()} />
      </div>
    )
  }

  attrDocumentList() {
    const updateDocument = (i_doc, originalDocument, updatedValue) => {
      let newDocument = _.assign({}, originalDocument, updatedValue);
      let category = this.state.category
      category.documents[i_doc] = newDocument;
      this.setState({ category });
    }

    const removeDocument = (i_doc) => {
      let newDocuments = _.slice(this.state.category.documents);
      _.pullAt(newDocuments, [i_doc]);
      let category = this.state.category
      category.documents = newDocuments;
      this.setState({ category });
    }

    return (
      <div>
        {(!_.isEmpty(this.state.category.documents) && _.size(this.state.category.documents) > 0) && <div>
          {this.state.category.documents.map((doc, i_doc) => {
            return (
              <div style={style.row}>
                <NormalTextField
                  floatingLabelText="Document Name"
                  errorText={_.isEmpty(doc.name) ? "This field is required" : ""}
                  value={doc.name}
                  onChange={(event)=>{
                    let name = event.target.value;
                    updateDocument(i_doc, doc, {name});
                  }}/>
                {!_.isEmpty(doc.url) &&
                  <a href={doc.url} target="_blank">View</a>
                }
                <FilePicker
                  fileUrl={doc.url}
                  userId={this.props.userId}
                  appId={this.props.appId}
                  handleSubmit={(fileUrl)=>{
                    updateDocument(i_doc, doc, {url: fileUrl});
                  }}
                />
                <IconButton tooltip='Remove Document' onClick={()=>removeDocument(i_doc)}><IconRemove /></IconButton>
              </div>
            )
          })}
        </div>}
      </div>
    )
  }

  attrYoutube() {
    let youtubeVideo = this.state.category.youtubeVideo
    if(!youtubeVideo) {
      youtubeVideo = {}
    }
    return(
      <NormalTextField
        floatingLabelText='YouTube Video URL'
        hintText='e.g. https://www.youtube.com/watch?v=SoFr9Ny-gbc'
        style={style.longTextField}
        value = {youtubeVideo.url}
        errorText = {!_.isEmpty(youtubeVideo.url) && urlUtils.getYoutubeVideoId(youtubeVideo.url)!=='' ? "" : "Invalid YouTube Video Link."}
        onChange={(event, newValue)=>this.update('youtubeVideo', {...youtubeVideo, url: newValue, id: urlUtils.getYoutubeVideoId(newValue)})}
      />
    );
  }

  attrWistia() {
    let wistiaVideo = this.state.category.wistiaVideo
    if(!wistiaVideo) {
      wistiaVideo = {}
    }
    return(
      <NormalTextField
        floatingLabelText='Wistia Video URL'
        hintText='e.g. https://advicecoach.wistia.com/medias/swi18flles'
        style={style.longTextField}
        value = {wistiaVideo.url}
        errorText = {!_.isEmpty(wistiaVideo.url) && urlUtils.getWistiaVideoId(wistiaVideo.url)!=='' ? "" : "Invalid Wistia Video Link."}
        onChange={(event, newValue)=>this.update('wistiaVideo', {...wistiaVideo, url: newValue, id: urlUtils.getWistiaVideoId(newValue)})}
      />
    );
  }

  // ----- End of Attributes -----

  addAttributeEditor() {
    const showField = (field)=>{
      let showChosenNewAttrField = []
      showChosenNewAttrField[field] = true
      this.setState({showChosenNewAttrField})
    }
    return (
      <div>
        <div style={style.row}>
          {_.isEmpty(this.state.category.categoryDesc) && <AttributeButton name='Description' icon={<IconDescription/>} onClick={()=>showField('Description')} />}
          {_.isEmpty(this.state.category.categoryContent) && <AttributeButton name='Text' icon={<IconParagraphs/>} onClick={()=>showField('Paragraphs')} />}
          {_.isEmpty(this.state.category.videoUrl) && <AttributeButton name='Video' icon={<IconVideo/>} onClick={()=>showField('Video')} />}
          {_.isEmpty(this.state.category.imageUrl) && <AttributeButton name='Image' icon={<IconImage/>} onClick={()=>showField('Image')} />}
          {_.isEmpty(this.state.category.website) && <AttributeButton name='Website' icon={<IconLink/>} onClick={()=>showField('Website')} />}
          <AttributeButton name='Document' icon={<IconDocument />} onClick={()=>showField('Document')} />
          {_.isEmpty(this.state.category.youtubeVideo) && <AttributeButton name='YouTube Video' icon={<IconVideoLink />} onClick={()=>showField('YouTube Video')} />}
          {_.isEmpty(this.state.category.wistiaVideo) && <AttributeButton name='Wistia Video' icon={<IconVideoLink />} onClick={()=>showField('Wistia Video')} />}
        </div>
        <br /><br />
        <Divider />
        <br /><br />
        <div style={style.chosenNewAttrFields}>
          {this.state.showChosenNewAttrField['Description'] && this.attrDescription()}
          {this.state.showChosenNewAttrField['Paragraphs'] && this.attrParagraphs()}
          {this.state.showChosenNewAttrField['Video'] && this.attrVideo()}
          {this.state.showChosenNewAttrField['Image'] && this.attrImage()}
          {this.state.showChosenNewAttrField['Website'] && this.attrWebsite()}
          {this.state.showChosenNewAttrField['Document'] && this.attrAddDocument()}
          {this.state.showChosenNewAttrField['YouTube Video'] && this.attrYoutube()}
          {this.state.showChosenNewAttrField['Wistia Video'] && this.attrWistia()}
        </div>
      </div>
    )
  }

  render() {
    const Attribute = (attr, field, tooltip)=>{
      return (
        <div>
          {!_.isEmpty(this.state.category[field]) && <div style={style.attribute}>
            {attr()}
            <IconButton tooltip={tooltip} onClick={()=>this.update(field, null)}><IconRemove /></IconButton>
          </div>}
        </div>
      )
    }

    let instructionName = `Instruction: ${this.state.category.categoryName}`

    return (
      <Paper style={{...layout.common.paperContainer, ...{marginLeft: 20}}}>
        {Attribute(this.attrDescription, 'categoryDesc', 'Remove Description')}
        {Attribute(this.attrParagraphs, 'categoryContent', 'Remove Text')}
        {Attribute(this.attrVideo, 'videoUrl', 'Remove Video')}
        {Attribute(this.attrImage, 'imageUrl', 'Remove Image')}
        {Attribute(this.attrWebsite, 'website', 'Remove Website')}
        {Attribute(this.attrYoutube, 'youtubeVideo', 'Remove YouTube Video')}
        {Attribute(this.attrWistia, 'wistiaVideo', 'Remove Wistia Video')}
        {this.attrDocumentList()}
        <FlatButton primary={true} style={style.button} label='Add Instruction Content' icon={<IconAdd/>} onClick={()=>this.refs.addInstContentDialogue.open()}/>
        <WrapDialogue
          ref="addInstContentDialogue"
          title={instructionName}
          content={
            <div>
              <p><b>Add Any Content</b></p>
              {this.addAttributeEditor()}
              <br /><br />
              <NormalFlatButton label="Cancel" onClick={()=>this.refs.addInstContentDialogue.close()} />
              <NormalFlatButton primary={true} label="Done" onClick={()=>this.refs.addInstContentDialogue.close()} />
            </div>
          }
        />
      </Paper>
    )
  }
}

class AttributeButton extends Component {
  render() {
    return (
      <div style={{margin: 10, display: 'flex', flexFlow: 'column', textAlign: 'center', justifyContent: 'center'}}>
        <IconButton tooltip={`Add ${this.props.name}`} iconStyle={style.attrButton} onClick={this.props.onClick}>{this.props.icon}</IconButton>
        <br />
        {this.props.name}
      </div>
    )
  }
}

InstructionEditor.propTypes = {
	category: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  appId: PropTypes.string.isRequired,
};

export default InstructionEditor;
