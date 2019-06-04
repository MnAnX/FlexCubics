import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import colors from '../../styles/colors';

const style = {
  wrap: {
    margin: 20,
    borderRadius:16,
  },
	button: {
    width: 200,
    borderRadius:16,
    borderWidth: 1,
    borderColor: '#fff',
	},
  label: {
    fontSize: 20,
    textTransform: 'none',
    color: 'white'
  }
}

export default ({...props}) => {
  return (
    <RaisedButton
      {...props}
      backgroundColor={colors.action}
      style={style.wrap}
      buttonStyle={style.button}
      labelStyle={style.label} />
  );
};
