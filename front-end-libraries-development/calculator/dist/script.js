class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: 0,
      lastCommand: 'number',
      isOperation: false,
      operation: '',
      option: '',
      firstNum: 0,
      secondNum: 0,
      hasDecimal: false,
      expectingSecondNum: false,
      displayLength: 0,
      digits: 0 };

    this.reset = this.state;

    this.sendToDisplay = this.sendToDisplay.bind(this);
    this.evaluate = this.evaluate.bind(this);
    this.isActive = this.isActive.bind(this);

  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.display !== prevState.display) {
      let displayLength = this.state.display.toString();
      this.setState({
        displayLength: displayLength.length,
        digits: displayLength.replace('-', '').length });

    }

    console.log(new Intl.NumberFormat('en-US', { maximumSignificantDigits: 9 }).format(this.state.display));

  }

  isActive(operation) {

    if (this.state.isOperation && this.state.operation === operation) {
      return true;
    }

  }


  evaluate(operator, a, b) {

    a = parseFloat(a);
    b = parseFloat(b);
    let c = parseFloat(this.state.display);

    switch (operator) {
      case 'add':
        c = a + b;
        break;
      case 'subtract':
        c = a - b;
        break;
      case 'multiply':
        c = a * b;
        break;
      case 'divide':
        c = a / b;
        break;
      default:
        break;}

    return parseFloat(c.toFixed(4));

  }


  sendToDisplay(input) {


    if (input.type === 'number' && this.state.digits < 9) {
      this.setState({
        lastCommand: input.type,
        isOperation: false,
        option: 'number' });

      if (this.state.display === '-0') {
        this.setState({
          display: '-' + input.label });

      } else
      if (this.state.display === 0 || this.state.isOperation || this.state.option === 'equals') {
        this.setState({
          display: input.label });

      } else {
        this.setState({
          display: this.state.display.toString() + input.label.toString(),
          lastCommand: input.type });


      }
    } else
    if (input.type === 'operation') {

      this.setState({
        operation: input.id,
        lastCommand: input.type,
        isOperation: true,
        firstNum: this.state.display,
        hasDecimal: false,
        display: this.state.display,
        expectingSecondNum: false });


      if (input.id === 'subtract' && this.state.display === 0) {
        this.setState({
          display: '-',
          isOperation: false,
          operation: '' });

      } else if (this.state.display === '-') {
        this.setState({
          display: this.state.firstNum,
          firstNum: this.state.firstNum });

      } else if (this.state.lastCommand === input.type && input.id === 'subtract') {
        this.setState({

          display: '-',
          operation: this.state.operation,
          isOperation: false });

      } else if (!this.state.isOperation && this.state.lastCommand !== 'option') {
        this.setState({
          display: this.evaluate(this.state.operation, this.state.firstNum, this.state.display),
          firstNum: this.evaluate(this.state.operation, this.state.firstNum, this.state.display) });


      }



    } else
    if (input.type === 'option') {
      this.setState({
        lastCommand: input.type,
        option: input.id });


      if (input.id === 'clear') {

        this.setState(this.reset);

      }

      if (input.id === 'decimal') {


        if (!this.state.hasDecimal && this.state.lastCommand === 'number' || this.state.display === '-0') {
          this.setState({
            display: this.state.display + '.',
            hasDecimal: !this.state.hasDecimal });

        } else
        if (this.state.isOperation && this.state.lastCommand === 'operation' || this.state.option === 'equals') {
          this.setState({
            display: '0.',
            hasDecimal: true,
            isOperation: false });

        }


      }

      if (input.id === 'equals') {

        let operand1, operand2, result;

        if (this.state.expectingSecondNum === false) {
          this.setState({
            secondNum: this.state.display,
            expectingSecondNum: true });

        }


        if (this.state.expectingSecondNum === false) {
          operand1 = this.state.firstNum;
          operand2 = this.state.display;
        } else {
          operand1 = this.state.display;
          operand2 = this.state.secondNum;
        }


        result = this.evaluate(this.state.operation, operand1, operand2);

        this.setState({
          display: result });


      }

      if (input.id === 'percent') {

        this.setState({
          display: parseFloat(this.state.display) / 100 });


        if (this.state.operation && this.state.option !== 'equals') {
          this.setState({
            display: this.state.firstNum * (parseFloat(this.state.display) / 100) });

        }

      }

      if (input.id === 'negative') {

        if (this.state.display === 0) {

          this.setState({
            display: '-' + this.state.display });


        } else {
          this.setState({
            display: this.state.display * -1 });

        }

      }
    } else {
      this.setState({
        lastCommand: input.type });

    }

  }

  render() {




    // display options for debugging
    // <div>currentOperation: {this.state.operation}</div>
    // <div>isOperation: {this.state.isOperation.toString()}</div>
    // <div>lastCommand: {this.state.lastCommand}</div>
    // <div>option: {this.state.option}</div>
    // <div>firstNum: {this.state.firstNum}</div>
    // <div>secondNum: {this.state.secondNum}</div>
    // <div>hasDecimal: {this.state.hasDecimal.toString()}</div>
    // <div>isInteger: {Number.isInteger(this.state.display).toString()}</div>
    // <div>expectingSecondNum: {this.state.expectingSecondNum.toString()}</div>

    return /*#__PURE__*/(
      React.createElement(React.Fragment, null, /*#__PURE__*/
      React.createElement(Display, { display: this.state.display, displayLength: this.state.displayLength }), /*#__PURE__*/
      React.createElement(KeyPad, {
        sendToDisplay: this.sendToDisplay,
        isActive: this.isActive })));




  }}


