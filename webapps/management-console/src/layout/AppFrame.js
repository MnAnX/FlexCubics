import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import SideNav from './navigation/SideNav';

import colors from '../styles/colors';

const style = {
  container: {
    display: 'flex',
    flexFlow: 'row',
    fontFamily: 'Questrial',
    color: colors.text,
  },
	content: {
    margin: 20,
    width: '100%'
	},
};

const mainTheme = getMuiTheme({
  fontFamily: 'Questrial',
	palette: {
		primary1Color: colors.primary,
		accent1Color: colors.accent,
    textColor: colors.text,
	},
  chip: {
    deleteIconColor: colors.text,
  },
});

export default ({children, auth}) => (
	<MuiThemeProvider muiTheme={getMuiTheme(mainTheme)}>
		<div style={style.container}>
			<SideNav auth={auth}/>
			<div style={style.content}>
				{children}
			</div>
		</div>
	</MuiThemeProvider>
);
