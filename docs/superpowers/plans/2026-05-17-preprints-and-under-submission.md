# Preprints and Under-Submission Publications — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface preprints and under-submission work on the publications page as two dedicated sections rendered above the existing year-grouped published list.

**Architecture:** Extend the build-time BibTeX parser with an `entryType` capture, a few new field captures (`status`, `note`, `journal`), and a derived `status` discriminator. The React `PublicationsClient` buckets publications into three groups and renders them in order; cards get a small status badge and a venue fallback chain.

**Tech Stack:** Astro 5, React 18 (islands), TypeScript 5, Tailwind 3.4 + DaisyUI 4.4. No automated test suite — verification is `yarn typecheck`, `yarn build`, and a manual smoke test against `yarn dev`.

**Spec reference:** `docs/superpowers/specs/2026-05-17-preprints-and-under-submission-design.md`

---

## File Inventory

- **Modify:** `src/lib/parse-bibtex.ts` — extend `Publication` interface, capture entry type, add new fields, derive `status`.
- **Modify:** `src/components/PublicationsClient.tsx` — bucket publications, render new sections, add badge, venue fallback, status filter.
- **Create (temporary, removed at end):** `src/data/_publications/_fixture_preprint.bib`, `src/data/_publications/_fixture_submitted.bib` — smoke-test fixtures.
- **No changes:** `src/pages/publications.astro`. The page already passes the full `Publication[]` to the client and uses `booktitle` only in JSON-LD metadata, where an empty string is acceptable (downstream consumers will simply see an empty publisher).

---

## Task 1: Extend the parser with entry type and new fields

**Files:**
- Modify: `src/lib/parse-bibtex.ts`

- [ ] **Step 1: Update the `Publication` interface and add the status union type**

Replace the existing `Publication` interface with the version below. This adds `entryType`, `status`, `note`, and `journal`. Keep all existing fields exactly as they are.

```ts
export type PublicationStatus = 'published' | 'preprint' | 'submitted';

export interface Publication {
  key: string;
  entryType: string;
  status: PublicationStatus;
  title: string;
  author: string;
  booktitle: string;
  journal: string;
  note: string;
  year: string;
  raw: string;
  shorttitle: string;
  shortdescription: string;
  url: string;
  code_url: string;
  finished: boolean;
  subtopics: string;
  favorite: boolean;
  keywords: string;
  paper_file: string;
}
```

- [ ] **Step 2: Capture the entry type in the entry-matching regex**

Change the opening regex inside `parseBibEntry` from:

```ts
const entryMatch = content.match(/@\w+\{([^,]+),\s*([\s\S]*)\}/);
```

to capture the entry type as group 1:

```ts
const entryMatch = content.match(/@(\w+)\s*\{([^,]+),\s*([\s\S]*)\}/);
```

Then update the destructuring below it:

```ts
const entryType = entryMatch[1].trim().toLowerCase();
const key = entryMatch[2].trim();
const body = entryMatch[3];
```

- [ ] **Step 3: Derive the status discriminator and return the new fields**

After the existing `fieldRegex` while-loop and before the `return` statement, add:

```ts
let status: PublicationStatus;
if (fields.status === 'preprint') {
  status = 'preprint';
} else if (entryType === 'unpublished') {
  status = 'submitted';
} else {
  status = 'published';
}
```

Then change the `return` block to include the new fields:

```ts
return {
  key,
  entryType,
  status,
  title: fields.title || '',
  author: fields.author || '',
  booktitle: fields.booktitle || '',
  journal: fields.journal || '',
  note: fields.note || '',
  year: fields.year || '',
  raw: content.trim(),
  shorttitle: fields.shorttitle || '',
  shortdescription: fields.shortdescription || '',
  url: fields.url || '',
  code_url: fields.code_url || '',
  finished: fields.finished === '1',
  subtopics: fields.subtopics || '',
  favorite: fields.favorite === '1',
  keywords: fields.keywords || '',
  paper_file: `/papers/${key}.pdf`,
};
```

- [ ] **Step 4: Verify the parser still type-checks**

Run: `yarn typecheck`

Expected: no errors. (Existing call sites only consume the original fields, which are still present.)

- [ ] **Step 5: Commit**

```bash
git add src/lib/parse-bibtex.ts
git commit -m "feat(publications): parse entry type and derive publication status"
```

---

## Task 2: Add status filter state and bucket publications in the client

**Files:**
- Modify: `src/components/PublicationsClient.tsx`

- [ ] **Step 1: Import the status type**

Update the existing import at the top of the file from:

```ts
import type { Publication } from "../lib/parse-bibtex";
```

to:

