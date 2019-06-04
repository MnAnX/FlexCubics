import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class InfoDialogue extends Component {
  state = {
    open: false,
    postAction: ()=>{}
  };

  open = () => {
    this.setState({open: true});
  };

  close = () => {
    this.setState({open: false});
  };

  setPostAction(postAction) {
    this.setState({postAction})
  }

  handleClose = () => {
    this.setState({open: false});
    this.state.postAction();
  };

  render() {
    const actions = [
        <FlatButton
          label="OK"
          onClick={this.handleClose}
        />,
      ];

    return (
      <div>
        <Dialog
          title={this.props.title}
          actions={actions}
          modal={false}
          autoScrollBodyContent={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          {this.props.content}
        </Dialog>
      </div>
    );
  }
}

InfoDialogue.propTypes = {
	title: PropTypes.string,
  content: PropTypes.string,
};

export default InfoDialogue;
