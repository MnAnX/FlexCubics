import React from 'react';
import {Link} from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

const style = {
  field: {
    width: '60%',
    fontSize: 28,
  },
}

export default ({...props, goBack}) => {
  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <Button component={Link} to={goBack}>{"< Back"}</Button>
      </Toolbar>
    </AppBar>
  );
};
