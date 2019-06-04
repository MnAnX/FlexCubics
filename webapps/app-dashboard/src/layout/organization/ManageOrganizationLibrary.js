import React, { Component } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../../actions/apps'

import ScrollArea from 'react-scrollbar'
import { Link } from 'react-router-dom'
import Divider from 'material-ui/Divider'
import _ from 'lodash'

import AppFrame from '../AppFrame'
import TreeListTemplate from '../../components/templates/tree-list/TreeListTemplate'
import NormalBigButton from '../../components/common/NormalBigButton'
import TutorialModal from '../../components/common/TutorialModal';
import InfoDialogue from '../../components/common/InfoDialogue';
import Title from '../../components/common/Title';

import colors from '../../styles/colors'
import layout from '../../styles/layout'
import templates from '../../config/templates'
import tutorial from '../../documents/tutorial'
import info from '../../documents/info'

class ManageOrganizationLibrary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appId: props.match.params.libAppId,
      appInfo: {},
      templateId: 100,
      templateConfig: {},
      appTemplate: {
        groups: [
          {
            categories: [],
          }
        ]
      },
      infoDialogue: {
        title: '',
        content: '',
      }
    };

    this.save = this.save.bind(this);
    this.reloadData = this.reloadData.bind(this);
  }

  componentWillMount() {
    // Get the latest app template from server.
    this.props.getAppTemplate(this.props.userId, this.state.appId, this.state.templateId);
  }

  componentWillReceiveProps(nextProps) {
    let appTemplate = nextProps.apps.appTemplates[this.state.appId];
    if(appTemplate) {
      let templateId = appTemplate.templateId;
      let templateConfig = templates[templateId];
      this.setState({
        appTemplate,
        templateId,
        templateConfig,
      });
    }
  }

  reloadData() {
    let appTemplate = this.props.apps.appTemplates[this.state.appId];
    if(appTemplate) {
      this.setState({
        appTemplate,
      });
    }
  }

  save(appTemplate) {
    this.setState({
      appTemplate
    });

    // validate template
    let isValid = true
    let errMsg = 'Error: We detected categories/subcategories with empty content. Please add content or delete the category/subcategory before saving.'
    appTemplate.groups.forEach((group)=>{
      // check if group name is valid
      if(_.isEmpty(group.groupName)) {
        isValid = false
        return;
      } else {
        // check if all the categories are valid
        group.categories.forEach((category)=>{
          if(_.isEmpty(category.categoryName)) {
            isValid = false
            return;
          }
        })
      }
    })

    if(isValid) {
      // save app template change to server
      this.props.updateAppTemplate(this.props.userId, this.state.appId, appTemplate);
      let link = `/manage-organization`;
      this.props.history.push(link);
    } else {
      // show the error and not save
      this.setState({infoDialogue:{
        title: errMsg,
        content: '',
      }})
      this.refs.infoDialogue.open()
    }
  }

  render() {
    let cancelLink = `/manage-organization`;
    return (
      <AppFrame auth={this.props.auth}>
        <div style={layout.common.page}>
          <Title text1='Manage' text2='Organization Library' goBack={()=>this.props.history.goBack()}/>
          <br />
          <TutorialModal userId={this.props.userId} videoId='add_library_tutorial' title='Watch Tutorial: Manage Library (7 mins)' videoUrl={tutorial.updateAppTemplate} />
          <br />
          <ScrollArea horizontal={false}>
            {this.state.appTemplate &&
              <TreeListTemplate
                config={this.state.templateConfig}
                dataSource={[this.state.appTemplate]}
                saveAction={(dataSource) => {this.save(dataSource[0])}}
                cancelAction={(dataSource) => {
                  this.reloadData()
                  this.props.history.push(cancelLink);
                }}
                userId={this.props.userId}
                appId={this.state.appId}
              />
            }
          </ScrollArea>
          <InfoDialogue ref="infoDialogue" title={this.state.infoDialogue.title} content={this.state.infoDialogue.content}/>
        </div>
      </AppFrame>
    );
  }
}

function mapStateToProps({user, apps}) {
  return {
    userId: user.userId,
    isLodading: apps.isLodading,
    apps,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageOrganizationLibrary);
