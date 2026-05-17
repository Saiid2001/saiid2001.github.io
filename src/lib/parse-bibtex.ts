import fs from 'node:fs';
import path from 'node:path';

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

function paperFileForKey(key: string): string {
  const rel = `papers/${key}.pdf`;
  const abs = path.resolve('public', rel);
  return fs.existsSync(abs) ? `/${rel}` : '';
}

function parseBibEntry(content: string): Publication | null {
  // Match @type{key, ... }
  const entryMatch = content.match(/@(\w+)\s*\{([^,]+),\s*([\s\S]*)\}/);
  if (!entryMatch) return null;

  const entryType = entryMatch[1].trim().toLowerCase();
  const key = entryMatch[2].trim();
  const body = entryMatch[3];

  const fields: Record<string, string> = {};
  // Match field = {value} or field = "value"
  const fieldRegex = /(\w+)\s*=\s*(?:\{([^}]*(?:\{[^}]*\}[^}]*)*)\}|"([^"]*)")/g;
  let match;
  while ((match = fieldRegex.exec(body)) !== null) {
    const fieldName = match[1].toLowerCase();
    const value = (match[2] ?? match[3] ?? '').trim();
    fields[fieldName] = value;
  }

  let status: PublicationStatus;
  if (fields.status === 'preprint') {
    status = 'preprint';
  } else if (entryType === 'unpublished') {
    status = 'submitted';
  } else {
    status = 'published';
  }

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
    paper_file: paperFileForKey(key),
  };
}

export function parseAllPublications(): Publication[] {
  const pubDir = path.resolve('src/data/_publications');
  const files = fs.readdirSync(pubDir).filter((f) => f.endsWith('.bib'));

  const publications: Publication[] = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(pubDir, file), 'utf-8');
    const entry = parseBibEntry(content);
    if (entry) {
      publications.push(entry);
    }
  }

  // Sort by year descending, then by key
  publications.sort((a, b) => {
    const yearDiff = parseInt(b.year) - parseInt(a.year);
    if (yearDiff !== 0) return yearDiff;
    return a.key.localeCompare(b.key);
  });

  return publications;
}
