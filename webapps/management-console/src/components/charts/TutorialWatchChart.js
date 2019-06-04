import React from 'react';
import KeenChart from '../keen/KeenChart'

export default ({videoId}) => {
  let title = "Number of users watched the tutorial"
  let chartType = "line"
  let queryType = "count_unique"
  let query = {
    event_collection: "watch_tutorial",
    target_property: "userId",
    filters: [{"operator":"eq","property_name":"videoId","property_value":videoId}],
    interval: "daily",
    timeframe: "this_30_days",
  }

  return(
    <KeenChart queryType={queryType} query={query} chartType={chartType} title={title} height={200}/>
  );
};
