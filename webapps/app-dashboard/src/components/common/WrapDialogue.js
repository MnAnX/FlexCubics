import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class WrapDialogue extends Component {
  state = {
    open: false,
  };

  open = () => {
    this.setState({open: true});
  };

  close = () => {
    this.setState({open: false});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    return (
      <div>
        <Dialog
          title={this.props.title}
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

WrapDialogue.propTypes = {
	title: PropTypes.string,
  content: PropTypes.string,
};

export default WrapDialogue;
