const PREFIX = "hb";

export function setComponent(name: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions) {
    window.customElements.define(`${PREFIX}-${name}`, constructor, options);
}
