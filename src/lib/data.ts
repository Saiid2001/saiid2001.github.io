import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

export interface ResearchData {
  supervisor: {
    title: string;
    name: string;
    website: string;
  };
  topic: string;
  subtopics: {
    title: string;
    key: string;
    description: string;
    icon: string;
  }[];
}

export function loadResearch(): ResearchData {
  const filePath = path.resolve('src/data/_research/position.yaml');
  const content = fs.readFileSync(filePath, 'utf-8');
  return yaml.load(content) as ResearchData;
}

export async function loadSummaryHtml(): Promise<string> {
  const filePath = path.resolve('src/data/summary.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  const result = await remark().use(remarkHtml, { sanitize: false }).process(content);
  return String(result);
}
