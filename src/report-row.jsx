import React from 'react';
import moment from 'moment';
const dateFormat = 'MM/DD/YYYY';

module.exports = class ReportRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {row: []};

    this._setInitialState = this._setInitialState.bind(this);
    this._parseData       = this._parseData.bind(this);
  }

  _setInitialState(data) {
    if (data) {
      this.setState({row: this._parseData(data)});
    }
  }

  componentDidMount() {
    this._setInitialState(this.props.data);
  }

  componentWillReceiveProps(nextProps) {
    this._setInitialState(nextProps.data);
  }

  _parseData(data) {
    let content = [];
    for (let key in data) {
      let className = typeof data[key];
      let val = data[key];
      switch (typeof data[key]) {
        case 'object': {
          let date = moment(val);
          if (date.isValid()) {
            val = moment(date).format(dateFormat);
          } else {
            val       = 'Object';
            className = 'object';
          }
        } break;
        case 'boolean': val = val ? 'True' : 'False';                   break;
        case 'number':  val =  parseFloat(val).toFixed(2);              break;
        default:
        case 'string':  val = val.replace(/(?:\r\n|\r|\n)/g, '<br />'); break;
      }
      
      content.push((<div key={'col_' + key} className={'col ' + className + ' ' + key} dangerouslySetInnerHTML={{__html: val}}></div>));
    }
    return content;
  }

  render() {
      return (
        <div className="row">
          {this.state.row}
        </div>
      );
    }
  }
