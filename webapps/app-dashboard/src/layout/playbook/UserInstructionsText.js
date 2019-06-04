import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Padding from '../../components/common/Padding'
import Title from '../../components/common/Title';

import colors from '../../styles/colors';


const style = {
  pageLetter: {
    width: '215.9mm',
    height: '297.4mm',
    padding: '15mm',
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
  },
  mainHeader: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subHeader: {
      fontSize: 26,
      textAlign: 'center',
      color: colors.primary,
  },
  body: {
    fontSize: 24,
    textAlign: 'center',
  },
  highlightText: {
      fontSize: 26,
      fontWeight: 'bold',
      color: colors.accent,
  },
  highlight: {
    display: 'inline-block',
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.accent,
  },
  row: {
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'center',
    margin: 20,
  },
  imageLogo: {
    width: 100,
    height: 100,
  },
  imageInstructions: {
      height: 400,
  }
}

class UserInstructionsText extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id={this.props.id} style={style.pageLetter}>
        <div style = {style.mainHeader}>{this.props.appInfo.appName}</div>
          <Padding height={30}/>
        <div style = {style.subHeader}>{"Welcome! This app is going to help you do your exercises at home between appointments. Please follow the instructions — it takes 3 minutes — so you’ll be all set to go!"}</div>
          <Padding height={40}/>
        <div style={style.body}>{"1. Download the AdviceCoach app to your mobile device:"}</div>
        <div style={style.body}>{"Go to Apple Store/Google Play, search for"} <span style={style.highlightText}>AdviceCoach</span> {"and download it."}</div>
          <Padding height={20}/>
        <img src={'https://s3-us-west-2.amazonaws.com/system-data/web-app/images/help_user_inst_app_logo.jpg'} style={style.imageLogo}/>
          <Padding height={20}/>
        <div style={style.body}>{"2. Sign up using Facebook, Google, or create a new account"}</div>
          <Padding height={20}/>
        <div style={style.body}>{"3. Click \"Find Your Provider\", then type"} <span style={style.highlightText}>{this.props.appId}</span> {"in the box and click Enter. Click \"Start\" and you're all ready!"}</div>
          <Padding height={20}/>
        {this.props.appInfo.isLocked &&
          <div style={style.body}>{"4. This Playbook is locked, and you will be asked to input a code to unlock the content. Type"} <span style={style.highlightText}>{this.props.appInfo.lockCode}</span> {"in the box and click Enter."}</div>
        }
          <Padding height={40}/>
        <div style={style.row}>
          <img src={'https://s3-us-west-2.amazonaws.com/system-data/web-app/images/help_user_inst_3.jpg'} style={style.imageInstructions}/>
          <Padding width={40}/>
          <div style={{position: 'relative'}}>
            <div style={{position: 'absolute', top: 154, left: 46, color: 'dimgrey'}}>{this.props.appId}</div>
            <img src={'https://s3-us-west-2.amazonaws.com/system-data/web-app/images/help_user_inst_4.jpg'} style={style.imageInstructions}/>
          </div>
        </div>
      </div>
    );
  }
}

UserInstructionsText.propTypes = {
	appId: PropTypes.number,
  appInfo: PropTypes.object,
};

export default UserInstructionsText;
