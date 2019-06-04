import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class ActionDialogue extends Component {
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

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    const actions = [
        <FlatButton
          label="Cancel"
          onClick={this.handleClose}
        />,
        <FlatButton
          label="Confirm"
          primary={true}
          onClick={()=>{
            this.props.onConfirm()
            this.handleClose()
          }}
        />,
      ];

    return (
      <div>
        <Dialog
          title={this.props.title}
          actions={actions}
          modal={true}
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

ActionDialogue.propTypes = {
	title: PropTypes.string,
  content: PropTypes.string,
  onConfirm: PropTypes.func,
};

export default ActionDialogue;
