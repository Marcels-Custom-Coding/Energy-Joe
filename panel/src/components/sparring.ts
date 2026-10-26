import { css, html, type TemplateResult } from "lit";
import { formatNumber } from "../entities";
import type { Translate } from "../i18n";
import type { Route } from "../router";
import type { HomeAssistant, SparringReport, SparringState } from "../types";
import { dayText } from "./look-back";

// Zweiter Blick (0.9.44): once a day a language model reads a summary of
// Joe's numbers and texts and answers with findings, better wordings,
// proposals and questions. Joe only shows them; he never takes one over.
// Einstellungen › Betrieb turns it on, Rückblick › Gelernt shows the reports,
// "Joe braucht dich" points to a new one.

/** Where the reports live (Rückblick › Gelernt, anchor sparring). */
export const SPARRING_ROUTE: Route = { tab: "review", section: "learned", id: "sparring" };
/** Where it is turned on (Einstellungen › Betrieb, anchor sparring). */
export const SPARRING_SETTINGS: Route = { tab: "settings", section: "operation", id: "sparring" };

/** energy_joe/sparring; undefined on an older backend or when it failed. */
export async function loadSparring(hass: HomeAssistant | undefined): Promise<SparringState | undefined> {
  if (!hass) {
    return undefined;
  }
  try {
    return await hass.callWS<SparringState>({ type: "energy_joe/sparring" });
  } catch {
    return undefined;
  }
}

/** How many points a report brings: findings, texts, proposals and questions. */
export function sparringCount(report: SparringReport): number {
  return report.findings.length + report.texts.length + report.proposals.length + report.questions.length;
}

/** The newest report while it waits for the user: it worked, is not seen and found something. */
export function sparringNews(sparring: SparringState | undefined): SparringReport | undefined {
  const report = sparring?.reports[0];
  return report && report.ok && !report.seen && sparringCount(report) > 0 ? report : undefined;
}

/** "3 Punkte" from "Punkt|Punkte". */
export function sparringPoints(t: Translate, count: number): string {
  const [one, other] = t("sparring.points").split("|");
  return `${formatNumber(t.lang, count, 0)} ${count === 1 ? one : other}`;
}

/** "27. Oktober, 06:00 Uhr" for a time from the backend (local time of Home Assistant). */
export function sparringWhen(t: Translate, iso: string): string {
  return t("sparring.when", { day: dayText(t.lang, iso.slice(0, 10)), time: iso.slice(11, 16) });
}

// --- "Was ich schicke": the summary in readable form ---

type Scalar = string | number | boolean | null;

/** Lists and objects longer than this fold away behind their count. */
const LONG = 12;

function isScalar(value: unknown): value is Scalar {
  return value === null || ["string", "number", "boolean"].includes(typeof value);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** An object of plain values only: a row of a table. */
function isFlat(value: unknown): value is Record<string, Scalar> {
  return isObject(value) && Object.values(value).every(isScalar);
}

/** "Plan gegen Ist" for plan_vs_actual when the dictionary knows it, else the key in plain words; text keys stay as they are. */
function label(t: Translate, key: string): string {
  const known = t.optional(`sparring.brief.${key}`);
  if (known) {
    return known;
  }
  return /^[a-z0-9_]+$/.test(key) ? key.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase()) : key;
}

function scalar(t: Translate, value: Scalar): string {
  if (value === null || value === "") {
    return "–";
  }
  if (typeof value === "boolean") {
    return t(value ? "sparring.yes" : "sparring.no");
  }
  if (typeof value === "number") {
    return new Intl.NumberFormat(t.lang, { maximumFractionDigits: 2 }).format(value);
  }
  return value;
}

function size(value: unknown): number {
  return Array.isArray(value) ? value.length : isObject(value) ? Object.keys(value).length : 0;
}

function valueView(t: Translate, value: unknown): TemplateResult {
  if (isScalar(value)) {
    return html`<span class="brief-v">${scalar(t, value)}</span>`;
  }
  if (Array.isArray(value)) {
    if (!value.length) {
      return html`<span class="brief-v">–</span>`;
    }
    if (value.every(isScalar)) {
      return html`<span class="brief-v">${value.map((v) => scalar(t, v)).join(", ")}</span>`;
    }
    if (value.every(isFlat)) {
      return tableView(t, value);
    }
    return html`<ol class="brief-list">
      ${value.map((item) => html`<li>${valueView(t, item)}</li>`)}
    </ol>`;
  }
  return isObject(value) ? fieldsView(t, value) : html`<span class="brief-v">–</span>`;
}

