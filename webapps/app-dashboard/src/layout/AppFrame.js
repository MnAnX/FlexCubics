import React, { Component } from 'react';

import SideNav from './navigation/SideNav';
import SideNavMobile from './navigation/SideNavMobile';

import colors from '../styles/colors';

const style = {
  container_mobile: {
    display: 'flex',
    flexFlow: 'Column', //Change
  },
  container_desktop: {
    display: 'flex',
    flexFlow: 'row',
  },
	content: {
    margin: 20, //in mobile, change to 0
    width: '100%'
	},
};

export default ({
  children,
  title = 'AdviceCoach',
  targetDevice = 'desktop',
}) => (
	<div style={style.container_mobile}>
		<SideNavMobile title={title} targetDevice={targetDevice}/>
    <div style={style.container_desktop}>
       <SideNav targetDevice={targetDevice}/>
		   <div style={style.content}>
			     {children}
		   </div>
    </div>
	</div>
);
