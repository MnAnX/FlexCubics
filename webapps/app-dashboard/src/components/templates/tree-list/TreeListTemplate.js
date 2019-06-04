import React from 'react';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import IconAdd from 'material-ui/svg-icons/content/add-box';
import _ from 'lodash'

import TreeView from './TreeView';
import NormalFlatButton from '../../common/NormalFlatButton';
import DeleteButton from '../../common/DeleteButton';
import NormalTextField from '../../common/NormalTextField';
import SmallAddButton from '../../common/SmallAddButton';
import NormalBigButton from '../../common/NormalBigButton';
import ActionButton from '../../common/ActionButton'
import VideoPicker from '../../common/VideoPicker';
import ImagePicker from '../../common/ImagePicker';
import FilePicker from '../../common/FilePicker';
import AddFieldWrap from '../../common/AddFieldWrap';
import Padding from '../../common/Padding';

import colors from '../../../styles/colors'
import layout from '../../../styles/layout'
import help from '../../../documents/help'

import UrlUtils from '../../utils/UrlUtils'

const style = {
  page: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 30,
  },
  nodeAttributes: {
    padding: 4,
    justifyContent: 'center',
    marginLeft: 20,
    borderStyle: 'solid',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da'
  },
  attribute: {
    margin: 4,
    color: colors.primary,
    fontSize: 14,
    justifyContent: 'center'
  },
  textContainer: {
    paddingLeft: 12,
  },
  labelContainer: {
    paddingLeft: 4,
    paddingRight: 12,
  },
  label: {
    color: colors.primary,
    fontSize: 14,
  },
  video: {
    height: 100
  },
  image: {
    height: 100
  }
};

class TreeListTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: props.dataSource,
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataSource) {
      this.setState({
        dataSource: nextProps.dataSource,
      });
    }
  }

  // === Node operation (add/remove/update nodes) ===

  // --- Node: Add ---

  addCategory(i_header, i_group, categories) {
    let emptyCategory = {
      label: this.props.config.categoryLabel,
      categoryName: '',
      expanded: true,
    }
    let newCategories = _.slice(categories);
    newCategories.push(emptyCategory);
    let ds = this.state.dataSource;
    ds[i_header].groups[i_group].categories = newCategories;
    this.setState({
      dataSource: ds
    });
  }

  addGroup(i_header, groups) {
    let emptyGroup = {
      label: this.props.config.groupLabel,
      groupName: '',
      expanded: true,
      categories: [{
        label: this.props.config.categoryLabel,
        categoryName: '',
        expanded: true,
      }],
    }
    let newGroups = _.slice(groups);
    newGroups.push(emptyGroup);
    let ds = this.state.dataSource;
    ds[i_header].groups = newGroups;
    this.setState({
      dataSource: ds
    });
  }

  // --- Node: Remove ---

  removeCategory(i_header, i_group, i_category, categories) {
    let newCategories = _.slice(categories);
    _.pullAt(newCategories, [i_category]);
    let ds = this.state.dataSource;
    ds[i_header].groups[i_group].categories = newCategories;
    this.setState({
      dataSource: ds
    });
  }

  removeGroup(i_header, i_group, groups) {
    let newGroups = _.slice(groups);
    _.pullAt(newGroups, [i_group]);
    let ds = this.state.dataSource;
    ds[i_header].groups = newGroups;
    this.setState({
      dataSource: ds
    });
  }

  // --- Node: Reorder ---

  reorderCategory(i_header, i_group, i_category, categories, direction) {
    let newCategories = _.slice(categories);
    if (direction==='up'){
      if (i_category <= 0) return;
      let temp = newCategories[i_category-1];
      newCategories[i_category-1] = newCategories[i_category];
      newCategories[i_category] = temp;
    }
    else if (direction==='down'){
      if (i_category >= (categories.length-1)) return;
      let temp = newCategories[i_category+1];
      newCategories[i_category+1] = newCategories[i_category];
      newCategories[i_category] = temp;
    }
    let ds = this.state.dataSource;
    ds[i_header].groups[i_group].categories = newCategories;
    this.setState({
      dataSource: ds
    });
  }

  reorderGroup(i_header, i_group, groups, direction) {
    let newGroups = _.slice(groups);
    if (direction==='up'){
      if (i_group <= 0) return;
      let temp = newGroups[i_group-1];
      newGroups[i_group-1] = newGroups[i_group];
      newGroups[i_group] = temp;
    }
    else if (direction==='down'){
      if (i_group >= (groups.length-1)) return;
      let temp = newGroups[i_group+1];
      newGroups[i_group+1] = newGroups[i_group];
      newGroups[i_group] = temp;
    }
    let ds = this.state.dataSource;
    ds[i_header].groups = newGroups;
    this.setState({
      dataSource: ds
    });
  }

  // --- Node: Update ---

  updateCategory(i_header, i_group, i_category, originalCategory, updatedValue) {
    let newCategory = _.assign({}, originalCategory, updatedValue);
    let ds = this.state.dataSource;
    ds[i_header].groups[i_group].categories[i_category] = newCategory;
    this.setState({
      dataSource: ds
    });
  }

  updateGroup(i_header, i_group, originalGroup, updatedValue) {
    let newGroup = _.assign({}, originalGroup, updatedValue);
    let ds = this.state.dataSource;
    ds[i_header].groups[i_group] = newGroup;
    this.setState({
      dataSource: ds
    });
  }

  // === Attribute Components ===

  // --- Attributes: Category ---

  deleteCategoryAttribute(i_header, i_group, i_category, categories) {
    return (
      <div style={style.attribute}>
        <DeleteButton onPress={()=>this.removeCategory(i_header, i_group, i_category, categories)}/>
        Delete
      </div>
    );
  }

  categoryDescriptionAttribute(i_header, i_group, i_category, category) {
    return (
      <div style={style.attribute}>
        <NormalTextField id={"category-desc-" + i_category} floatingLabelText="Description (optional)"
          style={{width: '80%'}}
          value={category.categoryDesc}
          onChange={(event, newValue)=>{
            this.updateCategory(i_header, i_group, i_category, category,
              {categoryDesc: newValue});
          }}/>
      </div>
    );
  }

  categoryContentAttribute(i_header, i_group, i_category, category) {
    return (
      <div style={style.attribute}>
        <AddFieldWrap
          initShow={!_.isEmpty(category.categoryContent)}
          label='Content'
          field={
            <NormalTextField
              style={{width: '80%'}}
              multiLine={true}
              rows={2}
              rowsMax={10}
              value={category.categoryContent}
              onChange={(event, newValue)=>{
                this.updateCategory(i_header, i_group, i_category, category,
                  {categoryContent: newValue});
              }}
            />
          }/>
      </div>
    );
  }

  categoryImageAttribute(i_header, i_group, i_category, category) {
    return(
      <div style={style.attribute}>
        <AddFieldWrap
          initShow={!_.isEmpty(category.imageUrl)}
          label='Image'
          field={
            <ImagePicker
              imageUrl={category.imageUrl}
              userId={this.props.userId}
              previewStyle={style.image}
              handleSubmit={(imageUrl)=>{
                this.updateCategory(i_header, i_group, i_category, category,
                  { imageUrl: imageUrl } );
              }}
            />
          }/>
      </div>
    );
  }

  categoryWebsiteAttribute(i_header, i_group, i_category, category) {
    return(
      <div style={style.attribute}>
        <AddFieldWrap
          initShow={!_.isEmpty(category.website)}
          label='Website'
          field={
            <div>
              <NormalTextField
                floatingLabelText='Website Name'
                value={category.website ? category.website.name : ''}
                errorText={(category.website && _.isEmpty(category.website.name)) ? 'Website name is required' : ''}
                onChange={(event, newValue)=>{
                  this.updateCategory(i_header, i_group, i_category, category,
                    {website: {
                      ...category.website,
                      name: newValue
                    }});
                }}
              />
              <br />
              <NormalTextField
                floatingLabelText='Website URL'
                style={{width: '80%'}}
                value={category.website ? category.website.url : ''}
                errorText={category.website && UrlUtils.isValidUrl(category.website.url) ? '' : 'Invalid website URL'}
                onChange={(event, newValue)=>{
                  this.updateCategory(i_header, i_group, i_category, category,
                    {website: {
                      ...category.website,
                      url: newValue
                    }});
                }}
              />
            </div>
          }/>
      </div>
    );
  }

  categoryYoutubeVideoAttribute(i_header, i_group, i_category, category) {
    let hasYoutubeVideo = !_.isEmpty(category.youtubeVideo);
    let YoutubeVideoIdValid = true;
    if (hasYoutubeVideo){
      YoutubeVideoIdValid = !(UrlUtils.getYoutubeVideoId(category.youtubeVideo.url) === '');
    }
    return(
      <div style={style.attribute}>
        <AddFieldWrap
          initShow={hasYoutubeVideo}
          label='Youtube Video'
          field={
            <NormalTextField
              floatingLabelText='Youtube Video URL'
              style={{width: '80%'}}
              value = {category.youtubeVideo ? category.youtubeVideo.url : ''}
              errorText = {YoutubeVideoIdValid ? "" : "Invalid Youtube Video Link."}
              onChange={(event, newValue)=>{
                this.updateCategory(i_header, i_group, i_category, category,
                  {youtubeVideo: {
                    ...category.youtubeVideo,
                    url: newValue,
                    id: UrlUtils.getYoutubeVideoId(newValue)
                  }});
              }}
            />
          }/>
      </div>
    );
  }

  categoryVideoAttribute(i_header, i_group, i_category, category) {
    let hasVideo = !_.isEmpty(category.videoUrl);
    let showVideo = hasVideo || category.showVideo;

    return (
      <div style={style.attribute}>
        <AddFieldWrap
          initShow={!_.isEmpty(category.videoUrl)}
          label='Video'
          field={
            <VideoPicker
              videoUrl={category.videoUrl}
              userId={this.props.userId}
              appId={this.props.appId}
              previewStyle={style.video}
              handleSubmit={(videoUrl)=>{
                this.updateCategory(i_header, i_group, i_category, category,
                  { videoUrl } );
              }}
            />
          }/>
      </div>
    );
  }

  categoryDocumentsAttribute(i_header, i_group, i_category, category) {
    let hasDocuments = !_.isEmpty(category.documents) && (_.size(category.documents) > 0);

    const addDocument = (i_header, i_group, i_category, documents) => {
      if(_.isEmpty(documents)) {
        documents = []
      }
      let emptyDocument = {
        name: '',
        url: '',
      }
      let newDocuments = _.slice(documents);
      newDocuments.push(emptyDocument);
      let ds = this.state.dataSource;
      ds[i_header].groups[i_group].categories[i_category].documents = newDocuments;
      this.setState({ dataSource: ds });
    }

    const updateDocument = (i_header, i_group, i_category, i_doc, originalDocument, updatedValue) => {
      let newDocument = _.assign({}, originalDocument, updatedValue);
      let ds = this.state.dataSource;
      ds[i_header].groups[i_group].categories[i_category].documents[i_doc] = newDocument;
      this.setState({ dataSource: ds });
    }

    const removeDocument = (i_header, i_group, i_category, i_doc, documents) => {
      let newDocuments = _.slice(documents);
      _.pullAt(newDocuments, [i_doc]);
      let ds = this.state.dataSource;
      ds[i_header].groups[i_group].categories[i_category].documents = newDocuments;
      this.setState({ dataSource: ds });
    }

    return (
      <div style={style.attribute}>
        <div id={"category-documents-" + i_category}>
          {hasDocuments &&
            <div>
              <div style={style.label}>Documents</div>
              {category.documents.map((document, i_doc) => {
                return (
                  <div>
                    <div style={{display: 'inline-block'}}>
                      <NormalTextField
                        floatingLabelText="Document Name"
                        errorText={_.isEmpty(document.name) ? "This field is required" : ""}
                        value={document.name}
                        onChange={(event)=>{
                          let name = event.target.value;
                          updateDocument(i_header, i_group, i_category, i_doc, document, {name});
                        }}/>
                    </div>
                    {!_.isEmpty(document.url) &&
                      <div style={{display: 'inline-block', color: colors.text}}>( Uploaded )</div>
                    }
                    <div style={{display: 'inline-block'}}>
                      <FilePicker
                        fileUrl={document.url}
                        userId={this.props.userId}
                        appId={this.props.appId}
                        handleSubmit={(fileUrl)=>{
                          updateDocument(i_header, i_group, i_category, i_doc, document, {url: fileUrl});
                        }}
                      />
                    </div>
                    <div style={{display: 'inline-block'}}>
                      <DeleteButton onPress={()=>removeDocument(i_header, i_group, i_category, i_doc, category.documents)}/>
                    </div>
                  </div>
                )
              })}
            </div>
          }
          <NormalFlatButton
            style={layout.common.buttonAlign}
            icon={<IconAdd color='lightGrey'/>}
            label='More Document'
            onClick={()=>addDocument(i_header, i_group, i_category, category.documents)}/>
        </div>
      </div>
    );
  }

  // --- Attributes: Group ---

  deleteGroupAttribute(i_header, i_group, chapters) {
    return (
      <div style={style.attribute}>
        <DeleteButton onPress={()=>this.removeGroup(i_header, i_group, chapters)}/>
        Delete
      </div>
    );
  }

  // === Attributes ===

  categoryAttributes(i_header, i_group, i_category, category, categories) {
    return (
      <div style={style.nodeAttributes}>
        {this.categoryDescriptionAttribute(i_header, i_group, i_category, category)}
        {this.categoryContentAttribute(i_header, i_group, i_category, category)}
        {this.categoryWebsiteAttribute(i_header, i_group, i_category, category)}
        {this.categoryImageAttribute(i_header, i_group, i_category, category)}
        {this.categoryVideoAttribute(i_header, i_group, i_category, category)}
        {this.categoryYoutubeVideoAttribute(i_header, i_group, i_category, category)}
        {this.categoryDocumentsAttribute(i_header, i_group, i_category, category)}
      </div>
    );
  }

  groupAttributes(i_header, i_group, chapter, chapters) {
    return (
      <div style={style.nodeAttributes}>
        {this.deleteGroupAttribute(i_header, i_group, chapters)}
      </div>
    );
  }

  // === Main ===

  render() {
    return (
      <div>
        <div>
          {this.state.dataSource.map((header, i_header) => {
            // === Header ===
            return (
              <TreeView key={'header-' + i_header} nodeLabel='' disableDelete={true} nodeText={header.header} defaultCollapsed={false}
                className = 'header'
                hintText={header.label}
                onNodeTextChange={(text)=>header.header = text}
                removeNode={()=>{}}
                info={help.headerNode()}
                >
                <div>
                  {header.groups.map((group, i_group) => {
                    // === Groups ===
                    return (
                      <TreeView key={'group-' + i_group} nodeLabel='' nodeText={group.groupName} defaultCollapsed={false}
                        className = 'group'
                        hintText={group.label}
                        onNodeTextChange={(text)=>group.groupName = text}
                        removeNode={()=>this.removeGroup(i_header, i_group, header.groups)}
                        uprankNode={()=>this.reorderGroup(i_header, i_group, header.groups, 'up')}
                        downrankNode={()=>this.reorderGroup(i_header, i_group, header.groups, 'down')}
                        enableReorder={true}
                        ifTopitem={i_group==0}
                        ifBottomitem={i_group==header.groups.length-1}>
                        <div>
                          {group.categories.map((category, i_category) => {
                            // === Categories===
                            return (
                              <TreeView key={'category-' + i_category} nodeLabel='' nodeText={category.categoryName} defaultCollapsed={true}
                                className = 'category'
                                hintText={category.label}
                                onNodeTextChange={(text)=>category.categoryName = text}
                                removeNode={()=>this.removeCategory(i_header, i_group, i_category, group.categories)}
                                uprankNode={()=>this.reorderCategory(i_header,i_group,i_category,group.categories,'up')}
                                downrankNode={()=>this.reorderCategory(i_header,i_group,i_category,group.categories,'down')}
                                enableReorder={true}
                                ifTopitem={i_category==0}
                                ifBottomitem={i_category==group.categories.length-1}>
                                {this.categoryAttributes(i_header, i_group, i_category, category, group.categories)}
                              </TreeView>
                            );
                          })}
                        </div>
                        <NormalFlatButton label={this.props.config.category} icon={<IconAdd color='lightGrey'/>} onClick={()=>this.addCategory(i_header, i_group, group.categories)}/>
                      </TreeView>
                    );
                  })}
                </div>
                <NormalFlatButton label={this.props.config.group} icon={<IconAdd color='lightGrey'/>} onClick={()=>this.addGroup(i_header, header.groups)}/>
              </TreeView>
            );
          })}
        </div>
        <div style={style.buttonContainer}>
          <NormalBigButton onClick={()=>this.props.cancelAction()} label="Cancel" />
          <ActionButton onClick={()=>this.props.saveAction(this.state.dataSource)} label="Save" />
        </div>
      </div>
    );
  }
}

TreeListTemplate.propTypes = {
  dataSource: PropTypes.array.isRequired,
  saveAction: PropTypes.func.isRequired,
  cancelAction: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
	appId: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
};

export default TreeListTemplate;
