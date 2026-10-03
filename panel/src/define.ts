/** Defines a custom element once; HA may load a newer bundle into the same page. */
export function define(name: string, element: CustomElementConstructor): void {
  if (!customElements.get(name)) {
    customElements.define(name, element);
  }
}
