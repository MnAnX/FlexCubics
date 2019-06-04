import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-advanced';
import _ from 'lodash';


import AppFrame from './AppFrame';
import Title from '../components/common/Title';
import Subtitle from '../components/common/Subtitle';
import NormalTextField from '../components/common/NormalTextField';
import ActionButton from '../components/common/ActionButton';
import NormalFlatButton from '../components/common/NormalFlatButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import RaiseButton from 'material-ui/RaisedButton';

import colors from '../styles/colors'
import { getUserBehaviorData } from '../services/actions'

const style = {
  page: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  table_options: {
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  table_options_button: {
    backgroundColor: colors.action,
  },
  table_options_button_label: {
    fontSize: 16,
    textTransform: 'none',
    color: 'white'
  },
  table: {
    tableLayout: 'auto'
  },
  userColumn: {
    width: '25%'
  },
  titleColumn: {
    width: '25%'
  },
  userColumnText: {
    color: colors.primary,
  },
  timestampColumnText: {
    color: colors.action,
  },
  table_row_normal: {
    minHeight: 100,
  }
};

const sortOption = {
  UserCreation: 1,
  JoinedPlaybook: 2,
}

class AppUsersBehavior extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      rangeInDays: "7",
      rangeValid: true,
      userBehaviorData: [],
      sortOption: sortOption.UserCreation,
    }

    this.getUserBehaviorDataPresentation = this.getUserBehaviorDataPresentation.bind(this);
    this.SortBehaviorData = this.SortBehaviorData.bind(this);
    this.reverseOrder = this.reverseOrder.bind(this);
  }

  componentWillMount(){
    this.getUserBehaviorDataPresentation();
  }


  handleSortOptionChange = (event, index, value) => {
      this.setState({
        sortOption: value,
      });
      this.SortBehaviorData(value);
      //console.log('Sort Option is: '+value);
      //console.log(this.state.userBehaviorData);
  }

  reverseOrder() {
    let result = this.state.userBehaviorData;
    result.reverse();
    this.setState({
      userBehaviorData: result,
    });
  }

  SortBehaviorData(value=this.state.sortOption){
    let result = this.state.userBehaviorData;
    switch (value) {
      case sortOption.UserCreation:
        result.sort(function compare(a,b){
          var dateA = new Date(a.userCreated)
          var dateB = new Date(b.userCreated)
          return dateB - dateA;
        });
        break;
      case sortOption.JoinedPlaybook:
        result.sort(function compare(a,b){
          var dateA = new Date(a.customAppCreated)
          var dateB = new Date(b.customAppCreated)
          return dateB - dateA;
        });
        break;
      default:
    }
    this.setState({
      userBehaviorData: result,
    });
  }

  getUserBehaviorDataPresentation(){
    let rangeInDays = Number(this.state.rangeInDays);
    //console.log(typeof rangeInDays);
    //console.log(rangeInDays);
    if  (isNaN(rangeInDays) || typeof rangeInDays !== 'number' || rangeInDays <= 0){
      this.setState({
        rangeValid: false
      });
      return 1;
    }
    //console.log("passed");
    this.setState({
      isLoading: true,
      rangeValid: true
    });
    let request = {
      userId: this.props.userId,
      type: "User",
      rangeInDays: rangeInDays,
    }

    getUserBehaviorData(request, (result) => {
      this.setState({
        isLoading: false,
        length: result.userBehaviorData.length,
        userBehaviorData: result.userBehaviorData,
      })
    })
  }

  render(){
    return(
      <AppFrame  auth={this.props.auth}>
        <div style = {style.page}>
          <Loader show={this.state.isLoading} message={'Loading...'}>
            <Title text1='User Behavior: ' text2='Playbook Users'/>
            <br /><br /><br />
            <div style = {style.table_options}>
              <SelectField
                floatingLabelText="Time Period"
                value={this.state.rangeInDays}
                onChange={(event, index, value) => {
                  this.setState({rangeInDays: value});
                }}
              >
                <MenuItem value = {'7'} primaryText = 'One Week'/>
                <MenuItem value = {'14'} primaryText = 'Two Weeks'/>
                <MenuItem value = {'30'} primaryText = 'One Month'/>
                <MenuItem value = {'60'} primaryText = '2 Months'/>
                <MenuItem value = {'90'} primaryText = '3 Months'/>
                <MenuItem value = {'365'} primaryText = 'One Year'/>
              </SelectField>
              <FlatButton
                style = {style.table_options_button}
                labelStyle = {style.table_options_button_label}
                onClick={()=>this.getUserBehaviorDataPresentation()}
                label="Refresh Data"
              />
              <SelectField
                floatingLabelText = "Sort by:"
                value = {this.state.sortOption}
                onChange = {this.handleSortOptionChange}
              >
                <MenuItem value = {sortOption.UserCreation} primaryText="User Creation Time"/>
                <MenuItem value = {sortOption.JoinedPlaybook} primaryText="Time User Joined Playbook"/>
              </SelectField>
              <FlatButton
                style = {style.table_options_button}
                labelStyle = {style.table_options_button_label}
                label = "Reverse Order"
                onClick = {()=>this.reverseOrder()}
              />
            </div>
            <Table>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn>User Name</TableHeaderColumn>
                  <TableHeaderColumn style={style.userColumn}>Email</TableHeaderColumn>
                  <TableHeaderColumn>User Created</TableHeaderColumn>
                  <TableHeaderColumn>Playbook Name</TableHeaderColumn>
                  <TableHeaderColumn>Playbook Added to Shelf</TableHeaderColumn>
                  <TableHeaderColumn>Playbook Setup</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {this.state.userBehaviorData.map((data, i_data) => {
                  return(
                    <TableRow key={'data-'+i_data} style = {style.table_row_normal}>
                      <TableRowColumn style={style.userColumnText}>{data.userInfo.firstName} {data.userInfo.lastName}</TableRowColumn>
                      <TableRowColumn style={{...style.userColumn,...style.userColumnText}}>{data.userInfo.email}</TableRowColumn>
                      <TableRowColumn style={style.timestampColumnText}>{data.userCreated}</TableRowColumn>
                      <TableRowColumn>{data.appInfo.appName}</TableRowColumn>
                      <TableRowColumn>Awaiting Data</TableRowColumn>
                      <TableRowColumn style={style.timestampColumnText}>{data.customAppCreated}</TableRowColumn>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Loader>
        </div>
      </AppFrame>
    )
  }
}

function mapStateToProps({user}) {
  return {
    userId: user.userId,
  }
}

export default connect(mapStateToProps)(AppUsersBehavior);
