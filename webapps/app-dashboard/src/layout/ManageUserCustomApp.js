import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as customappsActions from '../actions/customapps';

import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import _ from 'lodash';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';
import IconDelete from 'material-ui/svg-icons/action/delete-forever';
import IconAdd from 'material-ui/svg-icons/content/add-box';
import IconNotification from 'material-ui/svg-icons/social/notifications';
import IconNotifyUser from 'material-ui/svg-icons/social/notifications-active';
import IconEmail from 'material-ui/svg-icons/communication/email';
import IconMore from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import moment from 'moment'
import Divider from 'material-ui/Divider';
import IconReport from 'material-ui/svg-icons/editor/insert-chart';

import AppFrame from './AppFrame';
import Title from '../components/common/Title';
import Subtitle from '../components/common/Subtitle';
import InfoText from '../components/common/InfoText';
import NormalFlatButton from '../components/common/NormalFlatButton';
import NormalBigButton from '../components/common/NormalBigButton';
import CategorySelector from './playbook/CategorySelector';
import CustomCategoryEditor from './playbook/CustomCategoryEditor';
import EmailSender from '../components/common/EmailSender';
import PushNotificationSender from '../components/common/PushNotificationSender';
import WrapDialogue from '../components/common/WrapDialogue';
import ActionButton from '../components/common/ActionButton';
import UserAppUsageChart from '../components/charts/UserAppUsageChart';
import Padding from '../components/common/Padding';
import SectionTitle from '../components/common/SectionTitle';

import colors from '../styles/colors';
import layout from '../styles/layout';
import textStyle from '../styles/text';
import { generatePdf } from './utils/pdfUtils'
import config from '../config'
import { getLocalDT } from './utils/timeUtils'

const style = {
  l2Title: {
    fontSize: 20
  },
  playbookContainer: {
    width: '75%',
		borderRadius:16,
    borderWidth: 1,
    borderColor: colors.text,
    padding: 4
  },
};

class ManageUserCustomApp extends Component {
  constructor(props) {
    super(props);

    let appId = props.match.params.appId;
    let userId = props.match.params.userId;
    let appInfo = this.props.apps.appInfos[appId];
    let userInfo = {};
    if(this.props.appusers.appUsers[appId]) {
      userInfo = _.find(this.props.appusers.appUsers[appId], ['userId', parseInt(userId)]).userInfo;
    }
    let userName = userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : userInfo.email;

    this.state = {
      appId,
      userId,
      appInfo,
      userInfo,
      userName,
      customapp: {},
      customappTemplate: {},
      templateCategories: [],
      selectedCategory: {},
      feedbackReportCategories: {},
      width: 0,
      height: 0,
    };

    this.managePlaybook=this.managePlaybook.bind(this);
    this.addLibrary=this.addLibrary.bind(this);
    this.addNewCategory=this.addNewCategory.bind(this);
    this.removeCategory=this.removeCategory.bind(this);
    this.editCategory=this.editCategory.bind(this);
    this.viewCategory=this.viewCategory.bind(this);
    this.editCategoryDialogue=this.editCategoryDialogue.bind(this);
    this.viewCategoryDialogue=this.viewCategoryDialogue.bind(this);
    this.sendEmail=this.sendEmail.bind(this);
    this.sendPushNotification=this.sendPushNotification.bind(this);
    this.feedbackReport = this.feedbackReport.bind(this)
    this.viewFeedback = this.viewFeedback.bind(this)
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

  componentWillMount() {
    this.props.fetchCustomApp(this.state.appId, this.state.userId);
    this.props.getCustomAppTemplate(this.state.appId);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.customapps.customApps[this.state.appId]) {
      let customapp = nextProps.customapps.customApps[this.state.appId][this.state.userId];
      if(customapp) {
        this.setState({customapp});
      }
    }
    let customappTemplate = nextProps.customapps.customAppTemplates[this.state.appId];
    if(customappTemplate) {
      let templateCategories = [];
      customappTemplate.template.groups.forEach((group)=>{
        templateCategories = _.concat(templateCategories, group.categories)
      })
      this.setState({
        customappTemplate,
        templateCategories,
      })
    }
    let appInfo = nextProps.apps.appInfos[this.state.appId];
    if(appInfo) {
      this.setState({appInfo});
    };
    if(nextProps.appusers.appUsers[this.state.appId]) {
      let user = _.find(nextProps.appusers.appUsers[this.state.appId], ['userId', parseInt(this.state.userId)])
      if (user) {
        this.setState({userInfo: user.userInfo})
      }
    }
  }

