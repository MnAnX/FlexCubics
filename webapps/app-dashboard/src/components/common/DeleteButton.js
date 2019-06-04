import React from 'react';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete-forever';

export default ({disabled, onClick, tooltip}) => {
  return (
    <IconButton disabled={disabled} onClick={onClick} tooltip={tooltip}>
      <Delete />
    </IconButton>
  );
};
