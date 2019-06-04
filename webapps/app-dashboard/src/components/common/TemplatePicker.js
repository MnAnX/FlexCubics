import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import _ from 'lodash'
import colors from '../../styles/colors';
import templates from '../../config/templates';

export default ({...props, templateId, onChange}) => {
  return (
    <SelectField
      floatingLabelText="Use Case/Profession"
      value={templateId}
      onChange={(event, index, value)=>{
        onChange(value)
      }}
    >
      {_.map(templates, (template, i)=>(
        <MenuItem key={i} value={template.id} primaryText={template.name} />
      ))}
    </SelectField>
  );
};
