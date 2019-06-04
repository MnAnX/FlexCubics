import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import ExpandLess from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import { orange500, cyan500 } from 'material-ui/styles/colors';

import DeleteButton from '../../common/DeleteButton';
import InfoModal from '../../common/InfoModal';
import UpRankButton from '../../common/UpRankButton';
import DownRankButton from '../../common/DownRankButton';

const style = {
  treeview: {
    overflowY: 'hidden',
  },
  treeviewChildren: {
    marginLeft: 30,
  },
  collapsed: {
    height: 0,
  },
  textContainer: {
    paddingLeft: 12,
    width: '50%'
  },
  label: {
    color: cyan500,
    fontSize: 18,
  },
};

class TreeView extends React.PureComponent {
  propTypes: {
    removeNode: PropTypes.func.isRequired,
    uprankNode: PropTypes.func,
    downrankNode: PropTypes.func,
    nodeLabel: PropTypes.node.isRequired,
    collapsed: PropTypes.bool,
    defaultCollapsed: PropTypes.bool,
    disableDelete: PropTypes.bool,
    enableReorder: PropTypes.bool,
    className: PropTypes.string,
    itemClassName: PropTypes.string,
    childrenClassName: PropTypes.string,
    treeViewClassName: PropTypes.string,
    nodeText: PropTypes.string,
    onNodeTextChange: React.PropTypes.func,
    info: PropTypes.object,
    ifTopitem: PropType.bool,
    ifBottomitem: PropType.bool,
  }

  constructor(props) {
    super(props);

    this.state = {
      collapsed: props.defaultCollapsed,
      text: props.nodeText,
      disableDelete: props.disableDelete,
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

    let containerStyle = style.treeviewChildren;
    if (collapsed) {
      containerStyle = style.collapsed;
    }

    let arrowContent = null;
    if (!collapsed) {
      arrowContent = <ExpandMore />;
    } else {
      arrowContent = <ExpandLess />;
    }

    const arrow = (
      <IconButton onClick={this.handleArrowClick}>
        {arrowContent}
      </IconButton>
    );
    return (
      <div style={style.treeview}>
        <div style={style.label}>
          {arrow}
          {nodeLabel}
          <TextField id="node-text-field" style={style.textContainer} value={this.state.text} onChange={this.handleTextChange} hintText={this.props.hintText}/>
          {!this.props.disableDelete && <DeleteButton onPress={()=>this.props.removeNode()}/>}
          {this.props.info && <div style={{display:'inline-block'}}><InfoModal content={this.props.info}/></div>}
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

TreeView.propTypes = {
  nodeText: PropTypes.string.isRequired,
  removeNode: PropTypes.func.isRequired,
  disableDelete: PropTypes.bool,
};

export default TreeView;