class KeyPad extends React.Component {
  constructor(props) {
    super(props);

  }


  render() {
    const numPad = [];
    const numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

    for (let i = 0; i < 10; i++) {
      numPad.push( /*#__PURE__*/React.createElement(Key, {
        id: numbers[i],
        label: i,
        type: "number",
        sendToDisplay: this.props.sendToDisplay }));

    }

    const operations = {
      "add": "+",
      "subtract": "-",
      "multiply": "*",
      "divide": "/" };



    const operPad = [];

    for (const property in operations) {
      operPad.push( /*#__PURE__*/React.createElement(Key, {
        id: property,
        label: operations[property],
        type: "operation",
        sendToDisplay: this.props.sendToDisplay,
        isActive: this.props.isActive }));

    }


    const options = {
      "decimal": ".",
      "clear": "C",
      "equals": "=",
      "negative": "+/-",
      "percent": "%" };


    const optPad = [];

    for (const property in options) {
      optPad.push( /*#__PURE__*/React.createElement(Key, {
        id: property,
        label: options[property],
        type: "option",
        sendToDisplay: this.props.sendToDisplay }));

    }

    return /*#__PURE__*/React.createElement("div", { id: "keypad" }, numPad, operPad, optPad);

  }}


class Key extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {

    if (this.props.type === 'number') {
      this.props.sendToDisplay(this.props);
    } else
    if (this.props.type === 'operation') {
      this.props.sendToDisplay(this.props);
    } else
    if (this.props.type === 'option') {
      this.props.sendToDisplay(this.props);
    }

  }

  render() {

    let className;
    if (this.props.type === 'operation') {
      // console.log(this.props)
      if (this.props.isActive(this.props.id)) {
        className = "active";
      }
    }



    return /*#__PURE__*/(

      React.createElement("div", { id: this.props.id, onClick: this.handleClick, className: className }, /*#__PURE__*/React.createElement("span", null, this.props.label)));



  }}


class Display extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {

    let displayLength = this.props.displayLength;
    let className;
    if (displayLength > 9) {
      className = "ten-digits";
    } else if (displayLength > 8) {
      className = "nine-digits";
    } else if (displayLength > 7) {
      className = "eight-digits";
    } else if (displayLength > 6) {
      className = "seven-digits";
    }

    let formattedDisplay = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 9 }).format(this.props.display);

    return /*#__PURE__*/(
      React.createElement("div", { id: "display" }, /*#__PURE__*/React.createElement("span", { className: className }, this.props.display !== '-' ? formattedDisplay : this.props.display)));


  }}


ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('root'));