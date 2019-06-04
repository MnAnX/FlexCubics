import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Platform, Alert, Dimensions, TouchableHighlight, Text, View, StyleSheet, ScrollView, FlatList, TextInput } from 'react-native';
import OpenFile from 'react-native-doc-viewer';
import VideoPlayer from 'react-native-video-controls';
import { find, isEmpty, size } from 'lodash';
import Modal from 'react-native-modalbox';
import { List, ListItem, Divider, Icon } from 'react-native-elements'
import _ from 'lodash'
import LoadingIndicator from 'react-native-loading-spinner-overlay';
import Lightbox from 'react-native-lightbox';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import Image from '../components/ImageLoader';
import Container from '../components/Container';
import FlatButton from '../components/FlatButton';
import AccentButton from '../components/AccentButton';
import InfoBadge from '../components/InfoBadge';
import Padding from '../components/Padding';
import ModalButton from '../components/ModalButton';
import WistiaPlayer from '../components/WistiaPlayer';
import TopMenu from '../components/TopMenu'
import ReminderSetter from '../components/ReminderSetter'
import YoutubePlayer from '../components/YoutubePlayer';
import InputModal from '../components/InputModal';

import { Stats } from '../services/stats';
import colors from '../styles/colors';
import textStyle from '../styles/text'
import cardStyle from '../styles/card';
import modalStyle from '../styles/modal';

import { getLocalDT } from './utils'

const window = Dimensions.get('window');

const style = StyleSheet.create({
  page: {
    flex: 1
  },
  image: {
    flex: 1,
    height: 300,
  },
  video: {
    alignSelf: 'center',
    width: window.width,
    height: window.width * 0.6,
    backgroundColor: 'white'
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    shadowColor: colors.primary,
    shadowOpacity: 0.85,
    backgroundColor: 'transparent',
  }
});


class CategoryScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
  })

  constructor(props){
    super(props);

    this.state = {
      appInfo: props.appInfo,
      categories: props.categories,
      categoryIndex: props.categoryIndex,
      category: props.categories[props.categoryIndex],
      openDoc: false,
      pauseVideo: true,
      currentMessage: '',
      showSendMessageModal: false,
      editData: {
        title:'',
        field: '',
      },
    }

    this.renderCategoryContent = this.renderCategoryContent.bind(this);
    this.watchVideo = this.watchVideo.bind(this);
    this.viewDocument = this.viewDocument.bind(this);
    this.openWebsite = this.openWebsite.bind(this);
    this.renderDocumentButtons = this.renderDocumentButtons.bind(this);
    this.renderVideo = this.renderVideo.bind(this);
    this.renderImage = this.renderImage.bind(this)
    this.renderWebsite = this.renderWebsite.bind(this);
    this.renderYoutube = this.renderYoutube.bind(this);
    this.renderWistiaVideo = this.renderWistiaVideo.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this)
    this.sendMessageModal = this.sendMessageModal.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.goNextCategory = this.goNextCategory.bind(this)
    this.goPrevCategory = this.goPrevCategory.bind(this)
    this.reloadCategory = this.reloadCategory.bind(this)
    this.renderTitleBar = this.renderTitleBar.bind(this)
    this.setReminder = this.setReminder.bind(this);
    this.reminderModal = this.reminderModal.bind(this)
    this.editCategory = this.editCategory.bind(this)
  }

  componentDidMount() {
    Stats.activeUserApp(this.props.user.userId, this.props.appId);
  }

  goNextCategory() {
    // go to the next instruction
    let newIndex = this.state.categoryIndex + 1
    if(newIndex < this.state.categories.length) {
      // valid index, reload the next category with the new index
      this.reloadCategory(newIndex)
    }
  }

  goPrevCategory() {
    // go to the previous instruction
    let newIndex = this.state.categoryIndex - 1
    if(newIndex >= 0) {
      // valid index, reload the previous category with the new index
      this.reloadCategory(newIndex)
    }
  }

  reloadCategory(newIndex) {
    let category = this.state.categories[newIndex]
    this.setState({
      categoryIndex: newIndex,
      category,
    })
    this.props.navigation.setParams({ title: category.categoryName })
  }

  renderDocumentButtons(category) {
    let hasDocuments = !isEmpty(category.documents) && (size(category.documents) > 0);
    return(
      <View>
        {hasDocuments &&
          <View>
            {this.state.openDoc && <Text style={{alignSelf: 'center', color: 'red'}}>Opening Document...</Text>}
            {category.documents.map((document) => {
              return(
                <FlatButton icon='insert-drive-file' title={document.name} onPress={() => {this.viewDocument(document.name, document.url)}} />
              );
            })}
          </View>
        }
      </View>
    )
  }

  viewDocument(fileName, url) {
    let errMsg = Platform.OS === 'android'
                              ? "Please install external app (e.g. Polaris Office) to open this file format"
                              : "Please check your connection or contact playbook owner";
    this.setState({openDoc: true});
    OpenFile.openDoc([{
       url,
       fileName,
       cache:false,
     }], (error, url) => {
       this.setState({openDoc: false});
       if (error) {
         //console.log("Error opening file: ", error);
         Alert.alert(
          'Unable to open this document',
          errMsg,
          [ {text: 'OK'} ]
        )
       }
    })
  }

  renderVideo(category) {
    let hasVideo = !isEmpty(category.videoUrl);
    let showVideo = true;
    let playIconColor = 'white';
    if(Platform.OS === 'android') {
      // hack for android
      showVideo = !this.state.pauseVideo;
      playIconColor = colors.primary;
    }
    return (
      <View>
        {hasVideo && <View>
          <View style={style.video}>
            {showVideo && <VideoPlayer
                         source={{uri: category.videoUrl}}
                         paused={this.state.pauseVideo}
                         disableBack={ true }
                         style={style.video}
            />}
          </View>
          {this.state.pauseVideo &&
            <View style={[style.video, style.overlay, {justifyContent: 'center', alignItems: 'center'}]}>
              <TouchableHighlight onPress={()=>this.watchVideo(category)}>
                <View><Icon name='play-circle-outline' type='material-icons' size={100} color={playIconColor} /></View>
              </TouchableHighlight>
            </View>
          }
        </View>}
      </View>
    )
  }

  watchVideo(category) {
    this.props.navigation.navigate(
      'VideoPlayer',
      {
        videoUrl: category.videoUrl
      }
    );
  }

  renderImage(category) {
    return(
      <Lightbox>
        <Image source={{uri : category.imageUrl}} style={style.image} resizeMode='contain'/>
      </Lightbox>
    )
  }

  renderWebsite(category) {
    let hasWebsite = category.website && !isEmpty(category.website.url);
    let websiteName = category.website && !isEmpty(category.website.name) ? category.website.name : "Website"
    return(
      <View>
        {hasWebsite &&
          <View>
            <FlatButton icon='link' title={websiteName} onPress={() => {this.openWebsite(category.website)}} />
          </View>
        }
      </View>
    )
  }

  openWebsite(website) {
    this.props.navigation.navigate('Browser', { url: website.url, title: website.name });
  }

  renderYoutube(category) {
    let hasYoutubeVideo = category.youtubeVideo && !isEmpty(category.youtubeVideo.id);
    return (
      <View>
        {hasYoutubeVideo &&
          <YoutubePlayer
            videoId={category.youtubeVideo.id}
            style={style.video}
          />}
      </View>
    )
  }

  renderWistiaVideo(category) {
    let hasWistiaVideo = category.wistiaVideo && !isEmpty(category.wistiaVideo.id);
    return (
      <View>
        {hasWistiaVideo &&
          <WistiaPlayer
            videoId={category.wistiaVideo.id}
            style={style.video}
          />}
      </View>
    )
  }

  renderCategoryContent(category) {
    let hasImage = !isEmpty(category.imageUrl);
    let hasDescription = !isEmpty(category.categoryDesc);
    let hasContent = !isEmpty(category.categoryContent);

    let hasReps = !isEmpty(category.numRepetitions);
    let hasSets = !isEmpty(category.numSets);
    let hasIntensity = !isEmpty(category.intensity);
    let hasFrequency = !isEmpty(category.frequency);
    let hasDuration = !isEmpty(category.duration);

    return (
      <ScrollView>
        {this.renderVideo(category)}
        {this.renderYoutube(category)}
        {this.renderWistiaVideo(category)}
        {hasImage && this.renderImage(category)}
        <Text style={textStyle.title}>{category.categoryName}</Text>
        <ScrollView horizontal={true} style={{flexDirection: 'row', marginLeft: 10}}>
          {hasReps && <InfoBadge label='Reps' value={category.numRepetitions} onPress={()=>this.editField('Reps', 'numRepetitions', 'numeric')} />}
          {hasSets && <InfoBadge label='Sets' value={category.numSets} onPress={()=>this.editField('Sets', 'numSets', 'numeric')} />}
          {hasIntensity && <InfoBadge label='Intensity' value={category.intensity} onPress={()=>this.editField('Intensity', 'intensity')} />}
        </ScrollView>
        <ScrollView horizontal={true} style={{flexDirection: 'row', marginLeft: 10}}>
          {hasFrequency && <InfoBadge label='Frequency' value={category.frequency} color={colors.highlight} onPress={()=>this.editField('Frequency', 'frequency')} />}
          {hasDuration && <InfoBadge label='Duration' value={category.duration} color={colors.highlight} onPress={()=>this.editField('Duration', 'duration')} />}
        </ScrollView>
        {hasDescription && <Text style={textStyle.normalLarge}>{category.categoryDesc}</Text>}
        {this.renderWebsite(category)}
        {this.renderDocumentButtons(category)}
        {hasContent && <Text style={textStyle.normal}>{category.categoryContent}</Text>}
      </ScrollView>
    );
  }

  editField(title, field, keyboardType) {
    this.setState({
      editData: {
        title,
        field,
        keyboardType,
      }
    })
    this.refs.editModal.show()
  }

  handleSendMessage() {
    // open send message modal
    this.setState({
      currentMessage: '',
      showSendMessageModal: true,
    })
    this.refs.sendMessageModal.open()
  }

  sendMessage(message) {
    // send message about the instruction
    this.setState({
      showSendMessageModal: false,
      isLoading: true
    });
    this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)

    let sender = `${this.props.user.userInfo.firstName} ${this.props.user.userInfo.lastName}`
    let subject = `Feedback from ${sender}`
    let text = `${message} \n\n** This feedback is about instruction [${this.state.category.categoryName}] of Playbook [${this.state.appInfo.appName}]`
    this.props.sendNotificationToUser(
      this.props.user.userId,
      this.state.appInfo.ownerUserId,
      sender,
      subject,
      text,
      true);

    // Go back to playbook
    this.props.navigation.goBack();
  }

  renderToolBar() {
    return (
      <View>
        {this.props.type!=='LibraryOnly' && <View>
          <AccentButton title="Feedback" onPress={() => {this.handleSendMessage()}} />
        </View>}
      </View>
    );
  }

  // === Menu functions

  renderTitleBar() {
    return(
      <TopMenu>
        <Icon name='alarm' color='white' size={30} onPress={() => this.setReminder()} />
        {this.state.appInfo.appType !== 'LibraryOnly' && <Icon name='edit' color='white' size={30} onPress={() => this.editCategory()} />}
      </TopMenu>
    );
  }

  setReminder() {
    this.refs.reminderModal.open()
  }

  editCategory() {
    this.props.navigation.navigate(
      'EditCategory',
      {
        templateId: this.props.templateId,
        category: this.state.category,
        saveAction: (updatedCategory)=>{
          this.props.editCustomAppCategory(this.state.customAppId, updatedCategory.categoryId, updatedCategory);
        }
      }
    );
  }

  // === Modals ===

  sendMessageModal() {
    return (
      <Modal coverScreen={true}
        ref="sendMessageModal"
        isOpen={this.state.showSendMessageModal}
        style={[modalStyle.centered, {height: 190}]}
        position={"center"}>
        <Text style={modalStyle.title}>Feedback Text</Text>
        <View>
          <TextInput
            style={modalStyle.inputBoxMultiLines}
            returnKeyType='done'
            onChangeText={(text) => this.setState({currentMessage: text})}
            editable = {true}
            multiline = {true}
            />
        </View>
        <View style={modalStyle.buttonGroup}>
          <ModalButton label='Cancel' onPress={() => {
            this.setState({
              showSendMessageModal: false,
            });
          }}/>
          <ModalButton label='Send' onPress={() => {
            this.sendMessage(this.state.currentMessage)
            this.setState({
              showSendMessageModal: false,
            });
          }}/>
        </View>
      </Modal>
    );
  }

  reminderModal() {
    let text = `Reminder: ${this.state.category.categoryName}`
    return (
      <Modal coverScreen={true} ref="reminderModal" style={[modalStyle.centered, {height: 280}]} position={"center"}>
        <Text style={modalStyle.title}>Set Reminder</Text>
        <Text style={modalStyle.description}>Set a reminder for {this.state.category.categoryName}</Text>
        <ReminderSetter
          reminderText={text}
          postAction={()=>{
            this.refs.reminderModal.close()
            Stats.collectionTrigger(this.props.user.userId, this.props.appId, 'set_reminder');
          }}
          />
      </Modal>
    );
  }

  editModal() {
    return (
      <InputModal ref="editModal"
        title={this.state.editData.title}
        keyboardType={this.state.editData.keyboardType}
        confirmText='Save'
        postAction={(input)=>{
          let category = this.state.category
          category[this.state.editData.field] = input
          this.setState({category})
          this.props.editCustomAppCategory(this.props.customAppId, category.categoryId, category)
        }}
      />
    );
  }

  // === Main ===

  render() {
    return (
      <Container>
        <LoadingIndicator visible={this.state.isLoading && this.props.customApps.isLoading} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
        {this.renderTitleBar()}
        <ScrollView style={style.page}>
          <GestureRecognizer
            onSwipeLeft={(state) => this.goNextCategory()}
            onSwipeRight={(state) => this.goPrevCategory()}
            config={{
              velocityThreshold: 0.3,
              directionalOffsetThreshold: 80
            }}
            style={{ flex: 1, }}
            >
            { this.renderCategoryContent(this.state.category) }
          </GestureRecognizer>
        </ScrollView>
        {this.renderToolBar()}
        {this.sendMessageModal()}
        {this.reminderModal()}
        {this.editModal()}
      </Container>
    );
  }
}

CategoryScreen.propTypes = {
  appId: PropTypes.number.isRequired,
  categories: PropTypes.object.isRequired,
  categoryIndex: PropTypes.number.isRequired,
  appInfo: PropTypes.object.isRequired,
  type: PropTypes.string,
  customAppId: PropTypes.number,
};

import { editCustomAppCategory } from '../actions/customApps';
import { sendNotificationToUser } from '../actions/notifications';

const mapStateToProps = ({user, customApps}, props) => ({
  ...props.navigation.state.params,
  user,
  customApps
});

const mapDispatchToProps = dispatch => ({
  sendNotificationToUser: (userId, recipientUserId, sender, subject, text, allowReply, imageUrl, videoUrl) => {
    dispatch(sendNotificationToUser(userId, recipientUserId, sender, subject, text, allowReply, imageUrl, videoUrl));
  },
  editCustomAppCategory: (customAppId, categoryId, category) => {
    dispatch(editCustomAppCategory(customAppId, categoryId, category));
  },
});

import { connect } from 'react-redux';

export default connect(mapStateToProps, mapDispatchToProps)(CategoryScreen);
