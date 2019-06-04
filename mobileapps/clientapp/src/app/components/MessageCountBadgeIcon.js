import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import _ from 'lodash'

import colors from '../styles/colors';

class MessageCountBadgeIcon extends Component {
  constructor(props) {
    super(props);

    let unreadMessages = _.filter(this.props.notifications.notifications, { 'hasRead': false });
    this.state = {
      unreadMessagesCount: unreadMessages.length,
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.notifications) {
      let unreadMessages = _.filter(nextProps.notifications.notifications, { 'hasRead': false });
      this.state = {
        unreadMessagesCount: unreadMessages.length,
      }
    }
  }

  render() {
    return (
      <View>
        <Icon name='email' size={28} color={this.props.tintColor} />
        {this.state.unreadMessagesCount > 0 &&
          <View style={{ position: 'absolute', left: 20, backgroundColor: 'red', borderRadius: 9, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white' }}>{this.state.unreadMessagesCount}</Text>
          </View>
        }
      </View>
    );
  }
};

MessageCountBadgeIcon.propTypes = {
  tintColor: PropTypes.string
};

import { connect } from 'react-redux';

const mapStateToProps = ({notifications}) => ({
  notifications
});

export default connect(mapStateToProps)(MessageCountBadgeIcon);
