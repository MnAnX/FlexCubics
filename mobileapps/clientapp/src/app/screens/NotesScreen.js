import React, { Component, PropTypes } from 'react';

import { ScrollView, View, Text, StyleSheet } from 'react-native';
import LoadingIndicator from 'react-native-loading-spinner-overlay';
import { List, ListItem } from 'react-native-elements'
import Swipeout from 'react-native-swipeout';

import Container from '../components/Container';
import PrimaryButton from '../components/PrimaryButton';

import _ from 'lodash';

import colors from '../styles/colors';
import { getLocalDT } from './utils'

const style = StyleSheet.create({
  noteTitle: {
    fontSize: 16,
    color: 'dimgrey',
    fontWeight: 'bold'
  },
  noteContent: {
    color: 'grey',
    fontSize: 14,
  },
})

class NotesScreen extends Component {
  static navigationOptions = {
    headerLeft: null
  };

  state = {
    userNotes: [],
  };

  constructor(props) {
    super(props);

    this.renderList = this.renderList.bind(this);
    this.goToNote = this.goToNote.bind(this);
    this.removeNote = this.removeNote.bind(this);
    this.addNote = this.addNote.bind(this);
  }

  componentWillMount() {
    if(_.size(this.props.notes.userNotes) < 1) {
      this.props.getUserNotes(this.props.user.userId);
      this.setState({isLoading: true})
      this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
    }
  }

  componentDidMount() {
    this.updateNotes(this.props.notes);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.notes) {
      this.updateNotes(nextProps.notes);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId)
  }

  updateNotes(notes) {
    if(notes.userNotes) {
      this.setState({
        userNotes: notes.userNotes
      });
    }
  }

  renderList(notes) {
    return(
      <List containerStyle={{marginTop: 0}}>
        {notes.map((note) => {
          var localDT = getLocalDT(note.time)
          var swipeoutBtns = [
            {
              text: 'Delete', backgroundColor: 'red', color: 'white', underlayColor:'grey',
              onPress: () => this.removeNote(note.id),
            }
          ];
          return(
            <Swipeout right={swipeoutBtns} backgroundColor='transparent' autoClose={true}>
              <ListItem
                key={note.id}
                wrapperStyle={{justifyContent: 'center'}}
                underlayColor={colors.transparentPrimary}
                title={note.title}
                titleStyle={style.noteTitle}
                subtitle={note.content}
                subtitleStyle={style.noteContent}
                rightTitle={localDT}
                onPress={() => {this.goToNote(note)}} />
            </Swipeout>
          );
        })}
      </List>
    );
  }

  addNote() {
    this.props.navigation.navigate(
      'EditNote'
    );
  }

  removeNote(noteId) {
    this.props.removeUserNote(this.props.user.userId, noteId);
    this.setState({isLoading: true})
    this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
  }

  goToNote(note) {
    this.props.navigation.navigate(
      'NoteContent',
      {
        note
      }
    );
  }

  render() {
    return (
      <Container>
        <LoadingIndicator visible={this.state.isLoading && this.props.notes.isLoading} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
        <ScrollView>
          {this.renderList(this.state.userNotes)}
        </ScrollView>
        <PrimaryButton icon='add' title='Add New Note' onPress={()=>{this.addNote()}}/>
      </Container>
    );
  }
}

import { connect } from 'react-redux';
import { getUserNotes, removeUserNote } from '../actions/notes';

const mapStateToProps = ({user, notes}, props) => ({
  ...props.navigation.state.params,
  user,
  notes
});

const mapDispatchToProps = dispatch => ({
  getUserNotes: (userId) => {
    dispatch(getUserNotes(userId));
  },
  removeUserNote: (userId, noteId) => {
    dispatch(removeUserNote(userId, noteId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NotesScreen);
