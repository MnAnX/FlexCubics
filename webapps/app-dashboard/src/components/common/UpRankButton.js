import React from 'react';
import IconButton from 'material-ui/IconButton';
import UpArrow from 'material-ui/svg-icons/navigation/arrow-upward';

export default ({nodeType, disabled, onPress}) => {
  switch (nodeType) {
    case 'instruction':
      return (
        <IconButton disabled={disabled} onClick={onPress} tooltip='Move Instruction Up'>
          <UpArrow color='lightGrey'/>
        </IconButton>
      );
      break;
    case 'category':
      return (
        <IconButton disabled={disabled} onClick={onPress} tooltip='Move Category Up' iconStyle={{backgroundColor: 'lightGrey', borderRadius: '5'}}>
          <UpArrow color='White'/>
        </IconButton>
      );
      break;
    default:
      return null;
  }
};
