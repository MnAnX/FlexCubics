import React from 'react';
import KeenChart from '../keen/KeenChart'

export default () => {
  let title = "Active Users of Last 30 Days"
  let chartType = "linechart"
  let queryType = "count_unique"
  let query = {
    event_collection: "active_user_app",
    interval: "daily",
    target_property: "userId",
    timeframe: "this_30_days",
  }

  return(
    <KeenChart queryType={queryType} query={query} chartType={chartType} title={title} height={240}/>
  );
};
