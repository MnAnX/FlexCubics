import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconHelp from 'material-ui/svg-icons/action/help';
import colors from '../../styles/colors';

const style = {
  content: {
    display: 'flex',
    justifyContent: 'center',
    color: 'grey'
  },
  defaultContentStyle: {
    width: 500
  },
  row: {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'center',
  }
};

class InfoModal extends Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({open: true});
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
      <div style={style.row}>
        {this.props.children}
        <IconButton onClick={this.handleOpen}><IconHelp color='lightGrey'/></IconButton>
        <Dialog
          contentStyle={this.props.style ? this.props.style : style.defaultContentStyle}
          title={this.props.title}
          actions={actions}
          modal={false}
          autoScrollBodyContent={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div style={style.content}>
            {this.props.content}
          </div>
        </Dialog>
      </div>
    );
  }
}

InfoModal.propTypes = {
	title: PropTypes.string,
	content: PropTypes.object,
  style: PropTypes.object,
};

export default InfoModal;
