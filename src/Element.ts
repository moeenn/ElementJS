type All = string | number | boolean | object;

interface Listener {
  selector: string;
  eventName: string;
  callback: any;
}

export abstract class Element extends HTMLElement {
  abstract state: Object;
  _listeners: Array<Listener>;

  constructor() {
    super();
    this._listeners = [];
  }

  /**
   *  let users define template for element
   *
   */
  abstract template(): HTMLElement;

  /**
   *  update element state
   *
   */
  public setState(newState: Object): void {
    Object.assign(this.state, newState);
    this._render();
  }

  /**
   *  register listeners
   *
   */
  addListener(selector: string, eventName: string, callback: any): void {
    this._listeners.push({
      selector,
      eventName,
      callback,
    });
  }

  /**
   *  activate all listeners
   *
   */
  private activateListeners(): void {
    this._listeners.forEach((listener) => {
      const elements: NodeListOf<HTMLElement> | null = document.querySelectorAll<HTMLElement>(
        listener.selector
      );
      if (!elements) {
        throw new Error(
          `No Element with selector '${listener.selector}' was found`
        );
      }

      elements.forEach((element) => {
        element.addEventListener(listener.eventName, listener.callback);
      });
    });
  }

  /**
   *  render out an element
   *
   */
  private _render(): void {
    const element: HTMLElement = this.template();

    // clear out previour html and append the updated one
    this.innerHTML = "";
    this.appendChild(element);
    this.activateListeners();
  }

  /**
   *  called when element is added to DOM
   *
   */
  connectedCallback() {
    this._render();
  }

  // called when element is removed from DOM
  disconnectedCallback() {
    console.log("Element removed from DOM");
  }
}

/**
 *  register a custom element with the browser
 *  so it can be used within the page
 *
 */
export function Register(elemName: string, elemClass: any) {
  customElements.define(elemName, elemClass);
}

/**
 *  convert tagged template into html element
 *
 */
export function HTML(
  strings: TemplateStringsArray,
  ...values: Array<All>
): HTMLElement {
  let html: string = "";

  for (let i = 0; i < strings.length; i++) {
    html += strings[i] !== null && strings[i] !== undefined ? strings[i] : "";
    html += values[i] !== null && values[i] !== undefined ? values[i] : "";
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const element: ChildNode | null = doc.body.firstChild;

  if (!element) throw new Error("Failed to convert String to HTMLElement");
  return <HTMLElement>element;
}