/** Rows of equal objects (one night each …) as a table. */
function tableView(t: Translate, rows: Record<string, Scalar>[]): TemplateResult {
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  return html`<div class="brief-table">
    <table>
      <thead>
        <tr>
          ${columns.map((column) => html`<th scope="col">${label(t, column)}</th>`)}
        </tr>
      </thead>
      <tbody>
        ${rows.map(
          (row) => html`<tr>
            ${columns.map((column) => html`<td>${scalar(t, row[column] ?? null)}</td>`)}
          </tr>`,
        )}
      </tbody>
    </table>
  </div>`;
}

/** Name and value side by side; whatever is bigger gets the full width, long things fold away. */
function fieldsView(t: Translate, fields: Record<string, unknown>): TemplateResult {
  return html`<dl class="brief-fields">
    ${Object.entries(fields).map(([key, value]) => {
      const name = label(t, key);
      if (size(value) > LONG) {
        return html`<div class="brief-wide">
          <details class="brief-more" data-notip>
            <summary>${t("sparring.brief.more", { label: name, count: size(value) })}</summary>
            ${valueView(t, value)}
          </details>
        </div>`;
      }
      if (isScalar(value) || (Array.isArray(value) && value.every(isScalar))) {
        return html`<dt>${name}</dt>
          <dd>${valueView(t, value)}</dd>`;
      }
      return html`<div class="brief-wide">
        <dt>${name}</dt>
        <dd>${valueView(t, value)}</dd>
      </div>`;
    })}
  </dl>`;
}

/** What Joe sends: each part under its own heading, the raw JSON a tap away. */
export function briefView(t: Translate, brief: Record<string, unknown>): TemplateResult {
  return html`<div class="brief">
    ${Object.entries(brief).map(
      ([key, value]) => html`<section class="brief-part">
        <h4>${label(t, key)}</h4>
        ${size(value) > LONG
          ? html`<details class="brief-more" data-notip>
              <summary>${t("sparring.brief.more", { label: label(t, key), count: size(value) })}</summary>
              ${valueView(t, value)}
            </details>`
          : valueView(t, value)}
      </section>`,
    )}
    <details class="brief-more" data-notip>
      <summary>${t("sparring.brief.json")}</summary>
      <pre>${JSON.stringify(brief, null, 2)}</pre>
    </details>
  </div>`;
}

/** "Bericht ansehen", "nichts gefunden" or "hat nicht geklappt" as a chip. */
export function reportChip(t: Translate, report: SparringReport): TemplateResult {
  if (!report.ok) {
    return html`<span class="chip warn">${t("sparring.chip.failed")}</span>`;
  }
  const count = sparringCount(report);
  return count
    ? html`<span class="chip ${report.seen ? "" : "warn"}">${sparringPoints(t, count)}</span>`
    : html`<span class="chip ok">${t("sparring.chip.clean")}</span>`;
}

export const briefStyles = css`
  .brief {
    display: grid;
    gap: 14px;
    min-width: 0;
    font-size: 14px;
  }
  /* Wide tables and the JSON scroll inside, the page never sideways. */
  .brief > *,
  .brief-wide,
  details.brief-more {
    min-width: 0;
    max-width: 100%;
  }
  .brief h4 {
    margin: 0 0 4px;
    font-size: 14px;
  }
  .brief-fields {
    display: grid;
    grid-template-columns: minmax(0, 16em) minmax(0, 1fr);
    gap: 4px 14px;
    margin: 0;
  }
  .brief-fields dt {
    color: var(--joe-ink-2);
    overflow-wrap: anywhere;
  }
  .brief-fields dd {
    margin: 0;
    min-width: 0;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }
  .brief-wide {
    grid-column: 1 / -1;
  }
  .brief-wide > dd {
    margin: 2px 0 6px 12px;
  }
  .brief-list {
    margin: 0;
    padding-left: 20px;
  }
  .brief-list li + li {
    margin-top: 6px;
  }
  .brief-table {
    overflow-x: auto;
  }
  .brief-table table {
    border-collapse: collapse;
    font-variant-numeric: tabular-nums;
  }
  .brief-table th,
  .brief-table td {
    padding: 4px 10px 4px 0;
    text-align: left;
    white-space: nowrap;
    border-top: 1px solid var(--joe-line);
  }
  .brief-table th {
    border-top: 0;
    font-size: 12px;
    font-weight: 600;
    color: var(--joe-muted);
  }
  details.brief-more summary {
    min-height: 32px;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-weight: 600;
    width: fit-content;
  }
  details.brief-more pre {
    margin: 4px 0 0;
    padding: 10px 12px;
    border-radius: 10px;
    background: var(--joe-surface);
    box-shadow: inset 0 0 0 1px var(--joe-line);
    font-size: 12px;
    overflow: auto;
    max-height: 420px;
  }
  @media (max-width: 600px) {
    .brief-fields {
      grid-template-columns: 1fr;
      gap: 0;
    }
    .brief-fields dd {
      margin-bottom: 6px;
    }
  }
  @media (pointer: coarse) {
    details.brief-more summary {
      min-height: 44px;
    }
  }
`;
