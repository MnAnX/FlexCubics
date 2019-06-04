import moment from 'moment'
import _ from 'lodash'

export const getLocalDT = time => {
  var localDT = ' '
  if(!_.isEmpty(time)) {
    let gmtDateTime = moment.utc(time, "YYYY-MM-DD hh:mmA")
    localDT = gmtDateTime.local().format('YYYY-MM-DD h:mm A');
  }
  return localDT;
};
