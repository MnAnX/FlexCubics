import React from 'react';
import TextField from '@material-ui/core/TextField';
import colors from '../../styles/colors';

const style = {
  field: {
    width: '60%',
    fontSize: 28,
  },
}

export default ({...props}) => {
  return (
    <TextField
      style={style.field}
      {...props}
      />
  );
};
