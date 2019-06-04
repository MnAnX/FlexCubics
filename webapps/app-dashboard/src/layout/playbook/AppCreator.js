import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UUID from 'uuid/v4';
import _ from 'lodash';
import Checkbox from 'material-ui/Checkbox';
import IconLockOpen from 'material-ui/svg-icons/action/lock-open';
import IconLocked from 'material-ui/svg-icons/action/lock';
import TextField from 'material-ui/TextField';

import ImageCropper from '../../components/common/ImageCropper';
import NormalBigButton from '../../components/common/NormalBigButton';
import ActionButton from '../../components/common/ActionButton';
import AccentButton from '../../components/common/AccentButton';
import TextButton from '../../components/common/TextButton';
import Padding from '../../components/common/Padding';
import InfoModal from '../../components/common/InfoModal';

import colors from '../../styles/colors';
import layout from '../../styles/layout';
import help from '../../documents/help'

import urlUtils from '../utils/urlUtils'

const style = {
  container: {
    display: 'flex',
    marginLeft: '15%',
    marginRight: '15%',
    marginTop: 60,
    justifyContent: 'center',
  },
  titleText: {
    textAlign: 'center',
    fontSize: 26,
    color: colors.text,
    marginBottom: 20
  },
  descText: {
    textAlign: 'center',
    fontSize: 18,
    color: colors.text,
    marginBottom: 20
  },
  navButtonsBar: {
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'space-around',
    marginTop: 40
  },
  inputText: {
    fontSize: 30,
    color: colors.primary
  },
  image: {
    height: 100
  },
  centered: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}

class AppCreator extends Component {
  steps = [
    "appName",
    "addDesc",
    "authorName",
    "customize",
    "appType",
    "profession",
    "submit"
  ]