  sendPushNotification(userName) {
    let windowTitle = `Send Push Notification to ${userName}`;
    return (
      <div>
        <RaisedButton primary={true} label="Send Push Notification" icon={<IconNotification />} onClick={()=>this.refs.sendPushNotificationDialogue.open()}/>
        <WrapDialogue
          ref="sendPushNotificationDialogue"
          title={windowTitle}
          content={
            <PushNotificationSender
              type='user'
              userId={this.props.user.userId}
              //appId={this.state.appId}
              recipientUserId={this.state.userId}
              sender={this.state.appInfo ? this.state.appInfo.author : ""}
              subject={this.state.appInfo ? this.state.appInfo.appName : ""}
              onComplete={()=>this.refs.sendPushNotificationDialogue.close()}
            />
          }
        />
      </div>
    )
  }

  sendEmail(userName) {
    let author = this.state.appInfo ? this.state.appInfo.author : ""
    let senderEmail = `${author} <${this.props.user.email}>`;
    let windowTitle = `Send Email to ${userName}`;
    return (
      <div>
        <RaisedButton primary={true} label="Send Email" icon={<IconEmail />} onClick={()=>this.refs.sendEmailDialogue.open()}/>
        <WrapDialogue
          ref="sendEmailDialogue"
          title={windowTitle}
          content={
            <EmailSender
              type='user'
              userId={this.props.user.userId}
              recipient={this.state.userInfo.email}
              sender={senderEmail}
              subject={this.state.appInfo ? this.state.appInfo.appName : ""}
              onComplete={()=>this.refs.sendEmailDialogue.close()}
            />
          }
        />
      </div>
    )
  }

  managePlaybook() {
    const iconButtonElement = (
      <IconButton touch={true} tooltip="more" tooltipPosition="bottom-left">
        <IconMore />
      </IconButton>
    );
    const rightIconMenu = (category)=>{
      return (
        <IconMenu iconButtonElement={iconButtonElement}>
          <MenuItem onClick={()=>this.editCategory(category)}>Edit</MenuItem>
          <MenuItem onClick={()=>this.removeCategory(category)}>Delete</MenuItem>
        </IconMenu>
      )
    }
    return (
      <div>
        {_.isEmpty(this.state.customapp) && <div>User has not setup customized Playbook yet.</div>}
        {!_.isEmpty(this.state.customapp) &&
          <div>
            <Paper style={style.playbookContainer}>
              <List>
                {_.values(this.state.customapp.categories).map((category)=>{
                  return(
                    <ListItem
                      onClick = {()=>this.viewCategory(category)}
                      primaryText={category.groupName}
                      secondaryText={category.categoryName}
                      rightIconButton={rightIconMenu(category)}
                    />
                  )})}
              </List>
            </Paper>
            <br /><br />
            <div style={layout.common.buttonAlign}>
              {this.addNewCategory()}
              {this.addLibrary()}
              {this.notifyUserToUpdate()}
            </div>
          </div>
        }
      </div>
    )
  }

  removeCategory(category) {
    let categoryId = [category.categoryId];
    this.props.removeCategoriesFromCustomApp(this.state.appId, this.state.userId, this.state.customapp.customAppId, categoryId);
  }

  editCategory(category) {
    this.setState({
      selectedCategory: category,
    })
    this.refs.editCategoryDialogue.open()
  }

  viewCategory(category) {
    this.setState({
      selectedCategory: category,
    })
    this.refs.viewCategoryDialogue.open()
  }

  editCategoryDialogue() {
    return (
      <WrapDialogue
        ref="editCategoryDialogue"
        title='Edit Instruction'
        content={
          <CustomCategoryEditor
            category={this.state.selectedCategory}
            userId={this.state.userId}
            appId={this.state.appId}
            templateId={this.state.customapp.templateId}
            onCancel={()=>this.refs.editCategoryDialogue.close()}
            onSave={(category)=>{
              this.props.editCustomAppCategory(this.state.appId, this.state.userId, this.state.customapp.customAppId, category.categoryId, category);
              this.refs.editCategoryDialogue.close()
            }}
          />
        }
      />
    )
  }

