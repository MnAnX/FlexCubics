import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet } from 'react-native'
import _ from 'lodash'

import QRCodeScanner from 'react-native-qrcode-scanner';

const style = StyleSheet.create({
  container: {
    flex: 1
  },
});


class QrCodeScannerScreen extends Component {
  constructor(props) {
    super(props);

    this.read = this.read.bind(this);
  }

  read(value) {
    this.props.navigation.state.params.funcRead(value);
    //this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={style.container}>
        <QRCodeScanner onRead={(value)=>this.read(value)}/>
      </View>
    );
  }
}

const mapStateToProps = ({ user }, props) => ({
  ...props.navigation.state.params,
  user,
});

export default connect(mapStateToProps)(QrCodeScannerScreen);
