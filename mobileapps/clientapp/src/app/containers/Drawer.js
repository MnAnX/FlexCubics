import React, { Component } from 'react';

import { Actions, DefaultRenderer } from 'react-native-router-flux';
import Drawer from 'react-native-drawer';

import SideBar from './SideBar';

export default ({ navigationState: {open, key, children}, onNavigate }) => {
  return (
    <Drawer
      open={open}
      onOpen={() => Actions.refresh({ key, open: true }) }
      onClose={() => Actions.refresh({ key, open: false }) }
      type='displace'
      content={<SideBar />}
      tapToClose={true}
      openDrawerOffset={0.2}
      panCloseMask={0.2}
      negotiatePan={true}
      tweenHandler={ratio => ({
        main: { opacity: Math.max(0.54, 1 - ratio) }
      })}>
      <DefaultRenderer navigationState={children[0]} onNavigate={onNavigate} />
    </Drawer>
  );
};
