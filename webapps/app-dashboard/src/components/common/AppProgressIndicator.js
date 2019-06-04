import React from 'react';
import PropTypes from 'prop-types';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import Title from './Title'
import colors from '../../styles/colors';

const styles = {
  container: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 30
  },
  titleText1: {
    display: 'inline-block',
    color: colors.primary
  },
  titleText2: {
    display: 'inline-block',
  },
  label: {
    color: colors.text,
  },
};

class AppProgressIndicator extends React.Component {

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return '';
      case 1:
        return '';
      case 2:
        return 'See playbook demo on your mobile device. Make sure you have downloaded the AdviceCoach app. In Demo mode, you can edit profile and content information.';
      case 3:
        return 'Invite people to use your playbook.';
      default:
        return 'Invalid status.';
    }
  }

  render() {
    if (this.props.targetDevice === 'mobile'){
      return(
        <div></div>
      );
    }
    return (
      <div style={styles.container}>
        <Title text1='Create your Playbook App in' text2='only 4 steps!' goBack={this.props.goBack}/>
        <div style={{width: '80%', maxWidth: 800, margin: 'auto'}}>
          <Stepper activeStep={this.props.stepIndex}>
            <Step>
              <StepLabel style={styles.label}>Basic Profile</StepLabel>
            </Step>
            <Step>
              <StepLabel style={styles.label}>Manage Library</StepLabel>
            </Step>
            <Step>
              <StepLabel style={styles.label}>See Demo</StepLabel>
            </Step>
            <Step>
              <StepLabel style={styles.label}>Publish App</StepLabel>
            </Step>
          </Stepper>
        </div>
      </div>
    );
  }
}

AppProgressIndicator.propTypes = {
	stepIndex: PropTypes.number.isRequired,
};

export default AppProgressIndicator;
