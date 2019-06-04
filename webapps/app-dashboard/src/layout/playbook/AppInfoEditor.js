import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import UUID from 'uuid/v4';
import _ from 'lodash';
import Checkbox from 'material-ui/Checkbox';
import IconAdd from 'material-ui/svg-icons/content/add-box';
import IconLockOpen from 'material-ui/svg-icons/action/lock-open';
import IconLocked from 'material-ui/svg-icons/action/lock';
import IconButton from 'material-ui/IconButton';
import IconRemove from 'material-ui/svg-icons/content/remove-circle-outline';

import ImageCropper from '../../components/common/ImageCropper';
import NormalFlatButton from '../../components/common/NormalFlatButton';
import NormalTextField from '../../components/common/NormalTextField';
import InfoModal from '../../components/common/InfoModal';
import AddFieldWrap from '../../components/common/AddFieldWrap';

import colors from '../../styles/colors';
import layout from '../../styles/layout';
import help from '../../documents/help'

import UrlUtils from '../utils/urlUtils'

const DesktopStyle = {
  formContainer: {
    marginLeft: '15%',
    marginRight: '15%'
  },
  row: {
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20
  },
  inline: {
    display: 'inline-block',
    alignSelf: 'flex-end'
  },
  fieldContainer: {
    marginTop: 10,
    marginBottom: 20
  },
  label: {
    color: colors.primary,
    fontSize: 18,
  },
  image: {
    height: 100
  },
  infoModal: {
    width: 500,
  }
}

const MobileStyle = {
  formContainer: {
    marginLeft: '0%',
    marginRight: '0%'
  },
  row: {
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 20
  },
  inline: {
    display: 'inline-block',
    alignSelf: 'flex-end'
  },
  fieldContainer: {
    marginTop: 10,
    marginBottom: 20
  },
  label: {
    color: colors.primary,
    fontSize: 18,
  },
  image: {
    height: 100
  },
  infoModal: {
    width: 500,
  }
}

class AppInfoEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appInfo: props.appInfo,
      showLogoImage: _.isEmpty(props.appInfo.logoImageUrl) ? false : true,
      showAuthorImage: _.isEmpty(props.appInfo.authorPhotoUrl) ? false : true,
      urlValid: (props.appInfo === undefined ) ? false : UrlUtils.isValidUrl(props.appInfo.websiteUrl),
    }

    this.updateAppInfo = this.updateAppInfo.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleSwitch = this.toggleSwitch.bind(this);
  }

  updateAppInfo(name, value) {
    let appInfo = Object.assign({}, this.state.appInfo, {
      [name]: value
    });

    this.setState({
      appInfo,
    });
    this.props.onChange(appInfo);
  }

  handleChange(event) {
    this.updateAppInfo(event.target.name, event.target.value);
  }

  toggleSwitch(field, value) {
    this.updateAppInfo(field, value);
  }

  render() {
    let style = (this.props.targetDevice==='desktop') ? DesktopStyle : MobileStyle;
    return (
      <div>
        <div style={style.formContainer}>
            <div style={style.row}>
              <NormalTextField
                floatingLabelText="Playbook App Name"
                hintText="Title"
                errorText={_.isEmpty(this.state.appInfo.appName) ? "This field is required" : ""}
                name="appName"
                value={this.state.appInfo.appName}
                onChange={this.handleChange}/>
              <InfoModal style={style.infoModal} content={help.appName()}/>
            </div>
            <div style={style.row}>
              <NormalTextField
                floatingLabelText="Provider"
                hintText="Your Name / Organization Name"
                errorText={_.isEmpty(this.state.appInfo.author) ? "This field is required" : ""}
                name="author"
                value={this.state.appInfo.author}
                onChange={this.handleChange} />
              <InfoModal style={style.infoModal} content={help.author()}/>
            </div>
          <div style={style.row}>
            <TextField
              style={{width: '100%'}}
              floatingLabelText="Playbook Description (optional)"
              hintText="Describe your playbook"
              name="appDesc"
              multiLine={true}
              rows={3}
              value={this.state.appInfo.appDesc}
              onChange={this.handleChange} />
            <InfoModal style={style.infoModal} content={help.appDesc()}/>
          </div>
          <br />
          <div style={{...style.fieldContainer, ...layout.common.row}}>
            <p>Profile Photo:</p>
            <ImageCropper
              aspect={1/1}
              imageUrl={this.state.appInfo.authorPhotoUrl}
              userId={this.props.userId}
              previewStyle={style.image}
              handleSubmit={(imageUrl)=>{
                this.updateAppInfo('authorPhotoUrl', imageUrl);
              }}/>
            <InfoModal style={style.infoModal} content={help.authorPhoto()}/>
          </div>
          {!this.props.isOrgMember && <div style={{...style.fieldContainer, ...layout.common.row}}>
            <p>Custom Cover:</p>
            <ImageCropper
              aspect={7/10}
              imageUrl={this.state.appInfo.coverUrl}
              userId={this.props.userId}
              previewStyle={style.image}
              handleSubmit={(imageUrl)=>{
                this.updateAppInfo('coverUrl', imageUrl);
              }}/>
            <InfoModal style={style.infoModal} content={help.coverImage()}/>
            <IconButton tooltip='Remove Custom Cover' onClick={()=>this.updateAppInfo('coverUrl', null)}><IconRemove /></IconButton>
          </div>}
          {!this.props.isOrgMember && <div style={{...style.fieldContainer, ...layout.common.row}}>
            <p>Logo Image:</p>
            <ImageCropper
              aspect={1/1}
              imageUrl={this.state.appInfo.logoImageUrl}
              userId={this.props.userId}
              previewStyle={style.image}
              handleSubmit={(imageUrl)=>{
                this.updateAppInfo('logoImageUrl', imageUrl);
              }}/>
            <InfoModal style={style.infoModal} content={help.logoImage()}/>
            <IconButton tooltip='Remove Logo' onClick={()=>this.updateAppInfo('logoImageUrl', null)}><IconRemove /></IconButton>
          </div>}
          <div style={{...style.fieldContainer, ...layout.common.row}}>
            <NormalTextField
              floatingLabelText="Website URL (optional)"
              hintText="Your website URL here"
              errorText={UrlUtils.isValidUrl(this.props.appInfo.websiteUrl) ? "" : "Invalid URL"}
              name="websiteUrl"
              value={this.state.appInfo.websiteUrl}
              onChange={this.handleChange}/>
            <InfoModal style={style.infoModal} content={help.websiteUrl()}/>
          </div>
          <div style={style.fieldContainer}>
            <div style={{...style.inline, ...{width: 200}}}>
              <Checkbox
                label="Lock User Actions"
                uncheckedIcon={<IconLockOpen color={colors.primary}/>}
                checkedIcon={<IconLocked color={colors.primary}/>}
                checked={this.state.appInfo.lockActions}
                onCheck={(event,isInputChecked)=>{this.toggleSwitch("lockActions", isInputChecked)}}
              />
            </div>
            <div style={style.inline}>
              <InfoModal style={style.infoModal}
                content={help.lockActions()}/>
            </div>
            {this.state.appInfo.lockActions &&
              <TextField
                floatingLabelText="Lock Code"
                hintText="Passcode to lock actions"
                name="actionCode"
                value={this.state.appInfo.actionCode}
                onChange={this.handleChange} />
            }
          </div>
        </div>
      </div>
    );
  }
}

AppInfoEditor.propTypes = {
  appInfo: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  isOrgMember: PropTypes.bool,
};

export default AppInfoEditor;
