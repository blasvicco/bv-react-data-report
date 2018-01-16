# react-data-report

This is a ReactJS Component that allows to the users generate a preview of data before exported as PDF file.

The user will be able to chose the item per page, the page format (portrait / landscape) and the page size (a4 / letter / legal).

### Example:

Please refer to the [test](test/src/App.js) file to see it working.

To run the test:
1. Clone the repository
2. Execute in console:
```BASH
cd test
npm install
npm start
```

### General Usage

As you will be able to see in [test](test/src/App.js) in order to use the component we need to importe it as:
```JAVASCRIPT
import Report from 'react-data-report';
```

Then, in the render method we can just call it like:

```JAVASCRIPT
<Report data={example}/>
```

Where data is an array of objects as you can see in this [example](test/src/example.json)

### Installation

Install this component is easy, just use npm as:
```BASH
npm install react-data-report
```
