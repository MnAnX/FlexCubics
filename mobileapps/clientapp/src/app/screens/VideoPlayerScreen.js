import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LoadingIndicator from 'react-native-loading-spinner-overlay';
import VideoPlayer from 'react-native-video-controls';

import Container from '../components/Container';
import AccentButton from '../components/AccentButton';

import _ from 'lodash';
import colors from '../styles/colors';

const window = Dimensions.get('window');

const style = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center'
  },
  video: {
    alignSelf: 'stretch',
    height: window.width * 0.5625, // 16:9
    backgroundColor: 'black'
  },
})

class VideoPlayerScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <View style={style.background}>
          <VideoPlayer source={{uri: this.props.videoUrl}}
                       ref={(ref) => {
                           this.player = ref
                       }}
                       muted={false}
                       resizeMode="contain"
                       repeat={false}
                       playInBackground={false}
                       playWhenInactive={false}
                       ignoreSilentSwitch={"ignore"}
                       disableFullscreen={ true }
                       disableBack={ true }
                       disableVolume={ true }
                       style={style.video}
                       onError={ (error) => {
                         //console.log("===== video error: ", error)
                       }}
          />
        </View>
      </Container>
    );
  }
}

VideoPlayerScreen.propTypes = {
  videoUrl: PropTypes.string.isRequired,
};

import { connect } from 'react-redux';

const mapStateToProps = ({user, customApps}, props) => ({
  ...props.navigation.state.params,
});

export default connect(mapStateToProps)(VideoPlayerScreen);
