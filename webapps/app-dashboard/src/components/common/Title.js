import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import IconBack from 'material-ui/svg-icons/navigation/chevron-left';
import colors from '../../styles/colors';

const style = {
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    textAlign: 'center',
    fontSize: 32
  },
  titleText1: {
    display: 'inline-block',
    color: colors.primary
  },
  titleText2: {
    display: 'inline-block',
  },
  backButtonLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary
  },
}

export default ({text1, text2, goBack}) => {
  return (
    <div>
      {goBack && <FlatButton
        style={style.backButtonPos}
        labelStyle={style.backButtonLabel}
        label="Back"
        icon={<IconBack color={colors.primary} />}
        onClick={()=>goBack()} />}
      <div style={style.title}>
        <span style={style.titleText1}>{text1}</span>
        { " " }
        <span style={style.titleText2}>{text2}</span>
      </div>
    </div>
  );
};
