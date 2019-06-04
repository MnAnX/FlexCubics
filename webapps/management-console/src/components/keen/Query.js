import React, { Component } from 'react'
import Keen from "keen-js";

export default class Query extends Component {

  state = {
    data: null
  }

  run(props) {
    console.log("===== sending query")
    let query = new Keen.Query(this.props.queryType, this.props.query);
    return this.props.client
            .run(query)
            .then(data => {
              this.setState({ data })
              console.log("===== got data", data)
            })
  }

  componentWillMount() {
    this.run(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.run(nextProps)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.data !== this.state.data
  }

  render() {
    if (!this.state.data) {
      return null
    }
    return this.props.children(this.state.data)
  }
}

Query.propTypes = {
  client: React.PropTypes.object.isRequired,
  queryType: React.PropTypes.string.isRequired,
  query: React.PropTypes.object.isRequired,
};
