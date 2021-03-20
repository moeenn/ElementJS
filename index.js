import { Element, Register, HTML } from './dist/Element.js';

class Counter extends Element {
  constructor() {
    super();
    this.state = {
      count: 0
    };

    this.addListener('button', 'click', this.handleClick);
  }

  template() {
    return HTML`
    <button>Count: ${this.state.count}</button>
    `;
  }

  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  }
}

Register('f-counter', Counter);