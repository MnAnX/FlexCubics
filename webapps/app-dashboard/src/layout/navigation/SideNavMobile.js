import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import { connect } from 'react-redux';

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconNewApp from 'material-ui/svg-icons/content/add-box';
import IconViewApps from 'material-ui/svg-icons/action/assignment';
import IconLogout from 'material-ui/svg-icons/action/input'
import IconOrganization from 'material-ui/svg-icons/communication/business'

import NormalFlatButton from '../../components/common/NormalFlatButton'
import InfoChip from '../../components/common/InfoChip'
import logo from '../../resources/logo/advicecoach-logo.png';

import colors from '../../styles/colors'

const style = {
  container: {
    display: 'flex',
    flexFlow: 'column',
    minWidth: '100%',
    minHeight: 20,
  },
  header: {
    backgroundColor: colors.primary,
    minHeight: 40,
    minWidth: '100%',
    display: 'flex',
    textAlign:'left',
  },
	list: {
    backgroundColor: colors.primary,
    height: '100%',
    //paddingTop: 42,
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

class SideNavMobile extends Component {
  constructor() {
    super();
    this.state = {
      open: false
    }
  }

  render() {
    if (this.props.targetDevice==='mobile'){
      return(
        <div style={style.container}>
          <AppBar
            title={
              <div style={style.header}>
                {this.props.title}
              </div>
            }
            onLeftIconButtonTouchTap={() => this.setState({open: !this.state.open})}
          />
          <Drawer
            open={this.state.open}
            docked={false}
            onRequestChange={()=>this.setState({open: false})}
            onRequestClose={()=>this.setState({open: false})}
            >

            <div style={style.list} >
              <List>
                <Link to='/create-app' style={style.link}>
                  <MenuItem>
                    <IconNewApp style={style.icon} color='white'/>
                    <div style={style.text}>Create New Playbook</div>
                  </MenuItem>
                </Link>

                <Link to='/view-apps' style={style.link}>
                  <MenuItem>
                    <IconViewApps style={style.icon} color='white'/>
                    <div style={style.text}>View My Playbooks</div>
                  </MenuItem>
                </Link>
              </List>

              <div style={style.footer}>
                <Avatar style={style.avatar}
                  src={this.props.userProfile.picture}
                  size={96}
                />
                {this.props.userInfo.hasOrg &&
                  <Link to={`/view-organization-details/${this.props.userInfo.orgId}`} style={style.link}>
                    <InfoChip icon={<IconOrganization />} label='Organization' color={colors.accent} onClick={()=>{}}/>
                  </Link>
                }
                <br />
                <NormalFlatButton icon={<IconLogout />} style={{color: 'white'}} label='Log Out' onClick={()=>{this.props.auth.logout()}} />
              </div>

            </div>
          </Drawer>
        </div>
      );
    } //end if
    else return(<div></div>);
  } //end render
}

function mapStateToProps({user}) {
  return {
    userProfile: user.profile,
    userInfo: user.userInfo
  }
}

export default connect(mapStateToProps)(SideNavMobile);
