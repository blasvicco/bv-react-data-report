import React, { Component } from 'react';

// Importing libs
import Header from './header';
import Row from './row';

export default class ReportPage extends Component {
  constructor(props) {
    super(props);
    this.state = { header: [], rows: [] };
  }

  componentDidMount() {
    this._setInitialState(this.props.data);
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (prevProps.data !== data) {
      this._setInitialState(data);
    }
  }

  render() {
    const { className } = this.props;
    const { header, rows } = this.state;

    return (
      <div className={`page ${className}`}>
        <div className="page__table">
          {header}
          {rows}
        </div>
      </div>
    );
  }

  /**
   * Helper to parse the data for the header section
   * @param {array} data
   * @return {object} react component Header
  **/
  _parseHeader(data) {
    return data.length > 0 && <Header data={Object.keys(data[0])} />;
  }

  /**
   * Helper to parse the data for the rows
   * @param {array} data
   * @return {array} of react component Row
  **/
  _parseRows(data) {
    return data.length > 0 && data
      .map((row, index) => <Row key={'row_' + index} data={row} />);
  }

  /**
   * Helper to set the initial state
   * @param {array} data
   * @return {void} state change
  **/
  _setInitialState(data) {
    if (data.length > 0) {
      this.setState({
        header: this._parseHeader(data),
        rows: this._parseRows(data),
      });
    }
  }
}
