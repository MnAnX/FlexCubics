import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/apps';

import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import _ from 'lodash';
import Loader from 'react-loader-advanced';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';
import IconDelete from 'material-ui/svg-icons/action/delete-forever';
import IconManageUsers from 'material-ui/svg-icons/social/people';
import IconAddUser from 'material-ui/svg-icons/social/person-add';
import IconSubscription from 'material-ui/svg-icons/action/card-membership';
import IconDashboard from 'material-ui/svg-icons/action/dashboard';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import IconMore from 'material-ui/svg-icons/navigation/more-horiz';
import IconMenu from 'material-ui/IconMenu';

import AppFrame from './AppFrame';
import NormalBigButton from '../components/common/NormalBigButton';
import Title from '../components/common/Title';
import ActionDialogue from '../components/common/ActionDialogue';
import InviteUser from '../components/common/InviteUser';
import WrapDialogue from '../components/common/WrapDialogue';
import NormalTextField from '../components/common/NormalTextField';

import colors from '../styles/colors';
import layout from '../styles/layout';

import config from '../config'

const DesktopStyle = {
  page: layout.common.page,
  container: {
    margin: 10,
    padding: 10,
  },
  table: {
    tableLayout: 'auto'
  },
  titleColumn: {
    width: '40%'
  },
  codeColumn: {
    width: '12%',
  },
  buttonColumn: {
    width: '12%'
  },
  titleColumnText: {
    fontSize: 20,
  },
  codeColumnText: {
    fontSize: 18,
    color: colors.action,
  },
};

const MobileStyle = {
  page: layout.common.page,
  container: {
    padding: 10,
  },
  table: {
    tableLayout: 'auto',
    width: '100%'
  },
  titleColumn: {
    width: '30%',
    fontSize: '20'
  },
  tableColumn: {
    textAlign: 'left'
  },
};

