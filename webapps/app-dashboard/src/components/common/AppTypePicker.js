import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import _ from 'lodash'
import colors from '../../styles/colors';
import apptypes from '../../config/apptypes';

export default ({...props, appType, onChange}) => {
  return (
    <SelectField
      floatingLabelText="Playbook Type"
      floatingLabelStyle={{color: colors.accent}}
      value={appType}
      onChange={(event, index, value)=>{
        onChange(value)
      }}
    >
      {_.map(apptypes, (apptype, i)=>(
        <MenuItem key={i} value={apptype.value} primaryText={apptype.name} />
      ))}
    </SelectField>
  );
};
