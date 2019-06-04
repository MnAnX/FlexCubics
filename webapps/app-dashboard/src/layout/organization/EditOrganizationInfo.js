import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/organization';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Loader from 'react-loader-advanced';
import IconAdd from 'material-ui/svg-icons/content/add-box';

import AppFrame from '../AppFrame';
import Title from '../../components/common/Title';
import NormalBigButton from '../../components/common/NormalBigButton';
import ActionButton from '../../components/common/ActionButton';
import ImageCropper from '../../components/common/ImageCropper';
import NormalFlatButton from '../../components/common/NormalFlatButton';
import NormalTextField from '../../components/common/NormalTextField';
import TemplatePicker from '../../components/common/TemplatePicker'
import AddFieldWrap from '../../components/common/AddFieldWrap';
import InfoModal from '../../components/common/InfoModal';
import help from '../../documents/help';

import colors from '../../styles/colors';

const style = {
  page: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 30,
  },
  formContainer: {
    marginLeft: '15%',
    marginRight: '15%'
  },
  fieldContainer: {
    marginTop: 10,
    marginBottom: 20
  },
  label: {
    color: colors.primary,
  },
  coverImage: {
    height: 200
  },
  logoImage: {
    height: 50
  },
}

class EditOrganizationInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orgData: props.organization.orgInfoData.orgData,
      showCoverImage: _.isEmpty(props.organization.orgInfoData.orgData.defaultCoverUrl) ? false : true,
      showLogoImage: _.isEmpty(props.organization.orgInfoData.orgData.defaultLogoUrl) ? false : true,
      showWebsiteUrl: _.isEmpty(props.organization.orgInfoData.orgData.websiteUrl) ? false : true,
    }

    this.eidtProfession = this.eidtProfession.bind(this)
    this.editDefaultCover = this.editDefaultCover.bind(this)
    this.editDefaultLogo = this.editDefaultLogo.bind(this);
    this.editWebsiteUrl = this.editWebsiteUrl.bind(this);
    this.saveChange = this.saveChange.bind(this);
  }

  eidtProfession() {
    return (
      <div style={style.fieldContainer}>
        <div style={style.label}>Profession</div>
        <TemplatePicker
          templateId={this.state.orgData.templateId}
          onChange={(value)=>this.setState({orgData: {...this.state.orgData, templateId: value}})} />
      </div>
    )
  }

  editDefaultLogo() {
    return (
      <div style={style.fieldContainer}>
        <AddFieldWrap
          initShow={!_.isEmpty(this.state.orgData.defaultLogoUrl)}
          label='Logo'
          field={
            <ImageCropper
              aspect={1/1}
              imageUrl={this.state.orgData.defaultLogoUrl}
              userId={this.props.user.userId}
              previewStyle={style.logoImage}
              handleSubmit={(imageUrl)=>{
                this.setState({orgData: {...this.state.orgData, defaultLogoUrl: imageUrl}})
              }}
            />
          }>
            <InfoModal content={help.organizationLogo()}/>
          </AddFieldWrap>
      </div>
    )
  }

  editDefaultCover() {
    return (
      <div style={style.fieldContainer}>
        <AddFieldWrap
          initShow={!_.isEmpty(this.state.orgData.defaultCoverUrl)}
          label='Default Playbook Cover'
          field={
            <ImageCropper
              aspect={3/4}
              imageUrl={this.state.orgData.defaultCoverUrl}
              userId={this.props.user.userId}
              previewStyle={style.coverImage}
              handleSubmit={(imageUrl)=>{
                this.setState({orgData: {...this.state.orgData, defaultCoverUrl: imageUrl}})
              }}
            />
          }>
            <InfoModal content={help.organizationPlaybookCover()}/>
          </AddFieldWrap>
      </div>
    )
  }

  editWebsiteUrl() {
    return (
      <div style={style.fieldContainer}>
        <AddFieldWrap
          initShow={!_.isEmpty(this.state.orgData.websiteUrl)}
          label='Website'
          field={
            <NormalTextField
              style={{width: '80%'}}
              floatingLabelText="Organization Website"
              hintText="Website URL, e.g. http://www.advicecoach.com"
              value={this.state.orgData.websiteUrl}
              onChange={(event)=>{this.setState({orgData: {...this.state.orgData, websiteUrl: event.target.value}})}}/>
          }/>
      </div>
    )
  }

  saveChange() {
    this.props.updateOrgData(this.props.user.userId, this.props.organization.orgId, this.state.orgData);
    this.props.history.goBack();
  }

  render() {
    return (
      <AppFrame auth={this.props.auth}>
        <div style={style.page}>
          <Title text1='Edit' text2='Organization Info' goBack={()=>this.props.history.goBack()}/>
          <br /><br />
          <Loader show={this.props.organization.isLoading} message={'Saving Changes...'}>
            <div style={style.formContainer}>
              {this.eidtProfession()}
              {this.editDefaultLogo()}
              {this.editDefaultCover()}
              {this.editWebsiteUrl()}
            </div>
            <div style={style.buttonContainer}>
              <NormalBigButton label="Cancel" onClick={()=>{this.props.history.goBack()}}/>
              <ActionButton label="Save" onClick={()=>{this.saveChange()}}/>
            </div>
          </Loader>
        </div>
      </AppFrame>
    );
  }
}

function mapStateToProps({user, organization}) {
  return {
    user,
    organization
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(EditOrganizationInfo);
