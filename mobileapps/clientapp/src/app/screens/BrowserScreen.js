import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { WebView, Text } from 'react-native';
import LoadingIndicator from 'react-native-loading-spinner-overlay';
import _ from 'lodash'

import Container from '../components/Container';

import colors from '../styles/colors';

class BrowserScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
  })

  constructor(props) {
    super(props);

    let url = props.url
    if(!_.startsWith(url, 'http')) {
      // process the url
      url = "http://" + url
    }

    this.state = {
      url
    };
  }

  render() {
    return (
      <Container>
        <WebView
          source={{uri: this.state.url}}
          startInLoadingState={true}
          onLoadStart={()=>{this.setState({isLoading: true})}}
          onLoadEnd={()=>{this.setState({isLoading: false})}}
          onLoad={(e)=>{
            //console.log("===== onLoad")
          }}
          onError={(e)=>{
            //console.log("===== error: ", e)
          }}
        />
      </Container>
    );
  }
}

BrowserScreen.propTypes = {
  url: PropTypes.string.isRequired,
};

import { connect } from 'react-redux';

const mapStateToProps = ({user}, props) => ({
  ...props.navigation.state.params,
  user,
});

const mapDispatchToProps = (dispatch) => ({
});


export default connect(mapStateToProps, mapDispatchToProps)(BrowserScreen);
