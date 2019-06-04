import React from 'react';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete-forever';

export default ({disabled, onPress, tooltip}) => {
  return (
    <IconButton disabled={disabled} onClick={onPress} tooltip={tooltip}>
      <Delete color='lightGrey'/>
    </IconButton>
  );
};
