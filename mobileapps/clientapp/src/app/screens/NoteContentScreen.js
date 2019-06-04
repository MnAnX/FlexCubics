import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Swipeout from 'react-native-swipeout';

import Container from '../components/Container';
import PrimaryButton from '../components/PrimaryButton';

import { values, filter, get, isEmpty, find, replace } from 'lodash';

import colors from '../styles/colors';
import textStyle from '../styles/text'


class NoteContentScreen extends Component {
  constructor(props) {
    super(props);

    this.editNote = this.editNote.bind(this);
  }

  editNote() {
    this.props.navigation.navigate(
      'EditNote',
      {
        note: this.props.note
      }
    );
  }

  render() {
    return (
      <Container>
        <ScrollView>
          <Text style={textStyle.normalLarge}>{this.props.note.title}</Text>
          <Text style={textStyle.normal}>{this.props.note.content}</Text>
        </ScrollView>
        <PrimaryButton icon='edit' title='Edit' onPress={()=>{this.editNote()}}/>
      </Container>
    );
  }
}

NoteContentScreen.propTypes = {
  note: PropTypes.object.isRequired,
};

import { connect } from 'react-redux';

const mapStateToProps = ({user}, props) => ({
  ...props.navigation.state.params,
  user,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteContentScreen);
