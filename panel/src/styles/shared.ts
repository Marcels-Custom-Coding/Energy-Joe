import { css } from "lit";

/** Building blocks from the design concept, shared by all components. */
export const shared = css`
  :host {
    font-family: var(--joe-ui);
  }
  * {
    box-sizing: border-box;
  }
  button {
    font: inherit;
    color: inherit;
  }
  :focus-visible {
    outline: 3px solid var(--joe-amber);
    outline-offset: 2px;
    border-radius: 4px;
  }
  ha-icon {
    --mdc-icon-size: 18px;
    flex: none;
  }

  .eyebrow {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--joe-muted);
  }
  .display {
    font-family: var(--joe-display);
    font-style: italic;
    font-weight: 800;
    text-transform: uppercase;
    line-height: 0.92;
    letter-spacing: 0.005em;
    margin: 0;
    text-wrap: balance;
  }
  .display .hl {
    color: var(--joe-amber);
  }
  .display .title-tip {
    display: inline-flex;
    margin-left: 10px;
    vertical-align: 0.12em;
    text-transform: none;
    font-style: normal;
  }
  .swoosh {
    display: block;
    height: 12px;
    width: min(220px, 62%);
    color: var(--joe-amber);
    margin-top: 6px;
  }
  .lead {
    font-size: 17px;
    line-height: 1.5;
    color: var(--joe-ink-2);
    margin: 12px 0 0;
    max-width: 58ch;
  }
  .num {
    font-variant-numeric: tabular-nums;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 40px;
    padding: 8px 18px;
    border-radius: 9px;
    border: 0;
    cursor: pointer;
    font-weight: 600;
    font-size: 15px;
    transition: background 0.12s, color 0.12s, transform 0.12s, box-shadow 0.12s;
  }
  .btn:active {
    transform: scale(0.98);
  }
  .btn[disabled] {
    cursor: not-allowed;
    opacity: 0.45;
    transform: none;
  }
  .btn-primary {
    position: relative;
    isolation: isolate;
    background: transparent;
    color: var(--joe-amber-ink);
    font-family: var(--joe-display);
    font-style: italic;
    font-weight: 800;
    text-transform: uppercase;
    font-size: 18px;
    letter-spacing: 0.02em;
    padding: 8px 24px;
  }
  .btn-primary::before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--joe-amber);
    transform: skewX(-10deg);
    border-radius: 7px;
    z-index: -1;
    box-shadow: inset 0 -3px 0 rgba(7, 17, 24, 0.18);
    transition: background 0.12s, box-shadow 0.12s;
  }
  .btn-primary:not([disabled]):hover::before {
    background: var(--joe-amber-hover);
  }
  .btn-primary:not([disabled]):active::before {
    background: var(--joe-amber-press);
    box-shadow: inset 0 2px 0 rgba(7, 17, 24, 0.22);
  }
  .btn-secondary {
    background: var(--joe-surface);
    color: var(--joe-ink);
    box-shadow: inset 0 0 0 2px var(--joe-ink);
  }
  .btn-secondary:not([disabled]):hover {
    background: var(--joe-surface-2);
  }
  .btn-secondary:not([disabled]):active {
    background: var(--joe-line);
  }
  .btn-ghost {
    background: transparent;
    color: var(--joe-ink-2);
  }
  /* Something that cannot be undone: away from the main path, red text and ring. */
  .btn-danger {
    background: var(--joe-surface);
    color: var(--joe-crit);
    box-shadow: inset 0 0 0 2px var(--joe-crit);
  }
  .btn-danger:not([disabled]):hover {
    background: var(--joe-crit-soft);
  }
  .btn-danger:not([disabled]):active {
    background: var(--joe-crit-soft);
    box-shadow: inset 0 0 0 3px var(--joe-crit);
  }
  .btn-ghost:not([disabled]):hover {
    background: var(--joe-surface-2);
    color: var(--joe-ink);
  }
  .btn-ghost:not([disabled]):active {
    background: var(--joe-line);
  }
  @media (pointer: coarse) {
    .btn {
      min-height: 44px;
    }
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px 3px 8px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.3;
    background: var(--joe-surface-2);
    color: var(--joe-ink-2);
    white-space: nowrap;
  }
  .chip ha-icon {
    --mdc-icon-size: 14px;
  }
  .chip.read {
    background: var(--joe-info-soft);
    color: var(--joe-info);
  }
  .chip.learned {
    background: var(--joe-amber-soft);
    color: var(--joe-amber-text);
  }
  .chip.user {
    background: var(--joe-leather-soft);
    color: var(--joe-leather);
  }
  .chip.ok {
    background: var(--joe-good-soft);
    color: var(--joe-good);
  }
  .chip.warn {
    background: var(--joe-warn-soft);
    color: var(--joe-warn);
  }
  .chip.soon {
    background: transparent;
    box-shadow: inset 0 0 0 1.5px var(--joe-line-2);
    color: var(--joe-muted);
  }
  .pill-sim {
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    background: repeating-linear-gradient(-45deg, var(--joe-stripe-a) 0 8px, var(--joe-stripe-b) 8px 16px);
    color: #071118;
    white-space: nowrap;
  }

  .card {
    position: relative;
    min-width: 0;
    background: var(--joe-surface);
    border-radius: 14px;
    box-shadow: inset 0 0 0 1px var(--joe-line);
    padding: 18px;
  }
  .calm {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--joe-surface);
    box-shadow: inset 0 0 0 1px var(--joe-line);
    margin-top: 18px;
    max-width: 58ch;
  }
  .actions {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 22px;
  }
  .with-tip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  /* Back and next at the top of a setup step (components/step-nav.ts) */
  .step-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin: 12px auto 0;
  }
  .step-nav .btn ha-icon {
    --mdc-icon-size: 20px;
  }
  .step-nav .btn-ghost {
    padding-inline: 8px 14px;
  }

  /* How sure Joe is */
  .conf {
    display: inline-flex;
    gap: 3px;
  }
  .conf i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--joe-line-2);
  }
  .conf i.on {
    background: var(--joe-amber);
  }

  /* Small row actions ("Ändern", "Ignorieren") */
  .mini-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 0;
    cursor: pointer;
    min-height: 34px;
    padding: 6px 12px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13.5px;
    background: var(--joe-surface-2);
    color: var(--joe-ink);
    transition: background 0.12s, transform 0.12s;
  }
  .mini-btn:hover:not([disabled]) {
    background: var(--joe-line);
  }
  .mini-btn:active:not([disabled]) {
    transform: scale(0.97);
  }
  .mini-btn[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .mini-btn.go {
    background: var(--joe-amber);
    color: var(--joe-amber-ink);
  }
  .mini-btn.go:hover:not([disabled]) {
    background: var(--joe-amber-hover);
  }
  .mini-btn.quiet {
    background: transparent;
    color: var(--joe-ink-2);
  }
  .mini-btn.quiet:hover:not([disabled]) {
    background: var(--joe-surface-2);
    color: var(--joe-ink);
  }
  .mini-btn ha-icon {
    --mdc-icon-size: 16px;
  }
  @media (pointer: coarse) {
    .mini-btn {
      min-height: 44px;
    }
  }

  /* Inputs: filled, no frame, amber focus */
  .input {
    width: 100%;
    min-height: 42px;
    padding: 8px 12px;
    border: 0;
    border-radius: 9px;
    background: var(--joe-surface-2);
    color: var(--joe-ink);
    font: inherit;
    font-variant-numeric: tabular-nums;
    box-shadow: inset 0 1px 2px rgba(7, 17, 24, 0.08);
  }
  .input:focus {
    outline: 3px solid var(--joe-amber);
    outline-offset: 1px;
  }
  .input::placeholder {
    color: var(--joe-muted);
  }
  .unit-input {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 100%;
    max-width: 200px;
  }
  .unit-input .input {
    padding-right: 64px;
  }
  .unit-input .unit {
    position: absolute;
    right: 12px;
    color: var(--joe-muted);
    font-size: 14px;
    pointer-events: none;
  }
  select.input {
    cursor: pointer;
  }

  /* Labeled fields in forms */
  .field {
    display: grid;
    gap: 6px;
    margin-top: 16px;
  }
  .field-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
  }
  .field-hint {
    color: var(--joe-muted);
    font-size: 13px;
    margin: -2px 0 0;
  }
  .field-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  /* Notes from Joe */
  .note {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding: 10px 12px;
    border-radius: 10px;
    font-size: 14px;
    background: var(--joe-info-soft);
    color: var(--joe-ink);
  }
  .note > ha-icon {
    color: var(--joe-info);
    margin-top: 1px;
  }
  .note.warn {
    background: var(--joe-warn-soft);
  }
  .note.warn > ha-icon {
    color: var(--joe-warn);
  }
  .note .note-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
  }

  /* On/off switch */
  .switch {
    position: relative;
    width: 46px;
    height: 28px;
    flex: none;
    border: 0;
    border-radius: 999px;
    cursor: pointer;
    background: var(--joe-line-2);
    transition: background 0.12s;
  }
  .switch::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--joe-surface);
    box-shadow: 0 1px 3px rgba(7, 17, 24, 0.3);
    transition: transform 0.12s;
  }
  .switch[aria-checked="true"] {
    background: var(--joe-amber);
  }
  .switch[aria-checked="true"]::after {
    transform: translateX(18px);
  }
  .switch[disabled] {
    cursor: not-allowed;
    opacity: 0.45;
  }
  /* On touch screens switch and inputs grow to 44 px; the track still looks 28 px high. */
  @media (pointer: coarse) {
    .switch,
    .switch[aria-checked="true"] {
      height: 44px;
      padding: 8px 0;
      background-clip: content-box;
      border-radius: 14px / 22px;
    }
    .switch::after {
      top: 11px;
    }
    .input {
      min-height: 44px;
    }
  }

  .sheet-title {
    padding-right: 40px;
  }
  .sheet-title .display {
    font-size: clamp(28px, 6vw, 36px);
  }
  /* Segmented choice (one of a few) */
  .seg {
    display: inline-flex;
    background: var(--joe-surface-2);
    border-radius: 999px;
    padding: 3px;
    gap: 2px;
  }
  .seg button {
    border: 0;
    background: transparent;
    padding: 6px 14px;
    min-height: 36px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 14px;
    color: var(--joe-ink-2);
    cursor: pointer;
    transition: background 0.12s, color 0.12s;
  }
  .seg button:hover:not([disabled]) {
    background: var(--joe-surface);
    color: var(--joe-ink);
  }
  .seg button:active:not([disabled]) {
    transform: scale(0.97);
  }
  .seg button[aria-pressed="true"] {
    background: var(--joe-ink);
    color: var(--joe-bg);
  }
  .seg button[disabled] {
    cursor: not-allowed;
    opacity: 0.45;
  }
  @media (pointer: coarse) {
    .seg button {
      min-height: 44px;
    }
  }
  .group-label {
    margin: 18px 0 8px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--joe-muted);
  }

  /* Navigation building blocks (components/section-chips, ha-open, mirror, used-by) */
  .section-chips {
    position: sticky;
    top: var(--joe-head-h, 0px);
    z-index: 1;
    display: flex;
    gap: 8px;
    margin: -8px 0 16px;
    /* The chips line up with the pages, which are centred at 1100 px. */
    padding: 8px max(0px, calc((100% - 1100px) / 2));
    overflow-x: auto;
    scrollbar-width: none;
    scroll-snap-type: x proximity;
    background: var(--joe-bg);
  }
  .section-chips::-webkit-scrollbar {
    display: none;
  }
  /* A fade at an edge where more chips are hidden: the row scrolls. */
  .section-chips::before,
  .section-chips::after {
    content: "";
    position: sticky;
    z-index: 1;
    flex: none;
    width: 36px;
    align-self: stretch;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .section-chips::before {
    left: 0;
    order: -1;
    margin-right: -44px;
    background: linear-gradient(to left, transparent, var(--joe-bg));
  }
  .section-chips::after {
    right: 0;
    margin-left: -44px;
    background: linear-gradient(to right, transparent, var(--joe-bg));
  }
  .section-chips[data-more~="left"]::before,
  .section-chips[data-more~="right"]::after {
    opacity: 1;
  }
  .section-chip {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex: none;
    min-height: 44px;
    padding: 0 16px 0 12px;
    border-radius: 999px;
    scroll-snap-align: start;
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    text-decoration: none;
    background: var(--joe-surface-2);
    color: var(--joe-ink-2);
    transition: background 0.12s, color 0.12s, transform 0.12s;
  }
  @media (max-width: 400px) {
    .section-chips {
      gap: 6px;
    }
    .section-chip {
      gap: 4px;
      padding: 0 12px 0 9px;
    }
  }
  .section-chip:hover {
    background: var(--joe-line);
    color: var(--joe-ink);
  }
  .section-chip:active {
    transform: scale(0.97);
  }
  .section-chip.on,
  .section-chip.on:hover {
    background: var(--joe-ink);
    color: var(--joe-bg);
  }
  .section-count {
    font-size: 12px;
    opacity: 0.75;
  }
  .section-problem {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--joe-crit);
  }
  .ha-open {
    display: inline-grid;
    place-items: center;
    flex: none;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 1.5px solid var(--joe-line);
    border-radius: 50%;
    background: var(--joe-surface);
    color: var(--joe-ink-2);
    cursor: pointer;
    text-decoration: none;
    transition: border-color 0.12s, color 0.12s, transform 0.12s;
  }
  .ha-open:hover {
    border-color: var(--joe-amber);
    color: var(--joe-ink);
  }
  .ha-open:active {
    transform: scale(0.94);
  }
  .ha-open:focus-visible {
    border-radius: 50%;
  }
  .ha-open ha-icon {
    --mdc-icon-size: 20px;
  }
  a.ha-link {
    color: inherit;
    text-decoration: underline;
    text-decoration-color: var(--joe-line-2);
    text-underline-offset: 3px;
  }
  a.ha-link:hover {
    text-decoration-color: var(--joe-amber);
  }
  .mirror {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 12px;
    padding: 8px 0;
  }
  /* Label · value flow as text, so a value never ends up alone on a line; the button fits beside it on the phone. */
  .mirror-text {
    flex: 1 1 140px;
    min-width: 0;
    line-height: 1.5;
  }
  .mirror-label,
  .mirror-sep {
    color: var(--joe-ink-2);
  }
  .mirror-sep {
    margin-inline: 6px;
  }
  .mirror-text .chip {
    margin-left: 8px;
    vertical-align: middle;
  }
  .mirror-value {
    font-weight: 600;
  }
  .mirror-hint {
    display: block;
    margin-top: 2px;
    font-size: 12.5px;
    color: var(--joe-muted);
  }
  a.mirror-go {
    min-height: 44px;
    text-decoration: none;
  }
  .used-by {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0 14px;
    margin: 8px 0 0;
    padding-block: 6px;
    font-size: 13.5px;
    color: var(--joe-ink-2);
  }
  /* Wider gaps keep the uses apart; the icon and the label stay close to what follows. */
  .used-by-label,
  .used-by ha-icon {
    margin-right: -6px;
  }
  .used-by ha-icon {
    --mdc-icon-size: 16px;
    color: var(--joe-muted);
  }
  .used-by a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    /* 44 px to tap, but wrapped lines stay close together. */
    margin-block: -6px;
    font-weight: 600;
    color: var(--joe-ink);
    text-decoration: underline;
    text-decoration-color: var(--joe-line-2);
    text-underline-offset: 3px;
  }
  .used-by a:hover {
    text-decoration-color: var(--joe-amber);
  }
  .used-by.none {
    min-height: 44px;
  }
  /* Device cards (components/device-card.ts): the main link to Joe's page, the HA button beside it, quick actions below. */
  .dcards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
    gap: 12px;
  }
  .dcard {
    position: relative;
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: 4px 6px;
    padding: 6px 8px 6px 6px;
    border-radius: 14px;
    background: var(--joe-surface);
    box-shadow: inset 0 0 0 1px var(--joe-line);
  }
  .dcard.problem {
    box-shadow: inset 0 0 0 1.5px var(--joe-crit-soft);
  }
  a.dcard-main {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 2px 10px;
    min-height: 44px;
    padding: 8px 6px 8px 8px;
    border-radius: 10px;
    color: inherit;
    text-decoration: none;
    transition: background 0.12s;
  }
  a.dcard-main:hover {
    background: var(--joe-surface-2);
  }
  a.dcard-main > ha-icon {
    --mdc-icon-size: 22px;
    margin-top: 1px;
    color: var(--joe-ink-2);
  }
  .dcard-text {
    min-width: 0;
    display: grid;
    gap: 2px;
  }
  .dcard-name {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 700;
    overflow-wrap: anywhere;
  }
  .dcard-dot {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--joe-crit);
  }
  .dcard-area {
    color: var(--joe-muted);
    font-size: 13px;
  }
  .dcard-state {
    color: var(--joe-ink-2);
    font-variant-numeric: tabular-nums;
  }
  .dcard-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 2px;
  }
  .dcard-problem {
    color: var(--joe-crit);
    font-size: 13.5px;
  }
  .dcard .ha-open {
    margin-top: 6px;
  }
  .dcard-quick {
    grid-column: 1 / -1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 0 8px 8px;
  }
  .dcard-quick:empty {
    display: none;
  }
  /* Head of a group on Geräte › Alle: label, red dot, link to the group page. */
  .group-head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 22px 0 8px;
  }
  .group-head .group-label {
    margin: 0;
  }
  .group-head .group-go {
    margin-left: auto;
    min-height: 44px;
    text-decoration: none;
  }
  /* "← Speicher" above a device page: a real link to the group. */
  a.back-link {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding-inline: 2px 10px;
    font-weight: 600;
    color: var(--joe-ink-2);
    text-decoration: none;
  }
  a.back-link:hover {
    color: var(--joe-ink);
  }
  /* An address with an anchor lights up its target briefly (router.ts revealAnchor). */
  [data-anchor] {
    scroll-margin-top: calc(var(--joe-head-h, 0px) + 72px);
  }
  .flash {
    animation: joe-flash 1.5s ease-out;
  }
  @keyframes joe-flash {
    0%,
    40% {
      box-shadow: 0 0 0 3px var(--joe-amber);
    }
    100% {
      box-shadow: 0 0 0 3px transparent;
    }
  }
`;
