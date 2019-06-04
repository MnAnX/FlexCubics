import React, { Component } from "react";
import Keen from "keen-js";
import Query from './Query'
import Chart from './Chart'

import Config from '../../config';

const client = new Keen({
  projectId: Config.keen.projectId,
  readKey: Config.keen.readKey,
});

export default class KeenChart extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <Query
        client={client}
        queryType={this.props.queryType}
        query={this.props.query}
      >
        {data => (
            <Chart
              data={data}
              chartType={this.props.chartType}
              title={this.props.title}
              height={this.props.height}
            />
        )}
      </Query>
    );
  }

}

KeenChart.propTypes = {
  queryType: React.PropTypes.string.isRequired,
  query: React.PropTypes.object.isRequired,
  chartType: React.PropTypes.string.isRequired,
  title: React.PropTypes.string,
  height: React.PropTypes.number,
};

KeenChart.defaultProps = {
  title: "",
};
