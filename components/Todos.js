import { Element, Register, HTML, CSS } from '../dist/Element.js';

class Todos extends Element {
  constructor() {
    super();

    this.props = {
      url: String
    };

    this.state = {
      todos: []
    };
  }

  mounted() {
    this.getTodos();
    this.addListener('li', 'click', this.handleClick);
  }

  template() {
    return HTML`
      <div>
        <h1>Todos</h1>
        <ul class="todos">
          ${this.renderList()}
        </ul>
      </div>
    `;
  }

  styles() {
    return CSS`
      h1 {
        font-weight: 100;
        font-size: 1.8rem;
      }

      ul.todos {
        list-style: none;
        padding: 1rem 0;
      }

      ul.todos li {
        display: flex;
        margin: 0.5rem 0;
        border-bottom: 1px solid #e6e6e6;
        padding: 1rem 0;
        cursor: pointer;
      }

      input[type=checkbox] {
        margin: auto 0 auto auto;
      }
    `;
  }

  async getTodos() {
    const res = await fetch(this.props.url);
    const todos = await res.json();
    this.setState({ todos });
  }

  renderList() {
    return this.state.todos.reduce((accum, todo) => {
      return accum + 
      `<li data-id="${todo.id}">
        ${todo.title}
        <input type="checkbox" ${(todo.completed) ? 'checked' : ''}>
      </li>`;
    }, '');
  }

  handleClick = (event) => {
    const clickedID = event.target.dataset.id;
    const todos = [...this.state.todos];

    todos.forEach(todo => {
      if (todo.id === parseInt(clickedID)) {
        todo.completed = !todo.completed;
      }
    });

    this.setState({ todos });
  }
}

Register('f-todos', Todos);
