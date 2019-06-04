import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/organization';

import { Link } from 'react-router-dom'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import _ from 'lodash';
import IconButton from 'material-ui/IconButton';
import IconReport from 'material-ui/svg-icons/editor/insert-chart';
import Avatar from 'material-ui/Avatar';
import Loader from 'react-loader-advanced';
import IconEmail from 'material-ui/svg-icons/communication/email';

import AppFrame from '../AppFrame';
import Title from '../../components/common/Title';
import Subtitle from '../../components/common/Subtitle';
import WrapDialogue from '../../components/common/WrapDialogue';
import NormalFlatButton from '../../components/common/NormalFlatButton';
import EmailSender from '../../components/common/EmailSender';

import colors from '../../styles/colors';
import layout from '../../styles/layout';
import config from '../../config'

import { getOrganizationMemberApps } from '../../services/directcalls';

const style = {
  table: {
    tableLayout: 'auto'
  },
  titleColumn: {
    width: '28%'
  },
  statusColumn: {
    width: '12%'
  },
  buttonColumn: {
    width: '10%'
  },
  titleColumnText: {
    color: colors.primary,
    fontSize: 20,
  },
  statusColumnText: {
    color: colors.action,
    fontSize: 16,
  },
  avatar: {
    margin: 5,
  }
};

class OrgMemberAppsViewer extends Component {
  constructor(props) {
    super(props);

    let memberUserId = props.match.params.memberUserId;
    let memberInfo = _.find(this.props.organization.members, ['userId', parseInt(memberUserId)]).userInfo;
    this.state = {
      isLoading: false,
      memberUserId,
      memberInfo,
      apps: [],
    }

    this.viewReport = this.viewReport.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.ResponsiveTable = this.ResponsiveTable.bind(this);
  }

  componentWillMount() {
    this.setState({
      isLoading: true,
    });
    getOrganizationMemberApps(this.state.memberUserId, (ret)=>{
      this.setState({
        isLoading: false,
        apps: ret.apps,
      });
    })
  }

  viewReport(appId) {
    let link = `/org-member-report/${appId}`;
    this.props.history.push(link);
  }

  sendEmail() {
    return (
      <div>
        <NormalFlatButton
          icon={<IconEmail />}
          label="Send Email"
          onClick={()=>this.refs.sendEmailDialogue.open()} />
        <WrapDialogue
          ref="sendEmailDialogue"
          title='Send Email'
          content={
            <EmailSender
              type='user'
              userId={this.props.user.userId}
              recipient={this.state.memberInfo.email}
              sender={this.props.user.userInfo.email}
              onComplete={()=>this.refs.sendEmailDialogue.close()}
            />
          }
        />
      </div>
    )
  }

  ResponsiveTable() {
    return (
      <div>
        Published Playbook Apps:
        <Table style={style.table} selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn style={style.titleColumn}>Creator</TableHeaderColumn>
              <TableHeaderColumn style={style.statusColumn}>Playbook Code</TableHeaderColumn>
              <TableHeaderColumn style={style.buttonColumn}>Reports</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            { _.values(this.state.apps).map((app) => {
              let isAppPublished = (app.appStatus === 'Editing' || app.appStatus === 'Testing') ? false : true;
              return (
                <div>
                  {isAppPublished && <TableRow>
                    <TableRowColumn style={{...style.titleColumn,...style.titleColumnText}}>{!_.isEmpty(app.author) ? app.author : '(missing)'}</TableRowColumn>
                    <TableRowColumn style={{...style.statusColumn,...style.statusColumnText}}>{app.appId}</TableRowColumn>
                    <TableRowColumn style={style.buttonColumn}>{<IconButton onClick={()=>this.viewReport(app.appId)}><IconReport color={colors.primary} /></IconButton>}</TableRowColumn>
                  </TableRow>}
                </div>
            )})
            }
          </TableBody>
        </Table>
      </div>
    )
  }

  render() {
    let memberName = this.state.memberInfo.lastName ? `${this.state.memberInfo.firstName} ${this.state.memberInfo.lastName}` : this.state.memberInfo.email;
    return(
      <AppFrame auth={this.props.auth}>
        <div style={layout.common.page}>
          <Title text1='Organization Member' text2='Playbook Apps' goBack={()=>this.props.history.goBack()}/>
          <br />
          <div style={layout.common.detailsContainer}>
            <Avatar style={style.avatar}
              src={this.state.memberInfo.profilePhotoUrl}
              size={80}
            />
            <Subtitle text={memberName} />
            <br />
            <div style={layout.common.buttonAlign}>
              {this.sendEmail()}
            </div>
          </div>
          <br /><br />
          <div style={layout.common.mainContainer}>
            <Loader show={this.state.isLoading} message={'Loading...'}>
              {this.ResponsiveTable()}
            </Loader>
          </div>
        </div>
      </AppFrame>
    );
  }
}

function mapStateToProps({user, organization}) {
  return {
    user,
    organization,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(OrgMemberAppsViewer);
