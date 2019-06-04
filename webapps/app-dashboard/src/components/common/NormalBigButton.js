import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  wrap: {
    margin: 20,
    borderRadius:16,
  },
	button: {
    width: 300,
    borderRadius:16,
    borderWidth: 1,
    borderColor: '#808080',
	},
  label: {
    fontSize: 20,
    textTransform: 'none',
  }
}

export default ({buttonWidth, ...props}) => {
  let buttonStyle = style.button;
  if(buttonWidth) {
    buttonStyle = {...style.button, ...{width: buttonWidth}}
  }
  return (
    <RaisedButton
      {...props}
      style={style.wrap}
      buttonStyle={buttonStyle}
      labelStyle={style.label} />
  );
};
