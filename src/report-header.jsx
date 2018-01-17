import React from 'react';

module.exports = class ReportHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {header: []};

    this._setInitialState = this._setInitialState.bind(this);
    this._parseData       = this._parseData.bind(this);
  }

  _setInitialState(data) {
    if (data.length > 0) {
      this.setState({header: this._parseData(data)});
    }
  }

  componentDidMount() {
    this._setInitialState(this.props.data);
  }

  componentWillReceiveProps(nextProps) {
    this._setInitialState(nextProps.data);
  }

  _parseData(data) {
    return data.map((label, index) => (<div key={label + '_' + index} className={'col ' + label}>{label}</div>));
  }

  render() {
    return (
      <div className="header">
        {this.state.header}
      </div>
    );
  }
}
