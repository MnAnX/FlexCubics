import React from 'react';
import KeenChart from '../keen/KeenChart'

export default ({videoId}) => {
  let title = "Active Users during Last 30 Days"
  let chartType = "metric"
  let queryType = "count_unique"
  let query = {
    event_collection: "active_user_app",
    target_property: "userId",
    timeframe: "this_30_days",
  }

  return(
    <KeenChart queryType={queryType} query={query} chartType={chartType} title={title} height={160}/>
  );
};
