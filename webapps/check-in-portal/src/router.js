import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {Link} from 'react-router-dom'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import colors from './styles/colors';

import Login from './layout/Login';
import Start from './layout/Start';
import SelectPlaybook from './layout/SelectPlaybook';
import UserCheckIn from './layout/UserCheckIn';
import ThankYou from './layout/ThankYou';

const theme = createMuiTheme({
});

const style = {
  container: {
    fontFamily: 'Questrial',
    color: colors.text,
  },
};

export default () => (
	<MuiThemeProvider muiTheme={theme}>
  	<Router>
      <div style={style.container}>
  			<Route exact path='/' component={Login}/>
        <Route path='/login' component={Login}/>
        <Route path='/start' component={Start}/>
        <Route path='/select' component={SelectPlaybook}/>
        <Route path='/check-in/:appId' component={UserCheckIn}/>
        <Route path='/thank-you/:name' component={ThankYou}/>
      </div>
    </Router>
	</MuiThemeProvider>
);
