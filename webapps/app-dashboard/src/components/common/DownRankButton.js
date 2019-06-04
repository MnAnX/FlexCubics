import React from 'react';
import IconButton from 'material-ui/IconButton';
import DownArrow from 'material-ui/svg-icons/navigation/arrow-downward';

export default ({nodeType, disabled, onPress}) => {
  switch (nodeType) {
    case 'instruction':
      return (
        <IconButton disabled={disabled} onClick={onPress} tooltip='Move Instruction Down'>
          <DownArrow color='lightGrey'/>
        </IconButton>
      );
      break;
    case 'category':
      return (
        <IconButton disabled={disabled} onClick={onPress} tooltip='Move Category Down'  iconStyle={{backgroundColor: 'lightGrey', borderRadius: '5'}}>
          <DownArrow color='White'/>
        </IconButton>
      );
      break;
    default:
      return null;
  }
};
