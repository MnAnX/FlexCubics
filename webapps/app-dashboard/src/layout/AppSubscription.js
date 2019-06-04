import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/subscriptions';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Loader from 'react-loader-advanced';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';

import AppFrame from './AppFrame';
import SmallActionButton from '../components/common/SmallActionButton';
import NormalFlatButton from '../components/common/NormalFlatButton';
import Title from '../components/common/Title';
import Subtitle from '../components/common/Subtitle';
import InfoText from '../components/common/InfoText';
import InfoDialogue from '../components/common/InfoDialogue';
import WrapDialogue from '../components/common/WrapDialogue';
import StripeCheckout from './subscription/StripeCheckout'

import colors from '../styles/colors';
import layout from '../styles/layout';
import info from '../documents/info'
import config from '../config'
import subPlans from '../config/subscriptionPlans'

import { submitSubscription } from '../services/directcalls';

const style = {
  planContainer: {
    height: 300,
    width: 300,
    margin: 20,
    textAlign: 'center',
    display: 'inline-block',
  },
  planTitle: {
    color: colors.accent,
    fontSize: 28,
    marginTop: 60
  },
  planPrice: {
    color: colors.primary,
    fontSize: 32,
    marginTop: 40,
    marginBottom: 20
  }
};

class AppSubscription extends Component {
  constructor(props) {
    super(props);

    let appId = props.match.params.appId;
    let appInfo = this.props.apps.appInfos[appId];
    this.state = {
      appId,
      appInfo,
      subData: {},
      trailDaysLeft: 0,
      dialogue: {},
      isProcessingCard : false,
      chosenSubPlan: subPlans.monthly25,
    };

    this.renderSubPlanBlock = this.renderSubPlanBlock.bind(this)
    this.renderChooseSubscriptionPlan = this.renderChooseSubscriptionPlan.bind(this)
    this.renderReferralText = this.renderReferralText.bind(this)
  }

  componentWillMount() {
    this.props.getSubscriptionData(this.props.userId, this.state.appId)
  }

  componentWillReceiveProps(nextProps) {
    let appInfo = nextProps.apps.appInfos[this.state.appId];
    if(appInfo) {
      this.setState({
        appInfo,
      });
    };
    let subData = nextProps.subscriptions.appsSubData[this.state.appId];
    if(subData) {
      let trailDaysLeft = this.getTrailDaysLeft(subData.publishedTime)
      this.setState({
        subData,
        trailDaysLeft
      });
    };
  }

  onSubmitSubscription(cardToken) {
    this.refs.paymentDialogue.close();
    this.setState({
      isProcessingCard: true
    });
    submitSubscription(this.props.userId, this.state.appId, cardToken.id, this.state.chosenSubPlan.id, this.state.chosenSubPlan.name, (ret)=>{
      this.setState({
        isProcessingCard: false
      });
      // refresh subscription data
      this.props.getSubscriptionData(this.props.userId, this.state.appId)
      // pop up dialogue
      this.setState({
        dialogue: {
          title: 'We Processed Your Card',
          content: <div style={{color: ret.isSuccessful ? colors.text : colors.error}}>{ret.message}</div>,
        },
      });
      this.refs.infoDialogue.open();
    })
  }

  getTrailDaysLeft(publishedDate) {
    var today = moment(new Date());
    var published = moment(publishedDate, 'MMMM Do YYYY, h:mm:ss a');
    var diffDays = today.diff(published, 'days');
    let trailDaysLeft = config.system.freeTrailDays - diffDays;
    let validDaysLeft = trailDaysLeft < 0 ? 0 : trailDaysLeft;
    return validDaysLeft;
  }

  getFormatDate(date) {
    return moment(date, 'MMMM Do YYYY, h:mm:ss a').format('MMMM Do, YYYY')
  }

  renderSubPlanBlock(title, price, plan) {
    return (
      <Paper style={style.planContainer} zDepth={2}>
        <div style={style.planTitle}>{title}</div>
        <div style={style.planPrice}>{price}</div>
        <SmallActionButton label="Choose" onClick={()=>{
          this.setState({chosenSubPlan: plan})
          this.refs.paymentDialogue.open();
        }}/>
      </Paper>
    )
  }

  renderChooseSubscriptionPlan() {
    return (
      <div>
        <br /><br /><Divider /><br />
        <div style={{color: colors.primary, fontSize: 24}}>Please choose a plan from below and start a subscription before your free trail ends!</div>
        <br />
        <div style={layout.common.row}>
          {this.renderSubPlanBlock('Monthly Plan A', '$25 / month', subPlans.monthly25)}
          {this.renderSubPlanBlock('Yearly Plan A', '$280 / year', subPlans.yearly280)}
        </div>
        <br />
        <div style={layout.common.row}>
          {this.renderSubPlanBlock('Monthly Plan B', '$45 / month', subPlans.monthly45)}
          {this.renderSubPlanBlock('Yearly Plan B', '$495 / year', subPlans.yearly495)}
        </div>
        <br />
        <div style={layout.common.row}>
          {this.renderSubPlanBlock('Monthly Plan C', '$75 / month', subPlans.monthly75)}
          {this.renderSubPlanBlock('Yearly Plan C', '$825 / year', subPlans.yearly825)}
        </div>
        <br />
      </div>
    )
  }

  renderReferralText() {
    return (
      <Paper style={{padding: 10}}>
        <p>Refer and Get Free Months: </p>
        <p>Do you know a practitioner who could benefit from having a Playbook?
          The highest compliment or thanks we could receive would be a referral from you.
          For each referral that signs up for our services you will receive a free month!
          In return your referral will also receive a discount of $25 off of their subscription.
          There is no limit to the number of referrals you can make.</p>
        <p>Send name/email of your referrals to referrals@advicecoach.com</p>
      </Paper>
    )
  }

  render() {
    return (
      <AppFrame auth={this.props.auth}>
        <div style={layout.common.page}>
          <Loader show={this.props.subscriptions.isLoading} message={'Loading...'}>
          <Loader show={this.state.isProcessingCard} message={'Processing Card...'}>
            <Title text1='Playbook' text2='Subscription' goBack={()=>this.props.history.goBack()}/>
            <br /><br /><br />
            <div style={layout.common.detailsContainer}>
              <Subtitle text={this.state.appInfo.appName} />
              <InfoText label='Playbook App Code:' value={this.state.appId} />
              {this.state.subData.hasSubscription && <div>
                <InfoText label='Subscription Started On:' value={this.getFormatDate(this.state.subData.subStartedTime)} />
                <InfoText label='Your Subscription Plan Is:' value={this.state.subData.subData ? this.state.subData.subData.planName : ''} />
              </div>}
              <br />
              {!this.state.subData.hasSubscription && this.renderChooseSubscriptionPlan()}
              {this.renderReferralText()}
              <WrapDialogue ref="paymentDialogue"
                title={this.state.chosenSubPlan.name}
                content={<StripeCheckout onSubmit={(token)=>this.onSubmitSubscription(token)}/>}/>
              <InfoDialogue ref="infoDialogue" title={this.state.dialogue.title} content={this.state.dialogue.content}/>
            </div>
          </Loader>
          </Loader>
        </div>
      </AppFrame>
    );
  }
}

function mapStateToProps({user, apps, subscriptions}) {
  return {
    userId: user.userId,
    apps,
    subscriptions
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AppSubscription);