class UserAppsViewer extends Component {
  constructor(props) {
    super(props);

    let userId = props.match.params.userId;

    this.state = {
      userId,
      appInfos: {},
      selectedAppId: -1,
      cloneAppInfo: {},
      removeAppDialogData: {},
      popoverOpen: false,
      popoverAnchorEl: null,
      currentApp: null,
      width: 0,
      height: 0,
    }

    this.editApp = this.editApp.bind(this);
    this.manageUsers = this.manageUsers.bind(this);
    this.subscription = this.subscription.bind(this);
    this.removeApp = this.removeApp.bind(this);
    this.removeAppDialog = this.removeAppDialog.bind(this);
    this.MobileListRow = this.MobileListRow.bind(this);
    this.ResponsiveTable = this.ResponsiveTable.bind(this);
    this.inviteUser = this.inviteUser.bind(this)
    this.cloneApp = this.cloneApp.bind(this)
    this.cloneAppDialogue = this.cloneAppDialogue.bind(this)
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
    if(this.state.userId && this.state.userId > 0) {
      this.props.getUserApps(this.state.userId); // use this.state.userId to fix loading at refresh (rehydrate after request)
    } else {
      if(this.props.userId && this.props.userId > 0) {
        this.setState({userId: this.props.userId})
        this.props.getUserApps(this.props.userId);
      } else {
        // wait for login to complete and user Id come in
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if(!this.state.userId || this.state.userId < 1) {
      // was waiting for userId, now set userId and request to get appInfo
      if(nextProps.user.userId || nextProps.user.userId > 0) {
        this.setState({userId: nextProps.user.userId})
        this.props.getUserApps(nextProps.user.userId);
      }
    } else {
      this.setState({
        appInfos: nextProps.apps.appInfos,
      });
    }
  }

  editApp(appId) {
    let link = `/view-app-detail/${appId}`;
    this.props.history.push(link);
  }

  manageUsers(appId) {
    let link = `/manage-users/${appId}`;
    this.props.history.push(link);
  }

  inviteUser(appId) {
    this.setState({
      selectedAppId: appId
    });
    this.refs.inviteUserDialogue.open()
  }

  inviteUserDialogue() {
    return (
      <WrapDialogue
        ref="inviteUserDialogue"
        title="Invite Patients/Clients to use your Playbook"
        content={
          <div>
            <div>{"We will send them an email invitation to join your Playbook App:"}</div>
            <InviteUser
              userId={this.props.userId}
              appId={this.state.selectedAppId}
              onComplete={()=>this.refs.inviteUserDialogue.close()}
            />
          </div>
        }
      />
    )
  }

  subscription(appId) {
    let link = `/app-subscription/${appId}`;
    this.props.history.push(link);
  }

  removeApp(userId, appId, appName) {
    this.setState({
      removeAppDialogData: {userId, appId, appName}
    });
    this.refs.removeAppConfDialogue.open()
  }

  cloneApp(appId, appInfo) {
    this.setState({
      selectedAppId: appId,
      cloneAppInfo: appInfo,
    });
    this.refs.cloneAppDialogue.open()
  }

  cloneAppDialogue() {
    const setCloneAppInfo = (event)=>{
      let cloneAppInfo = Object.assign({}, this.state.cloneAppInfo, {
        [event.target.name]: event.target.value
      });
      this.setState({cloneAppInfo})
    }
    return (
      <ActionDialogue
        ref="cloneAppDialogue"
        title="Clone Playbook"
        content={
          <div>
            <NormalTextField
              floatingLabelText="Playbook App Name"
              name="appName"
              fullWidth={true}
              errorText={_.isEmpty(this.state.cloneAppInfo.appName) ? "This field is required" : ""}
              value={this.state.cloneAppInfo.appName}
              onChange={(event)=>setCloneAppInfo(event)}/>
            <NormalTextField
              floatingLabelText="Provider"
              name="author"
              fullWidth={true}
              errorText={_.isEmpty(this.state.cloneAppInfo.author) ? "This field is required" : ""}
              value={this.state.cloneAppInfo.author}
              onChange={(event)=>setCloneAppInfo(event)}/>
          </div>
        }
        onConfirm={()=>this.props.cloneApp(this.props.userId, this.state.selectedAppId, this.state.cloneAppInfo)}
      />
    )
  }

  removeAppDialog() {
    let data = this.state.removeAppDialogData;
    let title = `Remove Playbook: ${data.appName}`

    return (
      <ActionDialogue
        ref="removeAppConfDialogue"
        title={title}
        content='Are you sure you want to remove this Playbook?'
        onConfirm={()=>this.props.invalidateApp(data.userId, data.appId)}
      />
    );
  }

  handlePopoverClose = () => {
    this.setState({
      popoverOpen: false,
      popoverAnchorEl: null,
    });
  }

  MobileListRow(myapp, style){
    var appListItem = (
      <ListItem
        onClick={(event) => {
          event.preventDefault();
          this.setState({
              popoverOpen: true,
              popoverAnchorEl: event.currentTarget,
              currentApp: myapp,
          });
        }}
        primaryText={!_.isEmpty(myapp.appName) ? myapp.appName : '(missing)'}
        style={style.tableColumn}
      />
    );
    return(
      <div>
        {appListItem}
      </div>
    );
  }

  ResponsiveTable(style, targetDevice){
    if (targetDevice==='mobile')return(
      <div>
        <List>
          <Subheader>Title</Subheader>
          { _.values(this.props.apps.appInfos).map((app) => (
            <div>
              {this.MobileListRow(app,style)}
            </div>
          ))
          }
          <Popover
            open = {this.state.popoverOpen}
            anchorEl = {this.state.popoverAnchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose = {this.handlePopoverClose}
          >
            <Menu>
              <MenuItem primaryText="Edit App" onClick={()=>this.editApp(this.state.currentApp.appId)}/>
              <MenuItem primaryText="Manage Users" onClick={()=>this.manageUsers(this.state.currentApp.appId)}/>
              <MenuItem primaryText="Remove App" onClick={()=>{
                this.handlePopoverClose();
                this.removeApp(this.props.userId, this.state.currentApp.appId, this.state.currentApp.appName);
              }}/>
            </Menu>
          </Popover>
        </List>
      </div>
    );
    else {
      const moreMenu = (app)=>{
        return (
          <IconMenu iconButtonElement={<IconMore color={colors.primary}/>}>
            <MenuItem onClick={()=>this.subscription(app.appId)}>Subscription</MenuItem>
            <MenuItem onClick={()=>this.cloneApp(app.appId, app)}>Clone</MenuItem>
            <MenuItem onClick={()=>this.removeApp(this.props.userId, app.appId, app.appName)}>Delete</MenuItem>
          </IconMenu>
        )
      }
      return(
        <div>
          <Table style={style.table} selectable={false}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn style={style.titleColumn}>Title</TableHeaderColumn>
                <TableHeaderColumn style={style.codeColumn}>Playbook Code</TableHeaderColumn>
                <TableHeaderColumn style={style.buttonColumn}>Dashboard</TableHeaderColumn>
                <TableHeaderColumn style={style.buttonColumn}>Manage Users</TableHeaderColumn>
                <TableHeaderColumn style={style.buttonColumn}>Invite People</TableHeaderColumn>
                <TableHeaderColumn style={style.buttonColumn}>More</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              { _.values(this.state.appInfos).map((app) => {
                return (
                  <TableRow>
                    <TableRowColumn style={{...style.titleColumn,...style.titleColumnText}}><div onClick={()=>this.editApp(app.appId)}>{!_.isEmpty(app.appName) ? app.appName : '(missing)'}</div></TableRowColumn>
                    <TableRowColumn style={{...style.codeColumn,...style.codeColumnText}}>{app.appId}</TableRowColumn>
                    <TableRowColumn style={style.buttonColumn}>{<IconButton onClick={()=>this.editApp(app.appId)}><IconEdit color={colors.primary}/></IconButton>}</TableRowColumn>
                    <TableRowColumn style={style.buttonColumn}>{<IconButton onClick={()=>this.manageUsers(app.appId)}><IconManageUsers color={colors.primary}/></IconButton>}</TableRowColumn>
                    <TableRowColumn style={style.buttonColumn}>{<IconButton onClick={()=>this.inviteUser(app.appId)}><IconAddUser color={colors.primary}/></IconButton>}</TableRowColumn>
                    <TableRowColumn style={style.buttonColumn}>{moreMenu(app)}</TableRowColumn>
                  </TableRow>
              )})
              }
            </TableBody>
          </Table>
        </div>
      );
    }
  }

  render() {
    let targetDevice = 'desktop';
    let style = DesktopStyle;
    if (this.state.width<config.system.mobileScreenWidthThreshold){
        targetDevice = 'mobile';
        style = MobileStyle;
    }
    return(
      <AppFrame auth={this.props.auth} title='My Playbook Apps' targetDevice={targetDevice}>
        <div style={style.page}>
          <Loader show={this.props.apps.isLoading} message={'Loading...'}>
          <Title text1='My' text2='Playbook Apps'/>
          <div style={style.container}>
            {this.ResponsiveTable(style, targetDevice)}
          </div>
          <div style={layout.common.buttonsContainer}>
            <Link to="/create-app">
              <NormalBigButton label="+  Create New Playbook" buttonWidth= '300'/>
            </Link>
          </div>
          {this.removeAppDialog()}
          {this.inviteUserDialogue()}
          {this.cloneAppDialogue()}
          </Loader>
        </div>
      </AppFrame>
    );
  }
}

function mapStateToProps({user, apps}) {
  return {
    userId: user.userId,
    user,
    apps,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAppsViewer);
