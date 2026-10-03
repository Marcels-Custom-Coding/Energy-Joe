import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";
import { asset } from "../assets";
import { define } from "../define";

// Poses with dark surfaces at the edge have a variant with a light sticker edge.
const DARK_VARIANTS = new Set(["welcome"]);
// Full scenes are rectangular and get rounded corners.
const SCENES = new Set(["night-charge", "sleep", "learn"]);
// Joe with thumbs up is the logo itself.
const LOGO = "thumbs";

/** One of Joe's illustrations; switches to the dark variant automatically. */
export class JoePose extends LitElement {
  @property() name = "";
  @property() alt = "";

  static styles = css`
    :host {
      display: block;
    }
    img {
      display: block;
      width: 100%;
      height: auto;
    }
    img.scene {
      border-radius: 16px;
      box-shadow: var(--joe-shadow);
    }
    .light {
      display: var(--joe-show-light, block);
    }
    .dark {
      display: var(--joe-show-dark, none);
    }
  `;

  protected render() {
    const scene = SCENES.has(this.name) ? "scene" : "";
    if (this.name === LOGO) {
      return html`<img class="light" src=${asset("logo.webp")} alt=${this.alt} decoding="async" /><img
          class="dark"
          src=${asset("logo-dark.webp")}
          alt=${this.alt}
          decoding="async"
        />`;
    }
    const src = asset(`poses/${this.name}.webp`);
    if (!DARK_VARIANTS.has(this.name)) {
      return html`<img class=${scene} src=${src} alt=${this.alt} decoding="async" />`;
    }
    return html`<img class="light" src=${src} alt=${this.alt} decoding="async" /><img
        class="dark"
        src=${asset(`poses/${this.name}-dark.webp`)}
        alt=${this.alt}
       
        decoding="async"
      />`;
  }
}

define("joe-pose", JoePose);
