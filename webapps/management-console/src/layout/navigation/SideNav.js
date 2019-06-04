import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import { connect } from 'react-redux';

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';

import IconReport from 'material-ui/svg-icons/editor/insert-chart';
import IconLogout from 'material-ui/svg-icons/action/input'

import logo from '../../resources/logo/advicecoach-logo.png';

import NormalFlatButton from '../../components/common/NormalFlatButton'
import colors from '../../styles/colors'

const style = {
  container: {
    display: 'flex',
    flexFlow: 'column',
    minWidth: 246,
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
    marginBottom: 30,
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
    position: 'fixed',
    bottom: 60,
    width: 246,
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    margin: 5,
  }
};

class SideNav extends Component {
  render() {
    return(
      <div style={style.container}>
        <div style={style.header}>
          <img src={logo}/>
        </div>
        <div style={style.list}>
          <List>
            <Link to='/user-data-home' style={style.link}>
              <ListItem style={style.item}>
                <div style={style.text}>User Data</div>
              </ListItem>
            </Link>
            <Link to='/app-data-home' style={style.link}>
              <ListItem style={style.item}>
                <div style={style.text}>Playbook Data</div>
              </ListItem>
            </Link>
            <Link to='/system-data-home' style={style.link}>
              <ListItem style={style.item}>
                <div style={style.text}>System Data</div>
              </ListItem>
            </Link>
            <Link to='/app-management-home' style={style.link}>
              <ListItem style={style.item}>
                <div style={style.text}>Manage Playbook</div>
              </ListItem>
            </Link>
            <Link to='/organizations-home' style={style.link}>
              <ListItem style={style.item}>
                <div style={style.text}>Manage Organizations</div>
              </ListItem>
            </Link>
          </List>
          <div style={style.footer}>
            <Avatar style={style.avatar}
              src={this.props.userProfile.picture}
              size={96}
            />
            <NormalFlatButton icon={<IconLogout />} style={{color: 'white'}} label='Log Out' onClick={()=>{this.props.auth.logout()}} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userProfile: state.user.profile
  }
}

export default connect(mapStateToProps)(SideNav);
