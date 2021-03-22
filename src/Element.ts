type All = string | number | boolean | object | null;

interface Listener {
  selector: string;
  eventName: string;
  callback: any;
}

interface Props {
  [key: string]: All;
}

export abstract class Element extends HTMLElement {
  abstract state: Object;
  props: Props = {};

  _key: string = generateKey();
  _listeners: Array<Listener>;

  constructor() {
    super();
    this._listeners = [];

    // set the unique identifier for this element
    this.setAttribute("data-key", this._key);
  }

  /**
   *  let users define template for element
   *
   */
  abstract template(): HTMLElement;

  /**
   *  let users define element styles
   *
   */
  abstract styles(): HTMLStyleElement;

  /**
   *  execute when mounting of element if complete
   *
   */
  // mounted = (): void => {};
  abstract mounted(): void;

  /**
   *  get props
   *
   */
  public getProps = () => {
    let result: Props = {};

    for (const [prop, type] of Object.entries(this.props)) {
      if (prop.constructor !== type) {
        throw new Error(`Prop '${prop}' value is not of invalid type`);
      }

      const value: string | null = this.getAttribute(prop);
      result[prop] = value;
    }

    Object.assign(this.props, result);
  };

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
  public addListener(selector: string, eventName: string, callback: any): void {
    this._listeners.push({
      selector: `[data-key='${this._key}'] ${selector}`,
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

    // register element styles
    const styles: HTMLStyleElement = this.styles();
    this.appendChild(styles);
  }

  /**
   *  called when element is added to DOM
   *
   */
  connectedCallback() {
    this.getProps();

    if (typeof this.mounted === 'function') {
      this.mounted();
    }
    
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
 *  convert tagged string literal into primitive string
 *
 */
function parseTemplateString(
  strings: TemplateStringsArray,
  values: Array<All>
): string {
  let result: string = "";

  for (let i = 0; i < strings.length; i++) {
    result += strings[i] !== null && strings[i] !== undefined ? strings[i] : "";
    result += values[i] !== null && values[i] !== undefined ? values[i] : "";
  }

  return result;
}

/**
 *  convert tagged template into html element
 *
 */
export function HTML(
  strings: TemplateStringsArray,
  ...values: Array<All>
): HTMLElement {
  const html: string = parseTemplateString(strings, values);
  const template: HTMLTemplateElement = document.createElement("template");
  template.innerHTML = html;

  const element: HTMLElement = <HTMLElement>template.content.firstElementChild;
  if (!element) throw new Error("Failed to convert String to HTMLElement");

  return element;
}

/**
 *  convert tagged template into CSS styles
 *
 */
export function CSS(
  strings: TemplateStringsArray,
  ...values: Array<All>
): HTMLStyleElement {
  const css: string = parseTemplateString(strings, values);

  const styleElement: HTMLStyleElement = document.createElement("style");
  styleElement.innerHTML = css;
  return styleElement;
}

/**
 *  generate a unique key for the current instance of the Element
 *
 */
function generateKey(): string {
  return Math.random().toString(36).substring(2, 7);
}
