import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {Link} from 'react-router-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import colors from './styles/colors';

import Login from './layout/Login';
import SignUp from './layout/SignUp';
import Home from './layout/Home';
import UserAppsViewer from './layout/UserAppsViewer';
import AppDetailViewer from './layout/AppDetailViewer';
import CreateNewApp from './layout/CreateNewApp';
import UpdateAppInfo from './layout/UpdateAppInfo';
import UpdateAppTemplate from './layout/UpdateAppTemplate';
import ManageUsers from './layout/ManageUsers';
import ManageUserCustomApp from './layout/ManageUserCustomApp';
import AppSubscription from './layout/AppSubscription';
import ViewOrganizationDetails from './layout/ViewOrganizationDetails';
import ManageOrganization from './layout/ManageOrganization';
import EditOrganizationInfo from './layout/organization/EditOrganizationInfo';
import ManageOrganizationMembers from './layout/organization/ManageOrganizationMembers';
import OrgMemberAppsViewer from './layout/organization/OrgMemberAppsViewer';
import OrgMemberReportViewer from './layout/organization/OrgMemberReportViewer';
import ManageOrganizationLibrary from './layout/organization/ManageOrganizationLibrary';
import MessageInbox from './layout/MessageInbox';

const mainTheme = getMuiTheme({
  fontFamily: 'Questrial',
  textTransform: 'none',
	palette: {
		primary1Color: colors.primary,
		accent1Color: colors.accent,
    textColor: colors.text,
	},
  button: {
    textTransform: 'none',
  },
  chip: {
    deleteIconColor: colors.text,
  },
  dropDownMenu: {
    accentColor: colors.text,
  }
});

const style = {
  container: {
    fontFamily: 'Questrial',
    color: colors.text,
  },
};

export default () => (
	<MuiThemeProvider muiTheme={getMuiTheme(mainTheme)}>
  	<Router>
      <div style={style.container}>
  			<Route exact path='/' component={Login}/>
        <Route path='/login' component={Login}/>
        <Route path='/sign-up' component={SignUp}/>
  			<Route path="/home" component={Home}/>
        <Route path="/view-apps" component={UserAppsViewer}/>
  			<Route path="/view-apps/:userId" component={UserAppsViewer}/>
  			<Route path="/view-app-detail/:appId" component={AppDetailViewer}/>
  			<Route path="/create-app" component={CreateNewApp}/>
  			<Route path="/update-app-info/:appId" component={UpdateAppInfo}/>
  			<Route path="/update-app-template/:appId" component={UpdateAppTemplate}/>
  			<Route path="/manage-users/:appId" component={ManageUsers}/>
  			<Route path="/manage-user-customapp/:appId/:userId" component={ManageUserCustomApp}/>
  			<Route path="/app-subscription/:appId" component={AppSubscription}/>
  			<Route path="/view-organization-details/:orgId" component={ViewOrganizationDetails}/>
  			<Route path="/manage-organization" component={ManageOrganization}/>
  			<Route path="/edit-organization-info" component={EditOrganizationInfo}/>
  			<Route path="/manage-org-members" component={ManageOrganizationMembers}/>
  			<Route path="/org-member-apps/:memberUserId" component={OrgMemberAppsViewer}/>
  			<Route path="/org-member-report/:appId" component={OrgMemberReportViewer}/>
  			<Route path="/manage-org-library/:libAppId" component={ManageOrganizationLibrary}/>
  			<Route path="/message-inbox/:userId" component={MessageInbox}/>
      </div>
    </Router>
	</MuiThemeProvider>
);
