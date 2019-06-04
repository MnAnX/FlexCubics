import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
import IconButton from 'material-ui/IconButton';
import IconReport from 'material-ui/svg-icons/editor/insert-chart';
import IconDelete from 'material-ui/svg-icons/action/delete-forever';
import Loader from 'react-loader-advanced';

import AppFrame from './AppFrame';
import Title from '../components/common/Title';

import colors from '../styles/colors';
import { getAllNonPublishedApps } from '../services/actions'

import * as actionCreators from '../actions/apps';
import ActionDialogue from '../components/common/ActionDialogue';

const style = {
  page: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    margin: 10,
    padding: 10,
  },
  table: {
    tableLayout: 'auto'
  },
  titleColumn: {
    width: '30%'
  },
  ownerColumn: {
    width: '24%'
  },
  titleColumnText: {
    color: colors.primary,
    fontSize: 20,
  },
  timestampColumnText: {
    color: colors.action,
  },
};

class NonPublishedApps extends Component {
  constructor(props) {
    super(props);

    let userId = props.match.params.userId;

    this.state = {
      isLoading: false,
      allApps: [],
      removeAppDialogData: {},
    }

    this.removeApp = this.removeApp.bind(this);
    this.removeAppDialog = this.removeAppDialog.bind(this);
  }

  componentWillMount() {
    this.setState({
      isLoading: true,
    });

    // Get all non-published apps
    getAllNonPublishedApps((result) => {
      console.log(result);
      let allApps = _.values(result.apps)
      this.setState({
        isLoading: false,
        allApps,
      });
      allApps.forEach((app)=>{
        this.props.setAppData(app.appInfo.appId, app)
      })
    });
  }

  removeAppDialog() {
    let data = this.state.removeAppDialogData;
    let title = `Remove Playbook: ${data.appName}`

    return (
      <ActionDialogue
        ref="removeAppConfDialogue"
        title={title}
        content='Are you sure you want to remove this Playbook?'
        onConfirm={()=>{
          this.props.invalidateApp(data.userId, data.appId);
          getAllNonPublishedApps((result) => {
            console.log(result);
            let allApps = _.values(result.apps)
            this.setState({
              isLoading: false,
              allApps,
            });
            allApps.forEach((app)=>{
              this.props.setAppData(app.appInfo.appId, app)
            })
          });
        }}
      />
    );
  }

  removeApp(userId, appId, appName) {
    this.setState({
      removeAppDialogData: {userId, appId, appName}
    });
    this.refs.removeAppConfDialogue.open()
  }

  render() {
    return (
      <AppFrame auth={this.props.auth}>
        <div style={style.page}>
        <Loader show={this.state.isLoading} message={'Loading...'}>
          <Title text1='Non-Published' text2='Playbooks'/>
          <br /><br />
          <div style={style.container}>
            <Table styl={style.table}>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn style={style.titleColumn}>Title</TableHeaderColumn>
                  <TableHeaderColumn>Status</TableHeaderColumn>
                  <TableHeaderColumn>Playbook ID</TableHeaderColumn>
                  <TableHeaderColumn style={style.ownerColumn}>Owner</TableHeaderColumn>
                  <TableHeaderColumn>Created Date</TableHeaderColumn>
                  <TableHeaderColumn>Last Updated</TableHeaderColumn>
                  <TableHeaderColumn>Operations</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                { _.values(this.state.allApps).map((app) => (
                  <TableRow>
                    <TableRowColumn style={{...style.titleColumn,...style.titleColumnText}}>{!_.isEmpty(app.appInfo.appName) ? app.appInfo.appName : '(missing)'}</TableRowColumn>
                    <TableRowColumn style={style.timestampColumnText}>{app.appInfo.appStatus}</TableRowColumn>
                    <TableRowColumn>{app.appInfo.appId}</TableRowColumn>
                    <TableRowColumn style={style.ownerColumn}>{app.userInfo ? app.userInfo.email : '(missing)'}</TableRowColumn>
                    <TableRowColumn style={style.timestampColumnText}>{app.createdTime}</TableRowColumn>
                    <TableRowColumn style={style.timestampColumnText}>{app.modifiedTime}</TableRowColumn>
                    <TableRowColumn>
                      {<IconButton onClick={()=>this.removeApp(this.props.userId, app.appInfo.appId, !_.isEmpty(app.appInfo.appName) ? app.appInfo.appName : '(missing)')}><IconDelete color={colors.primary}/></IconButton>}
                    </TableRowColumn>
                  </TableRow>
                ))
                }
              </TableBody>
            </Table>
          </div>
        </Loader>
        {this.removeAppDialog()}
        </div>
      </AppFrame>
    );
  }
}

function mapStateToProps({user, users}) {
  return {
    user,
    users,
    userId: user.userId,
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(NonPublishedApps);
