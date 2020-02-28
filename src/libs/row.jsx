import React, { Component } from 'react';
import moment from 'moment';

// Declaring constants
const DATE_FORMAT = 'MM/DD/YYYY';

export default class ReportRow extends Component {
  constructor(props) {
    super(props);
    this.state = { row: [] };
  }

  componentDidMount() {
    this._setInitialState(this.props.data);
  }

  render() {
    return (
      <div className="row">{this.state.row}</div>
    );
  }

  /**
   * Helper to parse the data for the row
   * @param {object} data
   * @return {array} of react component div
  **/
  _parseData(data) {
    const cast = {
      boolean: (value) => value ? 'True' : 'False',
      number: (value) => parseFloat(value).toFixed(2),
      object: (value) => {
        const date = moment(value);
        return date.isValid()
          ? moment(date).format(DATE_FORMAT)
          : JSON.stringify(value, null, 2);
      },
      string: (value) => value.replace(/(?:\r\n|\r|\n)/g, '<br />')
    };
    return Object.keys(data).map((key) => {
      const className = typeof data[key];
      return (
        <div
          className={`col ${className} ${key}`}
          dangerouslySetInnerHTML={{ __html: cast[className](data[key]) }}
          key={`col_${key}`}
        ></div>
      );
    });
  }

  /**
   * Helper to set the initial state
   * @param {array} data
   * @return {void} state change
  **/
  _setInitialState(data) {
    if (data) {
      this.setState({ row: this._parseData(data) });
    }
  }
}
