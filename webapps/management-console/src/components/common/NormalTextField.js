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

export default ({...props}) => {
	return (
		<TextField
		 	{...props}
      floatingLabelFocusStyle={style.floatingLabelFocus}
			errorStyle={style.error}
		/>
	);
};
