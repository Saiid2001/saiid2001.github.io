# Preprints and Under-Submission Work on the Publications Page

## Goal

Extend the publications page to surface work that is not yet published — both **preprints** (publicly available drafts, e.g. on arXiv) and **work under submission** (submitted to a venue, possibly anonymized). Today the page only renders entries assumed to be published, grouped by year.

## Scope

In scope:
- Parser support for three publication statuses: `published`, `preprint`, `submitted`.
- Two new dedicated sections rendered above the year-grouped published list.
- Status badges on cards.
- A defined BibTeX convention for authors of new entries.
- Graceful rendering when venue information is missing (anonymized submissions).

Out of scope:
- Changes to the CV (`cv-source/`) or any LaTeX pipeline.
- A new admin UI; entries are still authored as `.bib` files.
- Cross-referencing preprints with their eventual published versions.

## BibTeX Conventions

These conventions are the source of truth for how authors mark status. The parser must follow them exactly.

### Published (unchanged)

Use `@inproceedings`, `@article`, etc. No `status` field needed. Treated as published.

### Preprint

Use any standard entry type (typically `@misc` for arXiv), and add an explicit `status` field:

```bibtex
@misc{shortkey2026saiid,
  title     = {Your Paper Title},
  author    = {El Hajj Chehade, Saiid and Coauthor, Name},
  year      = {2026},
  status    = {preprint},
  archiveprefix = {arXiv},
  eprint    = {2601.12345},
  url       = {https://arxiv.org/abs/2601.12345},
  shorttitle = {SHORT},
  shortdescription = {One-line description},
  keywords  = {topic; topic},
  code_url  = {https://github.com/...},
  subtopics = {extensions}
}
```

The `status = {preprint}` field is what triggers the preprint section — entry type is not used to detect preprints.

### Under Submission

Use `@unpublished`. The entry type alone marks the work as under submission. Use the `note` field to express anonymized vs. named target venue:

```bibtex
@unpublished{shortkey2026saiid,
  title     = {Your Paper Title},
  author    = {El Hajj Chehade, Saiid and Coauthor, Name},
  year      = {2026},
  note      = {Under submission},
  shorttitle = {SHORT},
  shortdescription = {One-line description},
  keywords  = {topic; topic},
  code_url  = {https://github.com/...},
  subtopics = {server}
}
```

If naming the target venue is acceptable: `note = {Under submission to USENIX Security '26}`.

### Precedence

If both apply (e.g. `@unpublished` with `status = {preprint}`), `status` wins — explicit beats implicit.

## Parser Design (`src/lib/parse-bibtex.ts`)

Extend `Publication`:

```ts
export type PublicationStatus = 'published' | 'preprint' | 'submitted';

export interface Publication {
  // ... existing fields ...
  entryType: string;     // 'inproceedings', 'unpublished', 'misc', 'article', ...
  status: PublicationStatus;
  note: string;          // raw note field, used for venue fallback
  journal: string;       // for @article fallback
}
```

Changes to `parseBibEntry`:
- The opening regex must capture the entry type as well as the key:
  `/@(\w+)\s*\{([^,]+),\s*([\s\S]*)\}/`
- Capture additional fields: `status`, `note`, `journal`.
- Derive `status` after parsing:
  1. If `fields.status === 'preprint'` → `'preprint'`.
  2. Else if `entryType === 'unpublished'` → `'submitted'`.
  3. Else → `'published'`.

The existing `paper_file` convention (`/papers/<key>.pdf`) stays the same. For preprints and submitted work, if no PDF exists at that path the link still renders (current behavior) — authors can omit the `[Paper]` link by leaving the file out; we are not adding existence checks in this spec.

## Display Component Changes (`src/components/PublicationsClient.tsx`)

### Section order

1. **Preprints** — entries with `status === 'preprint'`, sorted by year desc then key.
2. **Under Submission** — entries with `status === 'submitted'`, sorted by year desc then key.
3. **GET /YYYY** year sections — entries with `status === 'published'`, current behavior.

Each special section uses the same monospace heading style as the year sections, e.g. `GET /preprints` and `GET /under-submission`. If a special section has zero entries, do not render it at all (no heading).

### Card changes (`PublicationCard`)

- Add a status badge below the title for non-published entries: `Preprint` for preprints, `Under Submission` for submitted. Use the existing `badge` / DaisyUI styling, secondary color for visual consistency with the existing accent.
- Venue line fallback chain: `booktitle` → `journal` → `note` → empty string. If the resolved venue is empty, omit the line entirely instead of rendering an empty `<p>`.
- BibTeX block, paper link, code link: unchanged.

### Filter bar

- Year filter: continues to list only years that appear in **published** entries. Selecting a year filter implicitly scopes the visible list to published work (the preprints/under-submission sections hide while a year filter is active, to avoid confusing "this year filter does not apply here" states).
- Add a **Status** filter row: `All` / `Published` / `Preprint` / `Under Submission`. Default `All`. When a non-`All` status is selected, only that section is rendered; the year filter resets and hides if the status filter is anything other than `Published` or `All`.
- Venue filter: unchanged. Computed only from entries that have a non-empty `booktitle`, so anonymized submissions don't add empty venue chips.
- The publication count line continues to show the total count of currently visible entries across all rendered sections.

### Empty states

- If the entire filtered set is empty, show the existing layout with `0 publication(s)` and no section headings.

## Data Flow

```
src/data/_publications/*.bib
         │
         ▼
parse-bibtex.ts (build-time, Node)
         │  Publication[] with status field
         ▼
publications.astro page
         │  passes Publication[] to PublicationsClient
         ▼
PublicationsClient.tsx (React island)
         │  filters by year + venue + status
         ▼
Bucketed into preprints / submitted / by-year
         │
         ▼
PublicationCard with optional status badge
```

## Testing Plan

Manual verification (this repo has no test suite):
1. Add one fixture `.bib` entry of each new kind to `src/data/_publications/` (e.g. `preprint_example.bib`, `submitted_example.bib`).
2. Run `yarn dev` and verify:
   - Both new sections appear above the year groups in the correct order.
   - Badges render with the right label and styling.
   - Cards with no `booktitle` do not render an empty venue line.
   - Status filter shows/hides sections correctly.
   - Year filter still works for published entries and hides the preprint/submitted sections.
   - BibTeX copy button still copies the raw entry.
3. Run `yarn typecheck` and `yarn build`.
4. Remove the fixture entries before merging.

## Risks and Mitigations

- **Risk:** Existing entries unintentionally classified as preprint if anyone has a stray `status` field. **Mitigation:** Inspect the three current `.bib` files — none use `status`. Status is opt-in.
- **Risk:** Anonymous submissions leak venue via the `note` field if authors put venue details there. **Mitigation:** Convention is documented above; entry author owns this choice.
- **Risk:** UI sections look bare with only one entry. **Mitigation:** Accepted — preprint pipelines are typically sparse, and the section heading itself provides useful context.

## Open Decisions (resolved)

- **Section count:** Three separate sections (Preprints, Under Submission, year groups) — confirmed.
- **Status signal:** `@unpublished` entry type for submitted; explicit `status = {preprint}` field for preprints — confirmed.
- **Venue handling for anonymized work:** Fallback chain, hide line if all sources empty — included in design.
