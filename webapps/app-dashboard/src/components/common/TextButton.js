import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import colors from '../../styles/colors'

const style = {
  wrap: {
    margin: 6,
    borderRadius: 2,
  },
	button: {
    width: 200,
    borderRadius:2,
    borderWidth: 1,
    borderColor: colors.primary,
	},
  label: {
    fontSize: 20,
    color: colors.primary,
    textTransform: 'none',
  }
}

export default ({buttonWidth, isSelected, ...props}) => {
  let buttonStyle = style.button;
  let labelStyle = style.label
  if(buttonWidth) {
    buttonStyle = {...style.button, ...{width: buttonWidth}}
  }
  if(isSelected) {
    labelStyle = {...style.label, ...{color: 'white'}}
  }

  return (
    <RaisedButton
      {...props}
      style={style.wrap}
      buttonStyle={buttonStyle}
      labelStyle={labelStyle}
      primary={isSelected}
      />
  );
};
