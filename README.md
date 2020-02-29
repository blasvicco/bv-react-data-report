# bv-react-data-report

This is a ReactJS Component that generate a preview of data to be exported as PDF file.

The user will be able to choose the items per page, the page format (portrait / landscape) and the page size (a4 / letter / legal).

The package expose the libs to be overwritten if you want to customize any behavior.

### Dependencies:

- [html2canvas](https://html2canvas.hertzen.com/)
- [i18n-react](https://www.npmjs.com/package/i18n-react)
- [jspdf](https://www.npmjs.com/package/jspdf)

### Example:

To run the test:
1. Clone the repository
2. Execute in console:
```BASH
yarn
yarn start
```

### General Usage

```JAVASCRIPT
import { Report } from 'bv-react-data-report';
```

Then, in the render method we can just call it like:

```JAVASCRIPT
<Report data={[{ id: 1, value: 'Some value' }, { id: 2, value: 'Some other value' }]}/>
```

Where data is an array of objects as you can see in this [example](src/assets/example.json) file.

### Installation

Install this component is easy, just use npm as:
```BASH
npm install bv-react-data-report html2canvas i18n-react jspdf
```

Or yarn
```BASH
yarn add bv-react-data-report html2canvas i18n-react jspdf
```
