import { Element, Register, HTML, CSS } from '../dist/Element.js';

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
    <button>Count <span>${this.state.count}</span></button>
    `;
  }

  styles() {
    return CSS`
    button {
      padding: 0.5rem 1rem;
      border: 1px solid #bbbbbb;
      border-radius: 0.2rem;
      margin: 0 0 3rem 0;
      background: white;
      display: inline-flex;
      outline: none;
    }

    button:hover,
    button:active {
      background: #f7f7f7;
    }

    button span {
      margin-left: 0.4rem;
      background: #ececec;
      border-radius: 50%;
      height: 1rem;
      width: 1rem;
    }
    `;
  }

  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  }
}

Register('f-counter', Counter);