  viewCategoryDialogue() {
    return (
      <WrapDialogue
        ref="viewCategoryDialogue"
        title='View Instruction'
        content={
          <div>
            <CustomCategoryEditor
              category={this.state.selectedCategory}
              userId={this.state.userId}
              appId={this.state.appId}
              templateId={this.state.customapp.templateId}
              readOnly={true}
            />
            {this.viewFeedback()}
            <br />
            <NormalBigButton label="Close" onClick={()=>this.refs.viewCategoryDialogue.close()} />
          </div>
        }
      />
    )
  }

  viewFeedback() {
    if(this.state.selectedCategory.feedbackList && this.state.selectedCategory.feedbackList.length > 0) {
      let feedbackList = this.state.selectedCategory.feedbackList.reverse()
      return (
        <div>
        <div style={textStyle.subtitle}>Feedback</div>
        { feedbackList.map((feedback, i_feedback) => {
          let localDT = getLocalDT(feedback.time)
          return(
            <div>
              <Divider />
              <p>{localDT} - <b style={{color: colors.text}}>{feedback.content}</b></p>
            </div>
          );
        })}
        <Divider />
        </div>
      )
    } else {
      return null
    }
  }

  addLibrary() {
    let categories = _.differenceBy(this.state.templateCategories, _.values(this.state.customapp.categories), 'categoryId')
    const addCategory = (category)=>{
      let categoryId = [category.categoryId];
      this.props.addCategoriesToCustomApp(this.state.appId, this.state.userId, this.state.customapp.customAppId, categoryId);
      this.refs.addLibraryDialogue.close()
    }
    return (
      <div>
        <NormalFlatButton
          icon={<IconAdd />}
          label="Add From Personal Library"
          onClick={()=>this.refs.addLibraryDialogue.open()} />
        <WrapDialogue
          ref="addLibraryDialogue"
          title='Add From Personal Library'
          content={
            <div>
              Click on a category below to add to the Playbook:
              <br />
              <CategorySelector categories={categories} onClick={(category)=>addCategory(category)}/>
              <br />
              <NormalFlatButton label="Cancel" onClick={()=>this.refs.addLibraryDialogue.close()} />
            </div>
          }
        />
      </div>
    )
  }

  addNewCategory() {
    let emptyCategory = {}
    return (
      <div>
        <NormalFlatButton
          icon={<IconAdd />}
          label="Add New Instruction"
          onClick={()=>this.refs.addNewCategoryDialogue.open()} />
        <WrapDialogue
          ref="addNewCategoryDialogue"
          title='New Instruction'
          content={
            <CustomCategoryEditor
              category={emptyCategory}
              userId={this.state.userId}
              appId={this.state.appId}
              templateId={this.state.customapp.templateId}
              onCancel={()=>this.refs.addNewCategoryDialogue.close()}
              onSave={(category)=>{
                this.props.addUserCategoryToCustomApp(this.state.appId, this.state.userId, this.state.customapp.customAppId, category);
                this.refs.addNewCategoryDialogue.close()
              }}
            />
          }
        />
      </div>
    )
  }

  notifyUserToUpdate() {
    let appName = this.state.appInfo ? this.state.appInfo.appName : ""
    let subject=`${appName}: Please Update Your Playbook`
    let text="New instructions are available on your Playbook. To update, please click the [NEW] icon top right on your Playbook screen."
    return (
      <div>
        <NormalFlatButton
          icon={<IconNotifyUser />}
          label="Notify User About The Update"
          onClick={()=>this.refs.notifyUserToUpdateDialogue.open()}
        />
        <WrapDialogue
          ref="notifyUserToUpdateDialogue"
          title="Notify User About The Update"
          content={
            <PushNotificationSender
              type='user'
              userId={this.props.user.userId}
              recipientUserId={this.state.userId}
              sender={this.state.appInfo ? this.state.appInfo.author : ""}
              subject={subject}
              text={text}
              onComplete={()=>this.refs.notifyUserToUpdateDialogue.close()}
            />
          }
        />
      </div>
    )
  }

