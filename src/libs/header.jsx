import React, { Component } from 'react';

export default class ReportHeader extends Component {
  constructor(props) {
    super(props);
    this.state = { header: [] };
  }

  componentDidMount() {
    this._setInitialState(this.props.data);
  }

  render() {
    return (
      <div className="header">
        {this.state.header}
      </div>
    );
  }

  /**
   * Helper to parse the data for the header
   * @param {array} data
   * @return {array} of react component div
  **/
  _parseData(data) {
    return data.map(
      (label, index) => <div key={label + '_' + index} className={'col ' + label}>{label}</div>
    );
  }

  /**
   * Helper to set the initial state
   * @param {array} data
   * @return {void} state change
  **/
  _setInitialState(data) {
    if (data.length > 0) {
      this.setState({ header: this._parseData(data) });
    }
  }
}
