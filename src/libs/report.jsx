import React, { Component } from 'react';
import PropTypes from 'prop-types';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import T from 'i18n-react';

// Importing libs
import Page from './page';

// Importing language
import language from './languages/en.json';

// Importing assets
import './report.scss';

// Loading language
T.setTexts(language);

export default class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageFormat: 'l',
      pages: [],
      pageSize: 'a4',
      processing: false,
      itemsPerPage: 8,
    };
  }

  componentDidMount() {
    this._setInitialState(this.props.data);
  }

  render() {
    const { availablePageSize } = this.props;
    const { itemsPerPage, pageFormat, pages, pageSize, processing } = this.state;

    return (
      <div className="report">
        <div className="report__control-panel">
          <div className="report__items-per-page-container">
            <label htmlFor="itemsPerPage">{T.translate('report.controlPanel.itemsPerPage')}</label>
            <input
              id="itemsPerPage"
              min="1"
              name="itemsPerPage"
              step="1"
              type="number"
              value={itemsPerPage}
              onChange={(event) => this._updateItemsPerPage(event.target.value)}
            />
          </div>
          <div className="report__page-format-container">
            <label htmlFor="pageFormat">{T.translate('report.controlPanel.pageFormat')}</label>
            <select
              id="pageFormat"
              name="pageFormat"
              value={pageFormat}
              onChange={(event) => this._updatePageFormat(event.target.value)}
            >
              <option value="p">portrait</option>
              <option value="l">landscape</option>
            </select>
          </div>
          <div className="report__page-size-container">
            <label htmlFor="pageSize">{T.translate('report.controlPanel.pageSize')}</label>
            <select
              id="pageSize"
              name="pageSize"
              value={pageSize}
              onChange={(event) => this._updatePageSize(event.target.value)}
            >
              {Object.keys(availablePageSize).map(
                (key) => <option key={key} value={key}>{availablePageSize[key].name}</option>)
              }
            </select>
          </div>
          <div className="report__generator-container">
            { processing
              ? (<button disabled="disabled" type="button" >{T.translate('report.controlPanel.processing')}</button>)
              : (
                <button
                  className="report__generator-button"
                  type="button"
                  onClick={() => this._generateReport()}
                >
                  {T.translate('report.controlPanel.generatePdf')}
                </button>
              )
            }
          </div>
        </div>
        <div className="report__preview-container" id="divToPrint" ref={(elm) => this.divToPrint = elm}>
          {pages}
        </div>
      </div>
    );
  }

  /**
   * On generate PDF click handler
   * @param {void}
   * @return {void} trigger pdf download
  **/
  _generateReport() {
    const { availablePageSize } = this.props;
    const { pageFormat, pageSize } = this.state;
    if (this.divToPrint) {
      this.setState({ processing: true });
      const pdf = new jsPDF(pageFormat, 'mm', this.state.pageSize);

      let promises = [];
      this.divToPrint.childNodes.forEach((page) => promises.push(html2canvas(page)));

      Promise.all(promises).then((images) => {
        const { size } = availablePageSize[pageSize];
        const [ h, w ] = pageFormat === 'p' ? [ size.h, size.w ] : [ size.w, size.h ];
        images.forEach((image, index) => {
          const pageData = image.toDataURL('image/png', 1.0);
          pdf.addImage(pageData, 'PNG', 0, 0, w, h, '', 'FAST');

          if (index + 1 < images.length) {
            pdf.addPage(pageSize, pageFormat);
          }
        });

        this.setState({ processing: false });
        pdf.save('report.pdf');
      }).catch((e) => console.log(e));
    }
  }

  /**
   * Helper to parse the data for the report
   * @param {array} data
   * @return {array} of react component Page
  **/
  _parseData(data) {
    const { itemsPerPage, pageFormat, pageSize } = this.state;
    const total = data.length;
    if (total === 0) return null;

    const step      = parseInt(itemsPerPage);
    const pages     = Math.floor(total / step) + ((total % step === 0) ? 0 : 1 );
    const className = pageSize + ' ' + (pageFormat === 'p' ? 'portrait' : 'landscape');

    const content = [];
    for (let pg = 0; pg < pages; pg++) {
      const slicedData = data.slice(pg * step, (pg * step) + step);
      content.push((<Page className={className} key={'page_' + pg} data={slicedData} />));
    }
    return content;
  }

  /**
   * Helper to set the initial state
   * @param {array} data
   * @return {void} state change
  **/
  _setInitialState(data) {
    if (data.length > 0) {
      this.setState({ pages: this._parseData(data) });
    }
  }

  /**
   * Helper to set the item per page
   * @param {number} value
   * @return {void} state change
  **/
  _updateItemsPerPage(value) {
    if (value >= 1) {
      this.setState({ itemsPerPage: value });
      this._updatePreview();
    }
  }

  /**
   * Helper to set the page format
   * @param {string} value
   * @return {void} state change
  **/
  _updatePageFormat(value) {
    this.setState({ pageFormat: value });
    this._updatePreview();
  }

  /**
   * Helper to set the page size
   * @param {string} value
   * @return {void} state change
  **/
  _updatePageSize(value) {
    this.setState({ pageSize: value });
    this._updatePreview();
  }

  /**
   * Helper to update the pages
   * @param {void}
   * @return {void} state change with timer
  **/
  _updatePreview() {
    if (this.updateTO) clearTimeout(this.updateTO);
    this.updateTO = setTimeout(() => {
      this.setState({ pages: this._parseData(this.props.data) });
    }, 500);
  }
}

Report.propTypes = {
  availablePageSize: PropTypes.object,
};

Report.defaultProps = {
  availablePageSize: {
    a4: { size: { h: 297, w: 210 }, name: 'a4' },
    letter: { size: { h: 297, w: 215.9 }, name: 'letter' },
    legal: { size: { h: 356, w: 216 }, name: 'legal' },
  },
};
