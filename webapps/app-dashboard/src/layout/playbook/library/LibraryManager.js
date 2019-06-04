import React from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import IconAdd from 'material-ui/svg-icons/content/add-circle-outline';
import _ from 'lodash'

import NormalFlatButton from '../../../components/common/NormalFlatButton';
import DeleteButton from '../../../components/common/DeleteButton';
import NormalTextField from '../../../components/common/NormalTextField';
import SmallAddButton from '../../../components/common/SmallAddButton';
import NormalBigButton from '../../../components/common/NormalBigButton';
import ActionButton from '../../../components/common/ActionButton'
import VideoPicker from '../../../components/common/VideoPicker';
import ImagePicker from '../../../components/common/ImagePicker';
import FilePicker from '../../../components/common/FilePicker';
import AddFieldWrap from '../../../components/common/AddFieldWrap';
import Padding from '../../../components/common/Padding';

import ContentNode from './ContentNode';
import InstructionEditor from './InstructionEditor';

import colors from '../../../styles/colors'
import layout from '../../../styles/layout'
import help from '../../../documents/help'

import urlUtils from '../../utils/urlUtils'

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
  treeButton: {
    marginLeft: 50,
    marginTop: 20
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

class LibraryManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: props.dataSource,
    }

    this.renderContentTree = this.renderContentTree.bind(this)
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
      categories: [{
        label: this.props.config.categoryLabel,
        categoryName: '',
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
    let ds = this.state.dataSource;
    let newCategories = _.slice(categories);
    if (direction==='up'){
      if (i_category > 0){
        // swap the category with the one above it
        let temp = categories[i_category-1];
        newCategories[i_category-1] = categories[i_category];
        newCategories[i_category] = temp;
      } else {
        // move the category into the upper group
        ds[i_header].groups[i_group-1].categories.push(categories[i_category])
        _.pullAt(newCategories, [i_category]);
      }
    }
    else if (direction==='down'){
      if (i_category < (categories.length-1)){
        // swap the category with the one below it
        let temp = categories[i_category+1];
        newCategories[i_category+1] = categories[i_category];
        newCategories[i_category] = temp;
        ds[i_header].groups[i_group].categories = newCategories;
      } else {
        // move the category into the lower group
        ds[i_header].groups[i_group+1].categories.push(categories[i_category])
        _.pullAt(newCategories, [i_category]);
      }
    }

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

  // === Main ===

  renderContentTree() {
    return (
      <div>
        <div>
          {this.state.dataSource.map((header, i_header) => {
            // === Header ===
            return (
              <ContentNode key={'header-' + i_header} expanded={true}
                className = 'header'
                onNodeTextChange={(text)=>header.header = text}
                removeNode={()=>{}}
                >
                <div>
                  {header.groups.map((group, i_group) => {
                    // === Groups (aka. categories)===
                    let isTopGroup = i_group==0
                    let isBottomGroup = i_group==header.groups.length-1
                    return (
                      <ContentNode key={'category-' + i_group} nodeText={group.groupName} expanded={true}
                        className = 'category'
                        displayName='Category'
                        hintText="Enter Category Name"
                        onNodeTextChange={(text)=>group.groupName = text}
                        removeNode={()=>this.removeGroup(i_header, i_group, header.groups)}
                        uprankNode={()=>this.reorderGroup(i_header, i_group, header.groups, 'up')}
                        downrankNode={()=>this.reorderGroup(i_header, i_group, header.groups, 'down')}
                        enableReorder={true}
                        ifTopitem={isTopGroup}
                        ifBottomitem={isBottomGroup}
                        childMarginOffset={60}>
                        <div>
                          {group.categories.map((category, i_category) => {
                            // === Categories (aka. instructions)===
                            let isTopCategory = i_category==0
                            let isBottomCategory = i_category==group.categories.length-1
                            return (
                              <ContentNode key={'instruction-' + i_category} nodeLabel='Instruction: ' nodeText={category.categoryName} expanded={_.isEmpty(category.categoryName)}
                                className = 'instruction'
                                displayName='Instruction'
                                hintText="Enter Instruction Name"
                                onNodeTextChange={(text)=>category.categoryName = text}
                                removeNode={()=>this.removeCategory(i_header, i_group, i_category, group.categories)}
                                uprankNode={()=>this.reorderCategory(i_header,i_group,i_category,group.categories,'up')}
                                downrankNode={()=>this.reorderCategory(i_header,i_group,i_category,group.categories,'down')}
                                enableReorder={true}
                                ifTopitem={isTopCategory && isTopGroup}
                                ifBottomitem={isBottomCategory && isBottomGroup}
                                childMarginOffset={60} >
                                <InstructionEditor userId={this.props.userId} appId={this.props.appId} category={category} onChange={(updatedCategory)=>{this.updateCategory(i_header, i_group, i_category, category, updatedCategory)}}/>
                              </ContentNode>
                            );
                          })}
                        </div>
                        <RaisedButton primary={true} style={style.treeButton} label='New Instruction' icon={<IconAdd/>} onClick={()=>this.addCategory(i_header, i_group, group.categories)}/>
                      </ContentNode>
                    );
                  })}
                </div>
                <RaisedButton secondary={true} style={style.treeButton} label='New Category' icon={<IconAdd/>} onClick={()=>this.addGroup(i_header, header.groups)}/>
              </ContentNode>
            );
          })}
        </div>
        <div style={style.buttonContainer}>
          <NormalBigButton onClick={()=>this.props.cancelAction()} label="Cancel" />
          <ActionButton onClick={()=>this.props.saveAction(this.state.dataSource)} label="Save" />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderContentTree()}
      </div>
    );
  }
}

LibraryManager.propTypes = {
  dataSource: PropTypes.array.isRequired,
  saveAction: PropTypes.func.isRequired,
  cancelAction: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
	appId: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
};

export default LibraryManager;
