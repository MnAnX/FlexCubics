import React from 'react';
import colors from '../../styles/colors';

const style = {
  wrap: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
}

export default ({title, src, height}) => {
  return (
    <div style={style.wrap}>
      <img style={{height}} src={src} />
      <br />
      {title}
    </div>
  );
};
