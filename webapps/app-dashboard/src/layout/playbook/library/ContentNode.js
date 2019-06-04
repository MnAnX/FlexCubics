import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import ExpandLess from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import { orange500, cyan500 } from 'material-ui/styles/colors';
import IconDelete from 'material-ui/svg-icons/action/delete-forever';
import _ from 'lodash'

import UpRankButton from '../../../components/common/UpRankButton';
import DownRankButton from '../../../components/common/DownRankButton';

import colors from '../../../styles/colors'

const style = {
  treeview: {
    overflowY: 'hidden',
  },
  treeviewChildren: {
    marginBottom: 30
  },
  collapsed: {
    height: 0,
  },
  textContainer: {
    paddingLeft: 12,
    width: '50%'
  },
  label: {
    marginLeft: 30,
    color: colors.primary,
    fontSize: 18,
  },
  categoryTextStyle: {
    color: colors.accent,
    fontSize: 18,
  }
};

class ContentNode extends React.PureComponent {
  propTypes: {
    nodeText: PropTypes.string.isRequired,
    removeNode: PropTypes.func.isRequired,
    removeNode: PropTypes.func.isRequired,
    uprankNode: PropTypes.func,
    downrankNode: PropTypes.func,
    nodeLabel: PropTypes.node.isRequired,
    collapsed: PropTypes.bool,
    expanded: PropTypes.bool,
    disableDelete: PropTypes.bool,
    enableReorder: PropTypes.bool,
    className: PropTypes.string,
    itemClassName: PropTypes.string,
    childrenClassName: PropTypes.string,
    treeViewClassName: PropTypes.string,
    nodeText: PropTypes.string,
    onNodeTextChange: React.PropTypes.func,
    ifTopitem: PropType.bool,
    ifBottomitem: PropType.bool,
    childMarginOffset: PropType.number,
  }

  constructor(props) {
    super(props);

    this.state = {
      collapsed: !props.expanded,
      text: props.nodeText,
      disableDelete: props.disableDelete,
      childMarginOffset: props.childMarginOffset? props.childMarginOffset : 0,
    };
    this.handleArrowClick = this.handleArrowClick.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      text: props.nodeText
    });
  }

  handleArrowClick(...args) {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  handleTextChange(event) {
    let newText = event.target.value;
    this.setState({
      text: newText
    });
    if (this.props.onNodeTextChange) {
      this.props.onNodeTextChange(newText);
    }
  }

  render() {
    const {
      collapsed = this.state.collapsed,
        className = '',
        itemClassName = '',
        treeViewClassName = '',
        childrenClassName = '',
        nodeLabel,
        children,
        defaultCollapsed,
        ...rest
    } = this.props;

    let containerStyle = {...style.treeviewChildren, ...{marginLeft: this.state.childMarginOffset}};
    if (collapsed) {
      containerStyle = style.collapsed;
    }

    let arrow = null;
    if(this.props.className !== 'header') {
      if (!collapsed) {
        arrow = (<IconButton tooltip={`Collapse ${this.props.displayName}`} onClick={this.handleArrowClick}><ExpandMore /></IconButton>)
      } else {
        arrow = (<IconButton tooltip={`Expand ${this.props.displayName}`} onClick={this.handleArrowClick}><ExpandLess /></IconButton>)
      }
    }

    return (
      <div style={style.treeview}>
        <div style={style.label}>
          {arrow}
          {nodeLabel}
          {this.props.className !== 'header' &&
            <TextField id="node-text-field"
              style={style.textContainer}
              inputStyle={this.props.className === 'category' ? style.categoryTextStyle : null}
              errorText={_.isEmpty(this.state.text) ? "This field is required" : ""}
              value={this.state.text}
              onChange={this.handleTextChange}
              hintText={this.props.hintText} />}
          {this.props.className !== 'header' && <IconButton tooltip={`Delete ${this.props.displayName}`} onClick={()=>this.props.removeNode()}><IconDelete/></IconButton>}
          {this.props.enableReorder && !this.props.ifTopitem && <UpRankButton nodeType = {this.props.className} onPress={()=>{this.props.uprankNode()}}/>}
          {this.props.enableReorder && !this.props.ifBottomitem && <DownRankButton nodeType = {this.props.className} onPress={()=>{this.props.downrankNode()}}/>}
        </div>
        <div style={containerStyle}>
          {children}
        </div>
      </div>
    );
  }
}

export default ContentNode;
