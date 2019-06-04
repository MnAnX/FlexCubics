import React from 'react';
import FlatButton from 'material-ui/FlatButton';

const styles = {
  label: {
    fontSize: 16,
    textTransform: 'none',
  }
}

export default ({...props}) => {
  return (
    <FlatButton
      {...props}
      labelStyle={styles.label} />
  );
};