```ts
import type { Publication, PublicationStatus } from "../lib/parse-bibtex";
```

- [ ] **Step 2: Add the status filter state and bucket the filtered list**

Inside `PublicationsClient`, after the existing `filterVenue` `useState` line, add a status filter state:

```tsx
const [filterStatus, setFilterStatus] = React.useState<PublicationStatus | 'all'>('all');
```

Then locate the `filtered` declaration:

```tsx
const filtered = publications.filter((p) => {
  if (filterYear && p.year !== filterYear) return false;
  if (filterVenue) {
    const normalized = normalizeVenue(p.booktitle);
    const filterNormalized = normalizeVenue(filterVenue);
    if (normalized !== filterNormalized) return false;
  }
  return true;
});
```

Replace it with the version below. This adds the status filter, makes the year filter scope to published only (year filter is meaningless for preprints/submitted), and computes three buckets:

```tsx
const filtered = publications.filter((p) => {
  if (filterStatus !== 'all' && p.status !== filterStatus) return false;
  if (filterYear && (p.status !== 'published' || p.year !== filterYear)) return false;
  if (filterVenue) {
    const normalized = normalizeVenue(p.booktitle);
    const filterNormalized = normalizeVenue(filterVenue);
    if (normalized !== filterNormalized) return false;
  }
  return true;
});

const preprints = filtered.filter((p) => p.status === 'preprint');
const submitted = filtered.filter((p) => p.status === 'submitted');
const published = filtered.filter((p) => p.status === 'published');
```

- [ ] **Step 3: Replace the `groupedByYear` source with `published`**

Find:

```tsx
const groupedByYear = filtered.reduce(
  (acc: Record<string, Publication[]>, pub) => {
```

Change `filtered` to `published`:

```tsx
const groupedByYear = published.reduce(
  (acc: Record<string, Publication[]>, pub) => {
```

- [ ] **Step 4: Restrict the year filter chip list to published years**

Find:

```tsx
const years = [...new Set(publications.map((p) => p.year))].sort((a, b) => parseInt(b) - parseInt(a));
```

Change to:

```tsx
const years = [...new Set(publications.filter((p) => p.status === 'published').map((p) => p.year))].sort((a, b) => parseInt(b) - parseInt(a));
```

- [ ] **Step 5: Restrict the venue chip list to published entries with a non-empty booktitle**

Find:

```tsx
const venueMap = new Map<string, string>();
publications.forEach((p) => {
  if (p.booktitle) {
    const normalized = normalizeVenue(p.booktitle);
    if (!venueMap.has(normalized)) {
      venueMap.set(normalized, p.booktitle);
    }
  }
});
```

Change the `forEach` predicate so anonymized submissions don't add empty chips:

```tsx
const venueMap = new Map<string, string>();
publications.forEach((p) => {
  if (p.status === 'published' && p.booktitle) {
    const normalized = normalizeVenue(p.booktitle);
    if (!venueMap.has(normalized)) {
      venueMap.set(normalized, p.booktitle);
    }
  }
});
```

- [ ] **Step 6: Verify it type-checks**

