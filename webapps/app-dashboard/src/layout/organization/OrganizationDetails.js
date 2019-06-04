import React, { Component } from 'react';
import InfoText from '../../components/common/InfoText';
import templates from '../../config/templates';

const style = {
  imageCover: {
    height: 200
  },
  imageLogo: {
    height: 50
  },
};

export default ({orgInfoData}) => {
  let template = templates[orgInfoData.orgData.templateId]
  return (
    <div>
      {orgInfoData.orgInfo.orgDescription && <p>
        <div>Description:</div>
        <div>{orgInfoData.orgInfo.orgDescription}</div>
      </p>}
      <InfoText label='Profession:' value={template ? template.name : ''}/>
      <InfoText label='Logo:' />
      {orgInfoData.orgData.defaultLogoUrl && <img style={style.imageLogo} src={orgInfoData.orgData.defaultLogoUrl} />}
      <InfoText label='Playbook Cover:' />
      {orgInfoData.orgData.defaultCoverUrl && <img style={style.imageCover} src={orgInfoData.orgData.defaultCoverUrl} />}
      <InfoText label='Website:' />
      {orgInfoData.orgData.websiteUrl && <a target="_blank" href={orgInfoData.orgData.websiteUrl}>{orgInfoData.orgData.websiteUrl}</a>}
    </div>
  )
};
