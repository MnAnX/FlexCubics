import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconAdd from 'material-ui/svg-icons/content/add-box';

import NormalFlatButton from './NormalFlatButton';
import colors from '../../styles/colors';
import layout from '../../styles/layout';

const style = {
  label: {
    color: colors.primary,
  },
}

class AddFieldWrap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showField: props.initShow,
    }
  }

  show = () => {
    this.setState({showField: true});
  };

  hide = () => {
    this.setState({showField: false});
  };

  render() {
    return (
      <div>
        {!this.state.showField &&
          <NormalFlatButton
            style={layout.common.buttonAlign}
            icon={<IconAdd color='lightGrey'/>}
            label={this.props.label}
            onClick={()=>this.setState({showField: true})}/>
        }
        {this.state.showField &&
          <div>
            <div style={style.label}>{this.props.label}</div>
            {this.props.field}
          </div>
        }
        {this.props.children}
      </div>
    );
  }
}

AddFieldWrap.propTypes = {
	label: PropTypes.string,
  field: PropTypes.object,
  initShow: PropTypes.bool,
};

export default AddFieldWrap;
