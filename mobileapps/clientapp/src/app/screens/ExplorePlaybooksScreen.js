import React, { Component, PropTypes} from 'react';

import { Image, Text, View, StyleSheet } from 'react-native';

import Shelf from '../components/Shelf';
import Book from '../components/Book';
import Container from '../components/Container';


class ExplorePlaybooksScreen extends Component {

  componentDidMount() {
    this.props.getAvaiableApps(this.props.user.userId);
  }

  render() {
    const Applist = this.props.apps.availableApps.map((appInfo) => {
      const action = () => {
        this.props.navigation.navigate('AppInfo', {appInfo});
      };

      return (
        <View key={appInfo.appId} >
          <Book
            key={appInfo.appId}
            imageUrl={appInfo.coverUrl}
            defaultCoverUrl={appInfo.defaultCoverUrl}
            title={appInfo.appName}
            author={appInfo.author}
            originalAuthor={appInfo.originalAuthor}
            onPress={action}
          />
        </View>
      );
    });

    return (
      <Container>
        <Shelf>{Applist}</Shelf>
      </Container>
    );
  }
}

import { getAvailableApps } from '../actions/apps';

const mapStateToProps = ({user, apps}, props) => ({
  ...props.navigation.state.params,
  user,
  apps
});

const mapDispatchToProps = dispatch => ({
  getAvaiableApps: (userId) => {
    dispatch(getAvailableApps(userId))
  },
});

import { connect } from 'react-redux';

export default connect(mapStateToProps, mapDispatchToProps)(ExplorePlaybooksScreen);
