import React from 'react';
import IconButton from 'material-ui/IconButton';
import Add from 'material-ui/svg-icons/content/add-circle';

export default ({disabled, onPress, tooltip}) => {
  return (
    <IconButton disabled={disabled} onClick={onPress} tooltip={tooltip}>
      <Add />
    </IconButton>
  );
};
