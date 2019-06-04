import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Text, View, TextInput } from 'react-native';
import _ from 'lodash'
import Modal from 'react-native-modalbox';

import ModalButton from '../components/ModalButton';

import modalStyle from '../styles/modal';

export default class InputModal extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    postAction: PropTypes.func.isRequired,
    keyboardType: PropTypes.string,
    confirmText: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.state = {
      input: '',
    };

    this.show = this.show.bind(this)
    this.close = this.close.bind(this)
  }

  show() {
    this.refs.inputModal.open()
  }

  close() {
    this.refs.inputModal.close()
  }

  render() {
    return (
      <Modal
        ref="inputModal"
        coverScreen={true}
        style={[modalStyle.centered, {height: 180}]}
        position={"center"}>
        <Text style={modalStyle.title}>{this.props.title}</Text>
        <View>
          <TextInput
            style={modalStyle.inputBox}
            autoFocus={true}
            keyboardType={this.props.keyboardType}
            returnKeyType='done'
            value={this.state.input}
            onChangeText={(text) => this.setState({input: text})} />
        </View>
        <View style={modalStyle.buttonGroup}>
          <ModalButton label='Cancel' onPress={() => {
            this.setState({input:''});
            this.refs.inputModal.close()
          }}/>
          <ModalButton label={this.props.confirmText ? this.props.confirmText : 'Okay'} onPress={() => {
            this.props.postAction(this.state.input)
            this.setState({input:''});
            this.refs.inputModal.close()
          }}/>
        </View>
      </Modal>
    );
  }
}
