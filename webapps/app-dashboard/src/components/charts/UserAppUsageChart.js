import React from 'react';
import KeenChart from '../keen/KeenChart'

export default ({userId, appId}) => {
  let title = "Number of usages on the Playbook each Day (30 days)"
  let chartType = "line"
  let queryType = "count"
  let query = {
    event_collection: "active_user_app",
    filters: [{"operator":"eq","property_name":"appId","property_value":appId},{"operator":"eq","property_name":"userId","property_value":userId}],
    interval: "daily",
    timeframe: "this_30_days",
  }

  return(
    <KeenChart queryType={queryType} query={query} chartType={chartType} title={title} height={200}/>
  );
};
