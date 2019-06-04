import React from 'react';
import KeenChart from '../keen/KeenChart'

export default () => {
  let title = "New Users of Last 7 Days"
  let chartType = "table"
  let queryType = "extraction"
  let query = {
    event_collection: "auth0_signups",
    timeframe: "this_7_days",
  }

  return(
    <KeenChart queryType={queryType} query={query} chartType={chartType} title={title}/>
  );
};
