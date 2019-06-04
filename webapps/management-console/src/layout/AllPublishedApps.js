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
import IconButton from 'material-ui/IconButton';
import IconReport from 'material-ui/svg-icons/editor/insert-chart';
import Loader from 'react-loader-advanced';

import AppFrame from './AppFrame';
import Title from '../components/common/Title';
import Subtitle from '../components/common/Subtitle';
import InfoText from '../components/common/InfoText';

import colors from '../styles/colors';
import { getAllPublishedApps } from '../services/actions'

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
    width: '34%'
  },
  ownerColumn: {
    width: '30%'
  },
  buttonColumn: {
    width: '10%'
  },
  titleColumnText: {
    color: colors.primary,
    fontSize: 20,
  },
  timestampColumnText: {
    color: colors.action,
  },
};

class AllPublishedApps extends Component {
  constructor(props) {
    super(props);

    let userId = props.match.params.userId;

    this.state = {
      isLoading: false,
      allApps: [],
    }

    this.viewReport = this.viewReport.bind(this);
  }

  componentWillMount() {
    this.setState({
      isLoading: true,
    });

    // Get all published apps
    getAllPublishedApps((result) => {
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

  viewReport(appId) {
    let link = `/app-report/${appId}`;
    this.props.history.push(link);
  }

  render() {
    return (
      <AppFrame auth={this.props.auth}>
        <div style={style.page}>
        <Loader show={this.state.isLoading} message={'Loading...'}>
          <Title text1='Published' text2='Playbooks'/>
          <br /><br />
          <div style={style.container}>
            <Table styl={style.table}>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn style={style.titleColumn}>Title</TableHeaderColumn>
                  <TableHeaderColumn>Playbook ID</TableHeaderColumn>
                  <TableHeaderColumn style={style.ownerColumn}>Owner</TableHeaderColumn>
                  <TableHeaderColumn>Publish Date</TableHeaderColumn>
                  <TableHeaderColumn style={style.buttonColumn}>Reports</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                { _.values(this.state.allApps).map((app) => (
                  <TableRow>
                    <TableRowColumn style={{...style.titleColumn,...style.titleColumnText}}>{!_.isEmpty(app.appInfo.appName) ? app.appInfo.appName : '(missing)'}</TableRowColumn>
                    <TableRowColumn>{app.appInfo.appId}</TableRowColumn>
                    <TableRowColumn style={style.ownerColumn}>{app.userInfo.email}</TableRowColumn>
                    <TableRowColumn style={style.timestampColumnText}>{app.publishedTime}</TableRowColumn>
                    <TableRowColumn style={style.buttonColumn}>{<IconButton onClick={()=>this.viewReport(app.appInfo.appId)}><IconReport color={colors.primary}/></IconButton>}</TableRowColumn>
                  </TableRow>
                ))
                }
              </TableBody>
            </Table>
          </div>
        </Loader>
        </div>
      </AppFrame>
    );
  }
}

function mapStateToProps({user, users}) {
  return {
    user,
    users,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AllPublishedApps);
