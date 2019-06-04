import { find, isEmpty } from 'lodash'
import TemplateConfig from './template';

export const getTemplateConfig = (templateId) => {
  let templateConfig = find(TemplateConfig, { 'templateId': templateId });
  if(isEmpty(templateConfig)) {
    templateConfig = TemplateConfig.default;
  }

  return templateConfig;
};
