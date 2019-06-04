import React, { Component } from 'react';

import { View, Text, processColor } from 'react-native';
import Modal from 'react-native-modalbox';
import _ from 'lodash'

import Container from '../components/Container';
import Shelf from '../components/Shelf';
import Author from '../components/Author';
import ModalButton from '../components/ModalButton';

import { uniqBy } from 'lodash';

import modalStyle from '../styles/modal';
import colors from '../styles/colors';

class ExpertsScreen extends Component {
  constructor(props){
    super(props);

    this.clickAuthor = this.clickAuthor.bind(this)
  }

   componentDidMount() {
     if(this.props.apps.currentApp.appId) {
       this.props.navigation.navigate('ExpertHome', { appInfo: this.props.apps.currentApp, title: this.props.apps.currentApp.author });
     }
   }

  clickAuthor(appInfo) {
    this.props.navigation.navigate('ExpertHome', { appInfo, title: appInfo.author });
  }

  render() {
    const authors = this.props.apps.userApps.map(({appInfo}) => (
      <Author
        key={appInfo.appId}
        name={appInfo.author}
        imageUrl={appInfo.authorPhotoUrl}
        onPress={() => this.clickAuthor(appInfo)}
      />
    ));

    return (
      <Container>
        <View style={{flex: 1, backgroundColor: 'whitesmoke'}}>
          <Shelf>{authors}</Shelf>
        </View>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
});

const mapStateToProps = ({user, apps}, props) => ({
  ...props.navigation.state.params,
  user,
  apps
});

import { connect } from 'react-redux';

export default connect(mapStateToProps, mapDispatchToProps)(ExpertsScreen);
