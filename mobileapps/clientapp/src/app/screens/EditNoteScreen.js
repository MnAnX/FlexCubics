import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ScrollView, View, Text, StyleSheet, TextInput } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'

import Container from '../components/Container';
import AccentButton from '../components/AccentButton';
import Padding from '../components/Padding';

import { isEmpty } from 'lodash';

import colors from '../styles/colors';
import textStyle from '../styles/text'

const style = StyleSheet.create({
  contentTextArea: {
    height: 300,
    fontSize: 16,
    color: 'dimgrey',
    margin: 20,
    padding: 10,
    borderColor: 'lightgray',
    borderRadius: 8,
    borderWidth: 2,
  }
})

class EditNoteScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isNew: true,
      title: '',
      content: '',
    }

    this.renderEditTitle = this.renderEditTitle.bind(this);
    this.renderEditContent = this.renderEditContent.bind(this);
    this.saveNote = this.saveNote.bind(this);
  }

  componentWillMount() {
    if(this.props.note) {
      this.setState({
        isNew: false,
        title: this.props.note.title,
        content: this.props.note.content
      })
    }
  }

  renderEditTitle() {
    return (
      <View>
        <FormLabel>Title</FormLabel>
        <FormInput value={this.state.title} onChangeText={(text)=>this.setState({title: text})}/>
      </View>
    );
  }

  renderEditContent() {
    return (
      <View style={{flex: 1}}>
        <FormLabel>Note</FormLabel>
        <TextInput
          style={style.contentTextArea}
          onChangeText={(text) => this.setState({content: text})}
          value={this.state.content}
          editable = {true}
          multiline = {true}
        />
      </View>
    );
  }

  saveNote() {
    if(this.state.isNew) {
      // add new note
      let note = {
        title: this.state.title,
        content: this.state.content,
      };
      this.props.addUserNote(this.props.user.userId, note);
    } else {
      // update note
      let note = {
        id: this.props.note.id,
        title: this.state.title,
        content: this.state.content,
      };
      this.props.updateUserNote(this.props.user.userId, this.props.note.id, note);
    }
    // go back to notes screen
    this.props.navigation.navigate(
      'Notes'
    );
  }

  render() {
    return (
      <Container>
        <AccentButton title='Save' onPress={()=>{this.saveNote()}} disabled={isEmpty(this.state.title)}/>
        <ScrollView>
          {this.renderEditTitle()}
          {this.renderEditContent()}
          <Padding height={300}/>
        </ScrollView>
      </Container>
    );
  }
}

EditNoteScreen.propTypes = {
  note: PropTypes.object,
};

import { connect } from 'react-redux';
import { addUserNote, updateUserNote } from '../actions/notes';

const mapStateToProps = ({user}, props) => ({
  ...props.navigation.state.params,
  user,
});

const mapDispatchToProps = dispatch => ({
  addUserNote: (userId, note) => {
    dispatch(addUserNote(userId, note));
  },
  updateUserNote: (userId, noteId, note) => {
    dispatch(updateUserNote(userId, noteId, note));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditNoteScreen);
