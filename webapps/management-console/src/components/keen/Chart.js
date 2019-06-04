import React, { Component } from 'react'
import { getChangedProps } from './util'
import Keen from "keen-js";
import 'keen-dataviz/dist/keen-dataviz.css'

export default class Chart extends Component {

  constructor(props){
    super(props);

    this.initChart = this.initChart.bind(this);
    this.sync = this.sync.bind(this);
  }

  componentDidMount() {
    this.sync()
  }

  componentWillReceiveProps(nextProps) {
    this.sync()
  }

  componentWillUnmount() {
    this.dataviz.destroy()
  }

  initChart() {
    this.dataviz = new Keen.Dataviz()
      .el(this._chartRef)
      .chartType(this.props.chartType)
      .title(this.props.title)
      .height(this.props.height)
      .prepare();
  }

  sync() {
    if(!this.dataviz) {
      this.initChart();
    }
    for (const prop of Object.keys(this.props)) {
      this.dataviz[prop](this.props[prop])
    }
    if (this.props.data) {
      this.dataviz.render()
    }
    else {
      this.dataviz.prepare()
    }
  }

  render() {
    return (
      <div ref={(c) => this._chartRef = c} />
    );
  }
}

Chart.propTypes = {
  chartType: React.PropTypes.string.isRequired,
  title: React.PropTypes.string,
  height: React.PropTypes.number,
};
