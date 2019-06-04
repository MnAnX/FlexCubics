import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import colors from '../../styles/colors';

const style = {
  wrap: {
    borderRadius:16,
  },
	button: {
    borderRadius:16,
    borderWidth: 1,
	},
  label: {
    fontSize: 16,
    color: colors.accent,
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
