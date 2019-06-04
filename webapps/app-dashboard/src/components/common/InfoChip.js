import React from 'react';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import colors from '../../styles/colors';

const styles = {
  chip: {
    margin: 4,
  },
};

export default ({label, icon, color, onClick}) => {
  return (
    <Chip
      onClick={onClick}
      style={styles.chip}
      backgroundColor={color}
      labelColor='white'
    >
      <Avatar icon={icon} color='white' backgroundColor={color}/>
      {label}
    </Chip>
  );
};
