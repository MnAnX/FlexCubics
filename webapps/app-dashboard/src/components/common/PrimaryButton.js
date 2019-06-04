import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

export default ({label, disabled, onPress}) => {
  return (
    <RaisedButton
      style={{margin: 20}}
      label={label}
      disabled={disabled}
      onClick={onPress}
      primary={true} />
  );
};
