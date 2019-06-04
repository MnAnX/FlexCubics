import React from 'react';
import Paper from 'material-ui/Paper';

import colors from '../../styles/colors';
import layout from '../../styles/layout';

const style = {
  wrap: {
    padding: 20,
    paddingTop: 10,
  },
	title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
	},
}

export default ({title, text, children}) => {
  return (
    <Paper style={layout.common.paperContainer}>
      <p style={style.title}>{title}</p>
      <p>{text}</p>
      {children}
    </Paper>
  );
};
