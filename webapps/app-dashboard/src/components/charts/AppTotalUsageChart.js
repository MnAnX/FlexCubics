import React from 'react';
import KeenChart from '../keen/KeenChart'

export default ({appId}) => {
  let title = "Number of Users on the Playbook each Day (30 days)"
  let chartType = "line"
  let queryType = "count_unique"
  let query = {
    event_collection: "active_user_app",
    target_property: "userId",
    filters: [{"operator":"eq","property_name":"appId","property_value":appId}],
    interval: "daily",
    timeframe: "this_30_days",
  }

  return(
    <KeenChart queryType={queryType} query={query} chartType={chartType} title={title} height={200}/>
  );
};
