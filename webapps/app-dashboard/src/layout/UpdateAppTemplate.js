import React, { Component } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../actions/apps'

import ScrollArea from 'react-scrollbar'
import { Link } from 'react-router-dom'
import Divider from 'material-ui/Divider'
import _ from 'lodash'
import Loader from 'react-loader-advanced';

import AppFrame from './AppFrame'
import LibraryManager from './playbook/library/LibraryManager'
import LibraryInitializer from './playbook/library/LibraryInitializer'
import AccentButton from '../components/common/AccentButton'
import NormalBigButton from '../components/common/NormalBigButton'
import InfoDialogue from '../components/common/InfoDialogue';
import Title from '../components/common/Title';

import colors from '../styles/colors'
import layout from '../styles/layout'
import templates from '../config/templates'
import info from '../documents/info'

import config from '../config'

class UpdateAppTemplate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appId: props.match.params.appId,
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
      width: 0,
      height: 0,
      infoDialogue: {
        title: '',
        content: '',
      }
    };

    this.save = this.save.bind(this);
    this.reloadData = this.reloadData.bind(this);
    this.onInitializerSubmit = this.onInitializerSubmit.bind(this)
  }

  componentWillMount() {
    // Get the latest app template from server.
    this.props.getAppTemplate(this.props.userId, this.state.appId, 100);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
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
    let errMsg = 'We found that some of the categories/instructions are empty. Please remove those empty nodes before saving.'
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
      this.refs.saveDialogue.setPostAction(()=>{
        let link = `/view-app-detail/${this.state.appId}`;
        this.props.history.push(link);
      })
      this.refs.saveDialogue.open()
    } else {
      // show the error and not save
      this.setState({infoDialogue:{
        title: errMsg,
        content: '',
      }})
      this.refs.infoDialogue.open()
    }
  }

  onInitializerSubmit(fields) {
    let groups = []
    fields.forEach((field)=>{
      let newGroup = {
        groupName: field,
        categories: [{categoryName: ''}],
      }
      groups.push(newGroup)
    })
    let appTemplate = this.state.appTemplate
    appTemplate.groups = groups
    // save app template change to server
    this.props.updateAppTemplate(this.props.userId, this.state.appId, appTemplate);
  }

  render() {
    let cancelLink = `/view-app-detail/${this.state.appId}`;
    let targetDevice = 'desktop';
    if (this.state.width<config.system.mobileScreenWidthThreshold){
        targetDevice = 'mobile';
    }
    let initialized = this.state.appTemplate && this.state.appTemplate.groups && (this.state.appTemplate.groups.length > 0)
    return (
      <AppFrame auth={this.props.auth} title='Add Content' targetDevice={targetDevice}>
        <div style={layout.common.page}>
          <Loader show={this.props.apps.isLoading} message={'Loading...'}>
          <Title text1='Manage' text2='Playbook App Library' goBack={()=>this.props.history.goBack()}/>
          <br />
          {!initialized && <LibraryInitializer onSubmit={(fields)=>this.onInitializerSubmit(fields)} />}
          {initialized && <div>
            <ScrollArea horizontal={false}>
              {this.state.appTemplate &&
                <LibraryManager
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
            <InfoDialogue ref="saveDialogue" title={info.modalUpdateAppTemplate.title} content={info.modalUpdateAppTemplate.content}/>
            <InfoDialogue ref="infoDialogue" title={this.state.infoDialogue.title} content={this.state.infoDialogue.content}/>
          </div>}
          </Loader>
        </div>
      </AppFrame>
    );
  }
}

function mapStateToProps({user, apps}) {
  return {
    userId: user.userId,
    apps,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateAppTemplate);
