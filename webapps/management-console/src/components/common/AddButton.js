import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const styles = {
  button: {
    margin: 6,
  },
};

export default ({disabled, onPress}) => {
  return (
    <FloatingActionButton mini={true} disabled={disabled} onClick={onPress} style={styles.button}>
      <ContentAdd />
    </FloatingActionButton>
  );
};
