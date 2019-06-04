import React, { Component } from 'react';
import { Text } from 'react-native';
import { Provider, connect } from "react-redux";
import { Root } from './router'
import configureStore from "./store";
import { MenuContext } from 'react-native-popup-menu';

Text.defaultProps.allowFontScaling = false;

const store = configureStore();

import colors from './styles/colors';


export default class App extends Component {
  constructor() {
    super();
    console.disableYellowBox = true;
  }

  render() {
    return (
      <Provider store={store}>
        <MenuContext>
          <Root />
        </MenuContext>
      </Provider>
    );
  }
}
