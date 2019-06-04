import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Loader from 'react-loader-advanced';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import AppFrame from './AppFrame';
import NumActiveUsersChart from '../components/charts/NumActiveUsersChart';
import ActiveUsersChart from '../components/charts/ActiveUsersChart';
import Title from '../components/common/Title';
import Subtitle from '../components/common/Subtitle';

import colors from '../styles/colors';
import { getNewCustomAppsData } from '../services/actions'

const style = {
  page: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
  },
  container: {
    margin: 10,
    padding: 10,
  },
  table: {
    tableLayout: 'auto'
  },
  userColumn: {
    width: '24%'
  },
  titleColumn: {
    width: '30%'
  },
  userColumnText: {
    color: colors.primary,
  },
  timestampColumnText: {
    color: colors.action,
  },
};

class ActiveUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      customAppsData: [],
    }
  }

  componentWillMount() {
    this.setState({
      isLoading: true,
    });

    // Get new custom apps data in 7 days
    getNewCustomAppsData(this.props.userId, 7, (result) => {
      this.setState({
        isLoading: false,
        customAppsData: result.customAppsData,
      });
    });
  }

  render() {
    return (
      <AppFrame auth={this.props.auth}>
        <div style={style.page}>
          <Title text1='Active' text2='Users'/>
          <br /><br />
          <div style={style.container}>
            <NumActiveUsersChart />
            <br /><br />
            <Subtitle text='Day-to-day Active Users Stats' />
            <ActiveUsersChart />
            <br /><br />
            <Subtitle text='Users Created Personal Plan during Last 7 Days' />
            <Loader show={this.state.isLoading} message={'Loading...'}>
              <Table styl={style.table}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                  <TableRow>
                    <TableHeaderColumn style={style.userColumn}>User</TableHeaderColumn>
                    <TableHeaderColumn style={style.titleColumn}>Playbook</TableHeaderColumn>
                    <TableHeaderColumn>User Register Date</TableHeaderColumn>
                    <TableHeaderColumn>Personal Plan Created Date</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                  { _.values(this.state.customAppsData).map((data) => (
                    <TableRow>
                      <TableRowColumn style={{...style.userColumn,...style.userColumnText}}>{data.userInfo.email}</TableRowColumn>
                      <TableRowColumn>{data.appInfo.appName}</TableRowColumn>
                      <TableRowColumn style={style.timestampColumnText}>{data.userRegTime}</TableRowColumn>
                      <TableRowColumn style={style.timestampColumnText}>{data.cappCreatedTime}</TableRowColumn>
                    </TableRow>
                  ))
                  }
                </TableBody>
              </Table>
            </Loader>
          </div>
        </div>
      </AppFrame>
    );
  }
}

function mapStateToProps({user, apps, appusers}) {
  return {
    userId: user.userId,
  }
}

export default connect(mapStateToProps)(ActiveUsers);
