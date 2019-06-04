import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  wrap: {
    borderRadius:16,
  },
	button: {
    borderRadius:16,
    borderWidth: 1,
    borderColor: '#fff',
	},
  label: {
    fontSize: 16,
    textTransform: 'none',
  }
}

export default ({...props}) => {
  return (
    <RaisedButton
      {...props}
      style={style.wrap}
      buttonStyle={style.button}
      labelStyle={style.label} />
  );
};
