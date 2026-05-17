# Saiid El Hajj Chehade's Personal Website

This is my personal website, where I share my thoughts, projects, and experiences.

## Adding a publication

Each publication is one `.bib` file in `src/data/_publications/`. The filename is used to look up the PDF at `/papers/<key>.pdf` (drop the PDF in `public/papers/`).

### Published work

Use a standard entry type — no extra fields needed.

```bibtex
@inproceedings{shortkey2026saiid,
  title     = {Paper Title},
  author    = {El Hajj Chehade, Saiid and Coauthor, Name},
  booktitle = {Venue Name},
  year      = {2026},
  shorttitle = {SHORT},
  shortdescription = {One-line description},
  keywords  = {topic; topic},
  code_url  = {https://github.com/...},
  url       = {https://...},
  subtopics = {extensions}
}
```

### Preprint

Any entry type (typically `@misc`) plus an explicit `status = {preprint}` field. Renders in the **Preprints** section.

```bibtex
@misc{shortkey2026saiid,
  title     = {Paper Title},
  author    = {El Hajj Chehade, Saiid and Coauthor, Name},
  year      = {2026},
  status    = {preprint},
  archiveprefix = {arXiv},
  eprint    = {2601.12345},
  url       = {https://arxiv.org/abs/2601.12345},
  shorttitle = {SHORT},
  shortdescription = {One-line description},
  keywords  = {topic; topic}
}
```

### Under submission

Use `@unpublished`. Renders in the **Under Submission** section. Use the `note` field if you want to name (or hide) the target venue.

```bibtex
@unpublished{shortkey2026saiid,
  title     = {Paper Title},
  author    = {El Hajj Chehade, Saiid and Coauthor, Name},
  year      = {2026},
  note      = {Under submission},
  shorttitle = {SHORT},
  shortdescription = {One-line description},
  keywords  = {topic; topic}
}
```

For a named target venue: `note = {Under submission to USENIX Security '26}`. Omit `note` entirely for a fully anonymized listing (no venue line is rendered).

If both `@unpublished` and `status = {preprint}` apply, `status` wins.

### Venue field by entry type

The italic venue line falls back through `booktitle` → `journal` → `note`, so use whichever fits the entry type:

| Entry type | Venue field |
|---|---|
| `@inproceedings` | `booktitle` |
| `@article` | `journal` |
| `@unpublished` | `note` |
| `@misc` (preprint) | usually none; `note` if you want one |