Run: `yarn typecheck`

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/PublicationsClient.tsx
git commit -m "feat(publications): bucket entries by status and scope filters to published"
```

---

## Task 3: Render the Preprints and Under Submission sections

**Files:**
- Modify: `src/components/PublicationsClient.tsx`

- [ ] **Step 1: Extract a reusable section renderer**

Inside the `PublicationsClient` component body, after the `published` / `groupedByYear` computations and before the `return`, add:

```tsx
const renderSection = (id: string, label: string, entries: Publication[]) => {
  if (entries.length === 0) return null;
  return (
    <div key={id} className="flex flex-col gap-y-4">
      <span>
        <span className="absolute w-screen h-10 gradient-overlay-2 z-20 left-0"></span>
        <h2 className="text-3xl text-base-content font-mono">
          GET <b>{label}</b>
        </h2>
      </span>
      <div className="flex flex-col gap-y-4">
        {entries.map((pub) => (
          <PublicationCard key={pub.key} pub={pub} />
        ))}
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Render the two special sections before the year groups**

Locate the JSX that renders the year groups inside the returned `<div className="mt-32 ...">`:

```tsx
{Object.keys(groupedByYear)
  .sort((a, b) => parseInt(b) - parseInt(a))
  .map((year) => (
    <div key={year} className="flex flex-col gap-y-4">
      <span>
        <span className="absolute w-screen h-10 gradient-overlay-2 z-20 left-0"></span>
        <h2 className="text-3xl text-base-content font-mono">
          GET <b>{year}</b>
        </h2>
      </span>
      <div className="flex flex-col gap-y-4">
        {groupedByYear[year].map((pub) => (
          <PublicationCard key={pub.key} pub={pub} />
        ))}
      </div>
    </div>
  ))}
```

Insert the two section renderers immediately before this block, so the final order is preprints → submitted → years:

```tsx
{renderSection('preprints', '/preprints', preprints)}
{renderSection('submitted', '/under-submission', submitted)}
{Object.keys(groupedByYear)
  .sort((a, b) => parseInt(b) - parseInt(a))
  .map((year) => (
    <div key={year} className="flex flex-col gap-y-4">
      <span>
        <span className="absolute w-screen h-10 gradient-overlay-2 z-20 left-0"></span>
        <h2 className="text-3xl text-base-content font-mono">
          GET <b>{year}</b>
        </h2>
      </span>
      <div className="flex flex-col gap-y-4">
        {groupedByYear[year].map((pub) => (
          <PublicationCard key={pub.key} pub={pub} />
        ))}
      </div>
    </div>
  ))}
```

- [ ] **Step 3: Verify it type-checks**

Run: `yarn typecheck`

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/PublicationsClient.tsx
git commit -m "feat(publications): render preprints and under-submission sections"
```

---

## Task 4: Status badge and venue fallback on the card

**Files:**
- Modify: `src/components/PublicationsClient.tsx`

- [ ] **Step 1: Add a venue helper and a status label helper at the top of the file**

Just below the existing `normalizeVenue` function, add two helpers:

```tsx
function venueText(pub: Publication): string {
  return pub.booktitle || pub.journal || pub.note || '';
}

function statusBadgeLabel(status: Publication['status']): string | null {
  if (status === 'preprint') return 'Preprint';
  if (status === 'submitted') return 'Under Submission';
  return null;
}
```

- [ ] **Step 2: Use the helpers inside `PublicationCard`**

Find the existing card JSX:

```tsx
<h2 className="text-2xl font-bold">{cleanTitle(pub.title)}</h2>
<p className="text-lg text-muted">{pub.author}</p>
<p className="text-lg italic text-muted">{pub.booktitle}</p>
```

Replace it with:

```tsx
<div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-1">
  <h2 className="text-2xl font-bold">{cleanTitle(pub.title)}</h2>
  {statusBadgeLabel(pub.status) && (
    <span className="badge badge-secondary badge-outline font-mono text-xs">
      {statusBadgeLabel(pub.status)}
    </span>
  )}
</div>
<p className="text-lg text-muted">{pub.author}</p>
{venueText(pub) && (
  <p className="text-lg italic text-muted">{venueText(pub)}</p>
)}
```

- [ ] **Step 3: Verify it type-checks**

Run: `yarn typecheck`

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/PublicationsClient.tsx
git commit -m "feat(publications): status badge and venue fallback chain on cards"
```

---

## Task 5: Status filter chips in the filter bar

**Files:**
- Modify: `src/components/PublicationsClient.tsx`

- [ ] **Step 1: Add status chip definitions next to the existing filter bar**

Locate the filter bar block:

```tsx
<div className="flex flex-wrap gap-2 items-center">
  <span className="text-sm font-mono text-muted">Year:</span>
```

Insert a status-chip group **before** the `Year:` span so status is the first row. Replace the opening of that block with:

```tsx
<div className="flex flex-wrap gap-2 items-center">
  <span className="text-sm font-mono text-muted">Status:</span>
  {([
    ['all', 'All'],
    ['published', 'Published'],
    ['preprint', 'Preprint'],
    ['submitted', 'Under Submission'],
  ] as const).map(([value, label]) => (
    <button
      key={value}
      className={
        "btn btn-sm " +
        (filterStatus === value ? "btn-secondary" : "btn-outline border-muted text-muted")
      }
      onClick={() => {
        setFilterStatus(value);
        if (value !== 'all' && value !== 'published') setFilterYear(null);
      }}
    >
      {label}
    </button>
  ))}
  <span className="text-sm font-mono text-muted ml-4">Year:</span>
```

- [ ] **Step 2: Hide the Year chip group when the status filter excludes published**

Wrap the existing `Year:` span and the year-chip `.map(...)` immediately after it in a conditional. Find:

```tsx
<span className="text-sm font-mono text-muted ml-4">Year:</span>
{years.map((year) => (
  <button
    key={year}
    className={
      "btn btn-sm " +
      (filterYear === year ? "btn-secondary" : "btn-outline border-muted text-muted")
    }
    onClick={() => setFilterYear(filterYear === year ? null : year)}
  >
    {year}
  </button>
))}
```

Wrap with `{(filterStatus === 'all' || filterStatus === 'published') && (<> ... </>)}`:

```tsx
{(filterStatus === 'all' || filterStatus === 'published') && (
  <>
    <span className="text-sm font-mono text-muted ml-4">Year:</span>
    {years.map((year) => (
      <button
        key={year}
        className={
          "btn btn-sm " +
          (filterYear === year ? "btn-secondary" : "btn-outline border-muted text-muted")
        }
        onClick={() => setFilterYear(filterYear === year ? null : year)}
      >
        {year}
      </button>
    ))}
  </>
)}
```

- [ ] **Step 3: Verify it type-checks**

Run: `yarn typecheck`

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/PublicationsClient.tsx
git commit -m "feat(publications): status filter chips with year-chip gating"
```

---

## Task 6: Smoke test against fixtures, then clean up

**Files:**
- Create: `src/data/_publications/_fixture_preprint.bib`
- Create: `src/data/_publications/_fixture_submitted.bib`

- [ ] **Step 1: Create a preprint fixture**

Write `src/data/_publications/_fixture_preprint.bib`:

```bibtex
@misc{fixturepreprint2026saiid,
  title     = {Fixture Preprint Title},
  author    = {El Hajj Chehade, Saiid},
  year      = {2026},
  status    = {preprint},
  archiveprefix = {arXiv},
  eprint    = {2601.99999},
  url       = {https://arxiv.org/abs/2601.99999},
  shorttitle = {FIXTURE-PRE},
  shortdescription = {Fixture preprint for local smoke test},
  keywords  = {fixture}
}
```

- [ ] **Step 2: Create an under-submission fixture (anonymized — no `note`)**

Write `src/data/_publications/_fixture_submitted.bib`:

```bibtex
@unpublished{fixturesubmitted2026saiid,
  title     = {Fixture Submitted Title},
  author    = {El Hajj Chehade, Saiid},
  year      = {2026},
  shorttitle = {FIXTURE-SUB},
  shortdescription = {Fixture under-submission entry for local smoke test},
  keywords  = {fixture}
}
```

- [ ] **Step 3: Run typecheck and build**

Run: `yarn typecheck && yarn build`

Expected: both succeed with no errors.

- [ ] **Step 4: Manual smoke test against the dev server**

Run: `yarn dev` and open the publications page in a browser.

Verify each of the following:
1. **Preprints** section appears first, contains the fixture preprint, with a "Preprint" badge next to the title.
2. **Under Submission** section appears second, contains the fixture submitted entry, with an "Under Submission" badge.
3. The anonymized fixture (`_fixture_submitted.bib`) renders with **no italic venue line** (since `booktitle`, `journal`, and `note` are all empty).
4. The existing **GET /YYYY** year sections render unchanged below.
5. **Status filter:** clicking `Preprint` hides Under Submission and year sections; clicking `Under Submission` hides the other two; clicking `Published` hides both special sections; clicking `All` restores everything. When `Preprint` or `Under Submission` is active, the Year chip row is hidden.
6. **Year filter:** clicking a year hides preprints/submitted sections and shows only that year's published entries (current behavior preserved).
7. **Venue filter:** the venue chip list does not include any empty entries.
8. **BibTeX copy button:** still copies the raw entry on each card.

Stop `yarn dev` when done.

- [ ] **Step 5: Remove fixtures**

```bash
rm src/data/_publications/_fixture_preprint.bib src/data/_publications/_fixture_submitted.bib
```

Run `yarn build` once more to confirm a clean build without the fixtures.

- [ ] **Step 6: Commit (only if there are leftover unstaged changes — the fixtures were never committed, so this is normally a no-op)**

Run: `git status`

Expected: working tree clean for the publication files. If anything in `src/` is unexpectedly modified, investigate; do not commit fixtures.

---

## Self-Review Notes

- **Spec coverage check:** Parser fields ✓ (Task 1), three-section render order ✓ (Task 3), badges ✓ (Task 4), venue fallback ✓ (Task 4), status filter + year-filter gating ✓ (Task 5), empty-state hiding ✓ (Task 3 step 1 `renderSection` early-returns null), venue chip filter excludes anonymized ✓ (Task 2 step 5).
- **No automated tests:** This codebase has no test runner. Verification is type-checking + `yarn build` + a single manual smoke pass with fixtures (Task 6), as per the spec's testing plan.
- **No placeholders:** All steps include exact code, exact file paths, exact commands.
- **Type consistency:** `PublicationStatus` is defined in Task 1 and imported in Task 2; `Publication['status']` is the field reference in Task 4 — both resolve to the same type alias.
