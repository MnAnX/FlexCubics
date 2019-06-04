import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ReactPlayer from 'react-player'

import AccentButton from './AccentButton'
import colors from '../../styles/colors';
import { Stats } from '../../services/stats';

const style = {
  position: {
    display: 'flex',
    justifyContent: 'center'
  },
  content: {
    justifyContent: 'center',
  },
};

class TutorialModal extends Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({open: true});
    // record to analysis
    Stats.watchTutorial(this.props.userId, this.props.videoId);
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    const actions = [
        <FlatButton
          label="OK"
          onClick={this.handleClose}
        />,
      ];

    return (
      <div style={style.position}>
        <AccentButton label={this.props.title} onClick={this.handleOpen} />
        <Dialog
          title={this.props.title}
          actions={actions}
          modal={false}
          autoScrollBodyContent={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div style={{justifyContent: 'center'}}>
            <ReactPlayer url={this.props.videoUrl} playing controls={true} height={400} />
          </div>
        </Dialog>
      </div>
    );
  }
}

TutorialModal.propTypes = {
  userId: PropTypes.number.isRequired,
  videoId: PropTypes.string.isRequired,
	title: PropTypes.string,
	videoUrl: PropTypes.string,
};

export default TutorialModal;
