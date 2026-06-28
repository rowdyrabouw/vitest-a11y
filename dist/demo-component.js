export class DemoComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="https://kit.fontawesome.com/5c9c09d32c.css" crossorigin="anonymous" />
      <form>
        <input type="text"/>
        <button type="submit"><i class="fa-solid fa-arrow-right"></i></button>
      </form>
    `;
  }
}

customElements.define("demo-component", DemoComponent);
