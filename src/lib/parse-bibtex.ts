import fs from 'node:fs';
import path from 'node:path';

export interface Publication {
  key: string;
  title: string;
  author: string;
  booktitle: string;
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

function parseBibEntry(content: string): Publication | null {
  // Match @type{key, ... }
  const entryMatch = content.match(/@\w+\{([^,]+),\s*([\s\S]*)\}/);
  if (!entryMatch) return null;

  const key = entryMatch[1].trim();
  const body = entryMatch[2];

  const fields: Record<string, string> = {};
  // Match field = {value} or field = "value"
  const fieldRegex = /(\w+)\s*=\s*(?:\{([^}]*(?:\{[^}]*\}[^}]*)*)\}|"([^"]*)")/g;
  let match;
  while ((match = fieldRegex.exec(body)) !== null) {
    const fieldName = match[1].toLowerCase();
    const value = (match[2] ?? match[3] ?? '').trim();
    fields[fieldName] = value;
  }

  return {
    key,
    title: fields.title || '',
    author: fields.author || '',
    booktitle: fields.booktitle || '',
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
