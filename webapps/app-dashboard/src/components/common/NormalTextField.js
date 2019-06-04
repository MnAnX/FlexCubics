import React from 'react';
import TextField from 'material-ui/TextField';
import colors from '../../styles/colors'

const style = {
  error: {
    color: colors.accent,
  },
  floatingLabelFocus: {
    color: colors.accent,
  }
}

export default ({...props, readOnly}) => {
	return (
		<TextField
		 	{...props}
      floatingLabelFocusStyle={style.floatingLabelFocus}
			errorStyle={style.error}
      disabled={readOnly}
      inputStyle={readOnly ? {color: colors.text} : null}
		/>
	);
};
