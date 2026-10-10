import { css } from "lit";

/** The Haushalt pages: head with title, lead and "Wird genutzt von", then cards. */
export const householdStyles = css`
  :host {
    display: block;
  }
  .wrap {
    max-width: 1100px;
    margin: 0 auto;
  }
  .page-head {
    margin-top: 6px;
  }
  .page-head .lead {
    margin-bottom: 4px;
  }
  .card {
    padding: 18px 20px;
    margin-top: 14px;
  }
  .head {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .head .eyebrow {
    flex: 1;
    min-width: 0;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 8px 12px;
    flex-wrap: wrap;
    margin-top: 12px;
  }
  .row > span:first-child {
    flex: 1 1 160px;
    min-width: 0;
  }
  .row.tight {
    margin-top: 6px;
  }
  .row .input {
    width: auto;
    min-width: 0;
  }
  .row .input.short {
    width: 90px;
  }
  .hint {
    margin: 8px 0 0;
    color: var(--joe-muted);
    font-size: 13px;
  }
  .say {
    margin: 10px 0 0;
    font-size: 15px;
    line-height: 1.5;
    color: var(--joe-ink-2);
    max-width: 62ch;
  }
  .now {
    margin: 10px 0 0;
    font-weight: 600;
  }
  .chips-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    flex: 1 1 160px;
    min-width: 0;
  }
  .chips-line .chip {
    white-space: normal;
    overflow-wrap: anywhere;
  }
  .card .note {
    margin-top: 10px;
  }
  .card .used-by {
    margin-top: 12px;
  }
  /* Short names ("Plan") still make a 44 px target. */
  .used-by a {
    min-width: 44px;
    justify-content: center;
  }
  @media (max-width: 760px) {
    .card {
      padding: 16px;
    }
  }
`;
