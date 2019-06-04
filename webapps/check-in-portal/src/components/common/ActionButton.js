import React from 'react';
import Button from '@material-ui/core/Button';
import colors from '../../styles/colors';

const style = {
  button: {
    margin: 20,
    width: '60%',
    textTransform: 'none',
    fontSize: 28,
    borderRadius:30,
  },
}

export default ({...props, label}) => {
  return (
    <Button
      variant="contained"
      size="large"
      color="primary"
      style={style.button}
      {...props}
    >
      {label}
    </Button>
  );
};
