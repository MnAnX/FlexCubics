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
	},
  label: {
    fontSize: 20,
    textTransform: 'none',
  }
}

export default ({buttonWidth, isSelected, ...props}) => {
  let buttonStyle = style.button;
  if(buttonWidth) {
    buttonStyle = {...style.button, ...{width: buttonWidth}}
  }
  let labelStyle = style.label
  if(isSelected) {
    labelStyle = {...style.label, ...{color: colors.primary}}
  }

  return (
    <RaisedButton
      {...props}
      style={style.wrap}
      buttonStyle={buttonStyle}
      labelStyle={labelStyle}
      />
  );
};
