import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Auth from './components/auth/Auth';
import colors from './styles/colors'

import App from './layout/App';
import Home from './layout/Home';
// User Data
import UserDataHome from './layout/UserDataHome';
import AppCreators from './layout/AppCreators';
import UserAppsViewer from './layout/UserAppsViewer';
import AppReportViewer from './layout/AppReportViewer';
import ReportDetailViewer from './layout/ReportDetailViewer';
import NewUsers from './layout/NewUsers';
import ActiveUsers from './layout/ActiveUsers';
// App Data
import AppDataHome from './layout/AppDataHome';
import AllPublishedApps from './layout/AllPublishedApps';
import NonPublishedApps from './layout/NonPublishedApps';
// System Data
import SystemDataHome from './layout/SystemDataHome';
import TutorialWatchStats from './layout/TutorialWatchStats';
// Manage App
import AppManagementHome from './layout/AppManagementHome'
// Organizations
import OrganizationsHome from './layout/OrganizationsHome'
import CreateNewOrganization from './layout/CreateNewOrganization'
import AppUsersBehavior from './layout/AppUsersBehavior'
import AppCreatorsBehavior from './layout/AppCreatorsBehavior'

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
	if (/access_token|id_token|error/.test(nextState.location.hash)) {
		auth.handleAuthentication();
	}
}

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }}/>
  );
}

export default () => (
	<Router>
		<Switch>
			<PropsRoute path="/user-data-home" component={UserDataHome} auth={auth}/>
			<PropsRoute path="/app-creators" component={AppCreators} auth={auth}/>
			<PropsRoute path="/view-user-apps/:userId" component={UserAppsViewer} auth={auth}/>
			<PropsRoute path="/app-report/:appId" component={AppReportViewer} auth={auth}/>
			<PropsRoute path="/report-detail/:appId/:userId" component={ReportDetailViewer} auth={auth}/>
			<PropsRoute path="/new-users" component={NewUsers} auth={auth}/>
			<PropsRoute path="/app-users-behavior" component={AppUsersBehavior} auth={auth}/>
			<PropsRoute path="/app-creators-behavior" component={AppCreatorsBehavior} auth={auth}/>
			<PropsRoute path="/active-users" component={ActiveUsers} auth={auth}/>
			<PropsRoute path="/app-data-home" component={AppDataHome} auth={auth}/>
			<PropsRoute path="/all-published-apps" component={AllPublishedApps} auth={auth}/>
			<PropsRoute path="/non-published-apps" component={NonPublishedApps} auth={auth}/>
			<PropsRoute path="/app-management-home" component={AppManagementHome} auth={auth}/>
			<PropsRoute path="/system-data-home" component={SystemDataHome} auth={auth}/>
			<PropsRoute path="/tutorial-watch-stats" component={TutorialWatchStats} auth={auth}/>
			<PropsRoute path="/organizations-home" component={OrganizationsHome} auth={auth}/>
			<PropsRoute path="/create-new-organization" component={CreateNewOrganization} auth={auth}/>
			<Route path="/" render={(props) => {
						handleAuthentication(props);
						return <App auth={auth} />
					}}/>
		</Switch>
	</Router>
);
