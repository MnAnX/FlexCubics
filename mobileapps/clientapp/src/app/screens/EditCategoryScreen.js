import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Text, View, StyleSheet, ScrollView, TextInput, Platform } from 'react-native';

import LoadingIndicator from 'react-native-loading-spinner-overlay';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import { find, values, isEmpty, size, replace } from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Container from '../components/Container';
import Image from '../components/ImageLoader';
import FlatButton from '../components/FlatButton';
import AccentButton from '../components/AccentButton';
import AddVideo from '../components/AddVideo';
import AddImage from '../components/AddImage';
import Padding from '../components/Padding';

import colors from '../styles/colors';
import textStyle from '../styles/text'
import { getTemplateConfig } from '../config/utils';


const style = StyleSheet.create({
  page: {
    flex: 1,
  },
  fieldContainer: {
    margin: 4,
  },
  descriptionTextArea: {
    height: 80,
    fontSize: 16,
    color: 'dimgrey',
    margin: 20,
    padding: 10,
    borderColor: 'lightgray',
    borderRadius: 8,
    borderWidth: 2,
  },
  image: {
    height: 200
  }
});

class EditCategoryScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      templateId: props.templateId ? props.templateId: 100,
      videoQuality: props.settings.userSettings.recordVideoQuality===1 ? 'high' : 'low',
      name: '',
      description: '',
      videoUrl: '',
      imageUrl: '',
      uploading: false,
      numRepetitions: '',
      numSets: '',
      duration: '',
      intensity: '',
      frequency: '',
    }

    if(props.category) {
      this.state = {
        ...this.state,
        name: props.category.categoryName,
        description: props.category.categoryDesc,
        videoUrl: props.category.videoUrl,
        imageUrl: props.category.imageUrl,
        numRepetitions: props.category.numRepetitions ? props.category.numRepetitions : this.state.numRepetitions,
        numSets: props.category.numSets ? props.category.numSets : this.state.numSets,
        duration: props.category.duration ? props.category.duration : this.state.duration,
        intensity: props.category.intensity ? props.category.intensity : this.state.intensity,
        frequency: props.category.frequency ? props.category.frequency : this.state.frequency,
      };
    }

    this.save = this.save.bind(this);
    this.renderEditName = this.renderEditName.bind(this);
    this.renderEditDescription = this.renderEditDescription.bind(this);
    this.renderEditVideo = this.renderEditVideo.bind(this);
    this.renderEditImage = this.renderEditImage.bind(this);
    this.renderEditPTFields = this.renderEditPTFields.bind(this);
  }

  renderEditName() {
    return (
      <View style={style.fieldContainer}>
        <FormLabel>Name</FormLabel>
        <FormInput value={this.state.name} onChangeText={(text)=>this.setState({name: text})}/>
      </View>
    );
  }

  renderEditDescription() {
    return (
      <View style={style.fieldContainer}>
        <View>
          <FormLabel>Description</FormLabel>
          <TextInput
            style={style.descriptionTextArea}
            onChangeText={(text) => this.setState({description: text})}
            value={this.state.description}
            editable = {true}
            multiline = {true}
          />
        </View>
      </View>
    );
  }

  renderEditVideo() {
    return (
      <View style={style.fieldContainer}>
        <AddVideo
          userId={this.props.user.userId}
          videoUrl={this.state.videoUrl}
          videoQuality={this.state.videoQuality}
          preUploadFunc={()=>{
            this.setState({uploading: true})
          }}
          postUploadFunc={(videoUrl)=>{
            this.setState({
              uploading: false,
              videoUrl,
            });
          }}
        />
      </View>
    );
  }

  renderEditImage() {
    return (
      <View style={style.fieldContainer}>
        <AddImage
          userId={this.props.user.userId}
          imageUrl={this.state.imageUrl}
          preUploadFunc={()=>{
            this.setState({uploading: true})
          }}
          postUploadFunc={(imageUrl)=>{
            this.setState({
              uploading: false,
              imageUrl,
            });
          }}
        />
      </View>
    );
  }

  renderEditPTFields() {
    return (
      <View style={style.fieldContainer}>
        <View>
          <FormLabel>Repetitions</FormLabel>
          <FormInput value={this.state.numRepetitions} keyboardType='numeric' returnKeyType={'done'} onChangeText={(text)=>{this.setState({numRepetitions: text})}}/>
          <FormLabel>Sets</FormLabel>
          <FormInput value={this.state.numSets} keyboardType='numeric' returnKeyType={'done'} onChangeText={(text)=>{this.setState({numSets: text})}}/>
          <FormLabel>Duration</FormLabel>
          <FormInput value={this.state.duration} returnKeyType={'done'} onChangeText={(text)=>{this.setState({duration: text})}}/>
          <FormLabel>Intensity</FormLabel>
          <FormInput value={this.state.intensity} returnKeyType={'done'} onChangeText={(text)=>{this.setState({intensity: text})}}/>
          <FormLabel>Frequency</FormLabel>
          <FormInput value={this.state.frequency} returnKeyType={'done'} onChangeText={(text)=>{this.setState({frequency: text})}}/>
        </View>
      </View>
    );
  }

  save() {
    let category = {}
    // build category data
    if(this.props.category) {
      category = this.props.category
    }
    category.categoryName = this.state.name
    category.categoryDesc = this.state.description;
    category.videoUrl = this.state.videoUrl;
    category.imageUrl = this.state.imageUrl;
    if(!isEmpty(this.state.numRepetitions)) {
      category.numRepetitions = this.state.numRepetitions;
    }
    if(!isEmpty(this.state.numSets)) {
      category.numSets = this.state.numSets;
    }
    if(!isEmpty(this.state.duration)) {
      category.duration = this.state.duration;
    }
    if(!isEmpty(this.state.intensity)) {
      category.intensity = this.state.intensity;
    }
    if(!isEmpty(this.state.frequency)) {
      category.frequency = this.state.frequency;
    }
    // save the changes
    this.props.saveAction(category)
    // Go back to playbook
    this.props.navigation.goBack();
  }

  render() {
    const showExerciseTemplateFields = (this.state.templateId === 103);
    return (
      <Container>
        <LoadingIndicator visible={this.state.uploading} textContent={"Uploading..."} textStyle={{color: '#FFF'}} />
        <View style={style.page}>
          <AccentButton title="Save" onPress={() => {this.save()}} disabled={isEmpty(this.state.name)}/>
            <KeyboardAwareScrollView>
              <View>
                { this.renderEditName() }
                <Padding height={20}/>
                { this.renderEditVideo() }
                { this.renderEditImage() }
                { this.renderEditDescription() }
                {showExerciseTemplateFields && this.renderEditPTFields()}
                <Padding height={20}/>
              </View>
            </KeyboardAwareScrollView>
        </View>
      </Container>
    );
  }
}

EditCategoryScreen.propTypes = {
  saveAction: PropTypes.func.isRequired,
  templateId: PropTypes.number,
  category: PropTypes.object,
};

const mapStateToProps = ({user, customApps, settings}, props) => ({
  ...props.navigation.state.params,
  user,
  customApps,
  settings,
});

import { connect } from 'react-redux';

export default connect(mapStateToProps)(EditCategoryScreen);
