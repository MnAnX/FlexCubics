import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import { connect } from 'react-redux';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/user';

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';

import IconNewApp from 'material-ui/svg-icons/content/add-box';
import IconViewApps from 'material-ui/svg-icons/action/assignment';
import IconMail from 'material-ui/svg-icons/content/mail';
import IconLogout from 'material-ui/svg-icons/action/input'
import IconOrganization from 'material-ui/svg-icons/communication/business'

import logo from '../../resources/logo/advicecoach-logo.png';

import NormalFlatButton from '../../components/common/NormalFlatButton'
import InfoChip from '../../components/common/InfoChip'

import colors from '../../styles/colors'

const style = {
  container: {
    display: 'flex',
    flexFlow: 'column',
    minWidth: 300,
    minHeight: 2048,
  },
  header: {
    backgroundColor: colors.navyBlue,
    minHeight: 55,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
	list: {
    backgroundColor: colors.primary,
    height: '100%',
    paddingTop: 42,
	},
  link: {
    textDecoration: 'none',
  },
  item: {
    left: 'auto',
    marginBottom: 20,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    display: 'inline-block',
    color: 'white',
    fontSize: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    width: 246,
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    margin: 5,
  },
  badge: {
    padding: "15px 5px",
  }
};

class SideNav extends Component {
  constructor(props){
    super(props);
    this.state = {
      unreadMessageCount: 0,
    }
  }

  componentWillReceiveProps(nextProps){
    if (!nextProps.notifications) return;
    let notificationsArray = _.map(nextProps.notifications, function(value, index) { return value; });
    var unreadMessageCount = 0;
    for (var i=0; i<notificationsArray.length; i++){
      var notification = notificationsArray[i];
      if (notification.hasRead){
        continue;
      }
      unreadMessageCount++;
    }
    this.setState({
      unreadMessageCount,
    });
  }

  render() {

    if (this.props.targetDevice==='desktop'){
      return(
        <div style={style.container}>
          <div style={style.header}>
            <img src={logo}/>
          </div>
          <div style={style.list}>
            <List>
              <Link to='/create-app' style={style.link}>
                <ListItem style={style.item}>
                  <IconNewApp style={style.icon} color='white'/>
                  <div style={style.text}>Create New Playbook App</div>
                </ListItem>
              </Link>
              <Link to={`/view-apps/${this.props.userId}`} style={style.link}>
                <ListItem style={style.item}>
                  <IconViewApps style={style.icon} color='white'/>
                  <div style={style.text}>View My Playbook Apps</div>
                </ListItem>
              </Link>
              {this.props.user.isOrgAdmin &&
                <Link to={`/manage-organization/${this.props.userInfo.orgId}`} style={style.link}>
                  <ListItem style={style.item}>
                    <IconOrganization style={style.icon} color='white'/>
                    <div style={style.text}>Manage Organization</div>
                  </ListItem>
                </Link>
              }
              <Link to={`/message-inbox/${this.props.userId}`} style={style.link}>
                <ListItem style={style.item}>
                  <Badge style={style.badge} badgeContent={this.state.unreadMessageCount} secondary={true}>
                    <IconMail style={style.icon} color='white'/>
                  </Badge>
                  <div style={style.text}>Message Inbox</div>
                </ListItem>
              </Link>
            </List>
            <div style={style.footer}>
              <Avatar style={style.avatar}
                src={this.props.userProfile.picture}
                size={96}
              />
              {this.props.userInfo.hasOrg &&
                <Link to={`/view-organization-details/${this.props.userInfo.orgId}`} style={style.link}>
                  <br />
                  <InfoChip icon={<IconOrganization />} label='Organization' color={colors.accent}/>
                </Link>
              }
              <br />
              <Link to='/'>
                <NormalFlatButton icon={<IconLogout />} style={{color: 'white'}} label='Log Out'  onClick={()=>this.props.userLogOut(-1)} />
              </Link>
            </div>
          </div>
        </div>
      );
    } //end if
    else return(<div></div>);
  }//end render
}

function mapStateToProps({user, message}) {
  return {
    user,
    userId: user.userId,
    userProfile: user.profile,
    userInfo: user.userInfo,
    notifications: message.notifications,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