  constructor(props) {
    super(props);

    this.state = {
      appInfo: {},
      currentStep: 0,
    }

    this.updateAppInfo = this.updateAppInfo.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.backStep = this.backStep.bind(this);
    this.jumpSteps = this.jumpSteps.bind(this);
    this.renderNavButtons = this.renderNavButtons.bind(this);

    this.renderStepAppName = this.renderStepAppName.bind(this);
    this.renderAddDesc = this.renderAddDesc.bind(this);
    this.renderAuthorName = this.renderAuthorName.bind(this);
    this.renderProfession = this.renderProfession.bind(this);
    this.renderCustomize = this.renderCustomize.bind(this);
    this.renderAppType = this.renderAppType.bind(this);
    this.renderSubmit = this.renderSubmit.bind(this);
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

  renderSteps() {
    let step = this.steps[this.state.currentStep]
    return(
      <div>
        {this.renderStepAppName(step)}
        {this.renderAddDesc(step)}
        {this.renderAuthorName(step)}
        {this.renderProfession(step)}
        {this.renderCustomize(step)}
        {this.renderAppType(step)}
        {this.renderSubmit(step)}
      </div>
    )
  }

  backStep() {
    this.setState({currentStep: this.state.currentStep - 1})
  }

  nextStep() {
    this.setState({currentStep: this.state.currentStep + 1})
  }

  jumpSteps(numSteps) {
    this.setState({currentStep: this.state.currentStep + numSteps})
  }

  renderNavButtons(hasBack, hasNext, isNextDisabled) {
    return (
      <div style={style.navButtonsBar}>
        {hasBack && <NormalBigButton label="Back" onClick={()=>this.backStep()} />}
        {hasNext && <ActionButton label="Next" onClick={()=>this.nextStep()} disabled={isNextDisabled} />}
      </div>
    )
  }

  renderStepAppName(step) {
    return(
      <div>
        {step==="appName" && <div>
          <div style={style.titleText}>{"What do you want to name your Playbook App?"}</div>
          <div style={style.descText}>{"The name of your clinic/company is most popular"}</div>
          <Padding height={20}/>
          <div style={style.centered}>
            <TextField
              style={{width: 400}}
              inputStyle={style.inputText}
              hintText="Type your answer here..."
              name="appName"
              value={this.state.appInfo.appName}
              onChange={this.handleChange}/>
          </div>
          {this.renderNavButtons(false, true, _.isEmpty(this.state.appInfo.appName))}
        </div>}
      </div>
    )
  }

  renderAddDesc(step) {
    return(
      <div>
        {step==="addDesc" && <div>
          <div style={style.titleText}>{"Add a description of your Playbook"}</div>
          <div style={style.centered}>
            <TextButton label="Skip" onClick={()=>this.nextStep()}/>
          </div>
          <Padding height={20}/>
          <div style={style.centered}>
            <TextField
              fullWidth={true}
              hintText="ie. Your custom home treatment instructions for recovering from knee replacement surgery"
              name="appDesc"
              value={this.state.appInfo.appDesc}
              onChange={this.handleChange}/>
          </div>
          {this.renderNavButtons(true, true)}
        </div>}
      </div>
    )
  }

  renderAuthorName(step) {
    return(
      <div>
        {step==="authorName" && <div>
          <div style={style.titleText}>{"Provider"}</div>
          <Padding height={20}/>
          <div style={style.centered}>
            <TextField
              style={{width: 400}}
              inputStyle={style.inputText}
              hintText="e.g. Dr. Jane Smith"
              name="author"
              value={this.state.appInfo.author}
              onChange={this.handleChange}/>
          </div>
          {this.renderNavButtons(true, true, _.isEmpty(this.state.appInfo.author))}
        </div>}
      </div>
    )
  }

  renderProfession(step) {
    let chooseProfession = (templateId)=>{
      this.updateAppInfo("templateId", templateId)
      this.nextStep()
    }
    return(
      <div>
        {step==="profession" && <div>
          <div style={style.titleText}>{"What is your profession?"}</div>
          <Padding height={10}/>
          <div style={style.centered}>
            <TextButton buttonWidth={400} label="Physical Therapist" onClick={()=>chooseProfession(103)}/>
            <TextButton buttonWidth={400} label="Occupational Therapist" onClick={()=>chooseProfession(103)}/>
            <TextButton buttonWidth={400} label="Other" onClick={()=>chooseProfession(100)}/>
          </div>
          {this.renderNavButtons(true, false)}
        </div>}
      </div>
    )
  }

  renderCustomize(step) {
    return(
      <div>
        {step==="customize" && <div>
          <div style={style.titleText}>{"Extra Branding Features"}</div>
          <div style={style.centered}>
            <TextButton label="Skip" onClick={()=>this.nextStep()}/>
          </div>
          <Padding height={10}/>
          <InfoModal content={help.authorPhoto()}><div>{"Profile Photo (300 x 300)"}</div></InfoModal>
          <ImageCropper
            aspect={1/1}
            imageUrl={this.state.appInfo.authorPhotoUrl}
            userId={this.props.userId}
            previewStyle={style.image}
            handleSubmit={(imageUrl)=>{
              this.updateAppInfo('authorPhotoUrl', imageUrl);
            }}/>
          <Padding height={10}/>
          <InfoModal content={help.coverImage()}><div>{"Custom Playbook Cover (420 x 600)"}</div></InfoModal>
          <ImageCropper
            aspect={7/10}
            imageUrl={this.state.appInfo.coverUrl}
            userId={this.props.userId}
            previewStyle={style.image}
            handleSubmit={(imageUrl)=>{
              this.updateAppInfo('coverUrl', imageUrl);
            }}/>
          <Padding height={10}/>
          <InfoModal content={help.logoImage()}><div>{"Logo Image (300 x 300)"}</div></InfoModal>
          <ImageCropper
            aspect={1/1}
            imageUrl={this.state.appInfo.logoImageUrl}
            userId={this.props.userId}
            previewStyle={style.image}
            handleSubmit={(imageUrl)=>{
              this.updateAppInfo('logoImageUrl', imageUrl);
            }}/>
          <InfoModal content={help.websiteUrl()}>
            <TextField
              floatingLabelText="Website URL (optional)"
              hintText="Your website URL here"
              errorText={urlUtils.isValidUrl(this.state.appInfo.websiteUrl) ? "" : "Invalid URL"}
              name="websiteUrl"
              value={this.state.appInfo.websiteUrl}
              onChange={this.handleChange}/>
          </InfoModal>
          <Padding height={20}/>
          <InfoModal content={help.lockActions()}>
            <Checkbox
              label="Lock User Actions"
              uncheckedIcon={<IconLockOpen color={colors.primary}/>}
              checkedIcon={<IconLocked color={colors.primary}/>}
              checked={this.state.appInfo.lockActions}
              onCheck={(event,isInputChecked)=>{this.updateAppInfo("lockActions", isInputChecked)}}
            />
            {this.state.appInfo.lockActions &&
              <TextField
                floatingLabelText="Lock Code"
                hintText="Passcode to lock actions"
                name="actionCode"
                value={this.state.appInfo.actionCode}
                onChange={this.handleChange} />
            }
          </InfoModal>
          {this.renderNavButtons(true, true)}
        </div>}
      </div>
    )
  }

  renderAppType(step) {
    let chooseAppType = (appType)=>{
      this.updateAppInfo("appType", appType)
    }
    return(
      <div>
        {step==="appType" && <div>
          <div style={style.titleText}>{"Choose a type of Playbook"}</div>
          <div style={style.descText}>{"If this Playbook app will be customized for each patient/client, please choose:"}</div>
          <div style={style.centered}>
            <TextButton buttonWidth={400} label="Standard" onClick={()=>{
              chooseAppType("Standard")
              this.nextStep()
            }}/>
          </div>
          <Padding height={20}/>
          <div style={style.descText}>{"If this Playbook app will provide general instructions, please choose:"}</div>
          <div style={style.centered}>
            <TextButton buttonWidth={400} label="Library Only" onClick={()=>{
              chooseAppType("LibraryOnly")
              this.jumpSteps(2)
            }}/>
          </div>
          {this.renderNavButtons(true, false)}
        </div>}
      </div>
    )
  }

  renderSubmit(step) {
    return(
      <div>
        {step==="submit" && <div>
          <div style={style.titleText}>{"Ready to create the Playbook?"}</div>
          <Padding height={10}/>
          {this.renderNavButtons(true)}
          <ActionButton backgroundColor={colors.accent} label="Create" onClick={()=>this.props.onSubmit()}/>
        </div>}
      </div>
    )
  }

  render() {
    return (
      <div style={style.container}>
        {this.renderSteps()}
      </div>
    );
  }
}

AppCreator.propTypes = {
  onChange: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  isOrgMember: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};

export default AppCreator;