  feedbackReport() {
    let removeCategoryFromReport = (category)=>{
      let updatedCategories = this.state.feedbackReportCategories;
      _.remove(updatedCategories, function(c) {
        return c.categoryId === category.categoryId;
      })
      this.setState({feedbackReportCategories: updatedCategories})
    }

    let exportFeedbackReport = ()=>{
      // report content
      let reportName = `${this.state.userName} Feedback Report of ${this.state.appInfo.appName}.pdf`
      let reportTitle = "Feedback Report - " + this.state.appInfo.appName + " - " + this.state.userName
      let reportContent = reportTitle + "\n"
      _.forEach(this.state.feedbackReportCategories, function(category) {
        reportContent += "\n----------\n\n"
        reportContent += category.groupName + ": " + category.categoryName + "\n\n"
        if(category.categoryDesc) {
          reportContent += category.categoryDesc + "\n"
        }
        if(category.categoryContent) {
          reportContent += category.categoryContent + "\n"
        }
        reportContent += "\nFeedback\n"
        if(category.feedbackList && category.feedbackList.length > 0) {
          _.forEach(category.feedbackList, function(feedback) {
            let gmtDateTime = moment.utc(feedback.time, "YYYY-MM-DD hh:mmA")
            let localDT = gmtDateTime.local().format('YYYY-MM-DD h:mm A');
            reportContent += feedback.content + "  (" + localDT + ")" + "\n"
          })
        } else {
          reportContent += "None\n"
        }
      });
      // generate report PDF
      generatePdf(reportName, reportContent);
    }

    return (
      <div>
        <RaisedButton
          primary={true}
          label="Feedback Report"
          icon={<IconReport />}
          onClick={()=>{
            this.setState({feedbackReportCategories: _.values(this.state.customapp.categories)})
            this.refs.feedbackReportDialogue.open()
          }}
        />
        <WrapDialogue
          ref="feedbackReportDialogue"
          title='Feedback Report'
          content={
            <div>
              {"Categories to be included in the feedback report:"}
              <br />
              <CategorySelector categories={this.state.feedbackReportCategories} onDelete={(category)=>removeCategoryFromReport(category)}/>
              <br />
              <ActionButton
                label="Export Feedback Report"
                onClick={()=>{exportFeedbackReport()}} />
              <NormalFlatButton label="Cancel" onClick={()=>this.refs.feedbackReportDialogue.close()} />
            </div>
          }
        />
      </div>
    )
  }

  render() {
    let targetDevice = 'desktop';
    if (this.state.width<config.system.mobileScreenWidthThreshold){
        targetDevice = 'mobile';
    }
    return (
      <AppFrame auth={this.props.auth} targetDevice={targetDevice}>
        <div style={layout.common.page}>
          <Title text1='Manage' text2='User' goBack={()=>this.props.history.goBack()}/>
          <br /><br />
          <div style={layout.common.mainContainer}>
            <Subtitle text={this.state.userName} />
            <InfoText label='Email:' value={this.state.userInfo.email} />
            <br />
            <div style={layout.common.row}>
              {this.sendPushNotification(this.state.userName)}
              <Padding width={20}/>
              {this.sendEmail(this.state.userName)}
            </div>
            <br />
            <UserAppUsageChart userId={this.state.userId} appId={this.state.appId}/>
            <Paper style={layout.common.paperContainer}>
              <SectionTitle text='Manage User Playbook'/>
              <InfoText label='Playbook Name:' value={this.state.appInfo ? this.state.appInfo.appName : ""} />
              {this.managePlaybook()}
              {this.editCategoryDialogue()}
              {this.viewCategoryDialogue()}
            </Paper>
            <br />
            <Paper style={layout.common.paperContainer}>
              <SectionTitle text='Reports'/>
              <br />
              {this.feedbackReport()}
            </Paper>
          </div>
        </div>
      </AppFrame>
    );
  }
}

function mapStateToProps({user, apps, appusers, customapps}) {
  return {
    user,
    apps,
    appusers,
    customapps,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...customappsActions }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUserCustomApp);
