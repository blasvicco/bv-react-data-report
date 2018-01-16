import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'
import T from 'i18n-react';
import ReportPage from "./report-page";

import './css/report.scss';

T.setTexts(require('!json-loader!./languages/en.json'));

export default class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      generating: false,
      pages: [],
      itemsPerPage: 8,
      pageFormat: 'l',
      pageSize: 'a4'
    };
    
    this._setInitialState   = this._setInitialState.bind(this);
    this._parseData         = this._parseData.bind(this);
    this._updatePreview     = this._updatePreview.bind(this);
    this.generateReport     = this.generateReport.bind(this);
    this.updateItemsPerPage = this.updateItemsPerPage.bind(this);
    this.updatePageFormat   = this.updatePageFormat.bind(this);
    this.updatePageSize     = this.updatePageSize.bind(this);
  }

  _setInitialState(data) {
    if (data.length > 0) {
      this.setState({pages: this._parseData(data)});
    }
  }

  _parseData(data) {
    const total = data.length;
    if (total == 0) return null;

    const step      = parseInt(this.state.itemsPerPage);
    const pages     = Math.floor(total / step) + ((total % step == 0) ? 0 : 1 );
    const className = this.state.pageSize + ' ' + (this.state.pageFormat == 'p' ? 'portrait' : 'landscape');

    let content = [];
    for (let pg = 0; pg < pages; pg++) {
      const slicedData = data.slice(pg * step, (pg * step) + step);
      content.push((<ReportPage className={ className } key={'page_' + pg} data={slicedData} />));
    }

    return content;
  }

  _updatePreview() {
    if (this.update) clearTimeout(this.update);
    this.update = setTimeout(() => {
      this.setState({pages: this._parseData(this.props.data)});
    }, 500);
  }

  componentDidMount() {
    this._setInitialState(this.props.data);
  }

  componentWillReceiveProps(nextProps) {
    this._setInitialState(nextProps.data);
  }

  generateReport() {
    if (this.divToPrint) {
      this.setState({generating: true});
      const pdf = new jsPDF(this.state.pageFormat, 'mm', this.state.pageSize);
      
      let promises = [];
      this.divToPrint.childNodes.forEach((page) => promises.push(html2canvas(page)));

      Promise.all(promises).then((images) => {
        const size = {
          a4:     { w: 210,   h: 297 },
          letter: { w: 215.9, h: 297 },
          legal:  { w: 216,   h: 356 }
        }
        const w = this.state.pageFormat == 'p' ? size[this.state.pageSize].w : size[this.state.pageSize].h;
        const h = this.state.pageFormat == 'p' ? size[this.state.pageSize].h : size[this.state.pageSize].w;

        images.forEach((image, index) => {
          const pageData = image.toDataURL('image/png', 1.0);
          pdf.addImage(pageData, 'PNG', 0, 0, w, h, '', 'FAST');
          
          if (index + 1 < images.length) {
            pdf.addPage(this.state.pageSize, this.state.pageFormat);
          }
        });

        this.setState({generating: false});
        pdf.save('report.pdf');
      }).catch((e) => console.log(e));
    }
  }

  updateItemsPerPage(value) {
    if (value >= 1) {
      this.setState({itemsPerPage: value});
      this._updatePreview();
    }
  }

  updatePageFormat(value) {
    this.setState({pageFormat: value});
    this._updatePreview();
  }

  updatePageSize(value) {
    this.setState({pageSize: value});
    this._updatePreview();
  }

  render() {
    return (
      <div className="report">
        <div className="report__control-panel">
          <div className="report__items-per-page-container">
            <label htmlFor="itemsPerPage">{T.translate('report.controlPanel.itemsPerPage')}</label>
            <input id="itemsPerPage" name="itemsPerPage" type="number" min="1" step="1" onChange={(event) => this.updateItemsPerPage(event.target.value)} value={this.state.itemsPerPage} />
          </div>
          <div className="report__page-format-container">
            <label htmlFor="pageFormat">{T.translate('report.controlPanel.pageFormat')}</label>
            <select id="pageFormat" name="pageFormat" onChange={(event) => this.updatePageFormat(event.target.value)} value={this.state.pageFormat} >
              <option value="p">portrait</option>
              <option value="l">landscape</option>
            </select>
          </div>
          <div className="report__page-size-container">
            <label htmlFor="pageSize">{T.translate('report.controlPanel.pageSize')}</label>
            <select id="pageSize" name="pageSize" onChange={(event) => this.updatePageSize(event.target.value)} value={this.state.pageSize} >
              <option value="a4">a4</option>
              <option value="letter">letter</option>
              <option value="legal">legal</option>
            </select>
          </div>
          <div className="report__generator-container">
            { this.state.generating
              ? (<button type="button" disabled="disabled">{T.translate('report.controlPanel.processing')}</button>)
              : (<button type="button" className="report__generator-button" onClick={() => this.generateReport()}>{T.translate('report.controlPanel.generatePdf')}</button>)
            }
          </div>
        </div>
        <div id="divToPrint" ref={(elm) => this.divToPrint = elm} className="report__preview-container">
          {this.state.pages}
        </div>
      </div>
    );
  }
}
