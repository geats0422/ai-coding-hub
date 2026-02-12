#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const CONTENT_DIR = path.resolve(process.cwd(), 'content');

const normalizePath = (filePath) => path.relative(process.cwd(), filePath).replace(/\\/g, '/');

const getFenceMask = (lines) => {
  const inFence = new Array(lines.length).fill(false);
  let fence = null;

  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();
    const match = trimmed.match(/^(`{3,}|~{3,})/);

    if (match) {
      const marker = match[1][0];
      const size = match[1].length;

      if (fence && fence.marker === marker && size >= fence.size) {
        inFence[index] = true;
        fence = null;
        continue;
      }

      if (!fence) {
        inFence[index] = true;
        fence = { marker, size };
        continue;
      }
    }

    if (fence) {
      inFence[index] = true;
    }
  }

  return inFence;
};

const splitRowCells = (line) => {
  let text = line.trim();

  if (!text.startsWith('|')) {
    return null;
  }

  if (text.startsWith('|')) {
    text = text.slice(1);
  }

  if (text.endsWith('|')) {
    text = text.slice(0, -1);
  }

  const cells = [];
  let current = '';
  let escaped = false;
  let activeCodeTicks = 0;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === '`') {
      let count = 1;

      while (index + count < text.length && text[index + count] === '`') {
        count += 1;
      }

      if (activeCodeTicks === 0) {
        activeCodeTicks = count;
      } else if (activeCodeTicks === count) {
        activeCodeTicks = 0;
      }

      current += '`'.repeat(count);
      index += count - 1;
      continue;
    }

    if (char === '\\' && activeCodeTicks === 0) {
      current += char;
      escaped = true;
      continue;
    }

    if (char === '|' && activeCodeTicks === 0) {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
};

const isDelimiterRow = (line) => {
  const cells = splitRowCells(line);

  if (!cells || cells.length < 2) {
    return false;
  }

  return cells.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s+/g, '')));
};

const walk = async (dirPath) => {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    if (entry.isFile() && fullPath.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
};

const checkFile = async (filePath) => {
  const issues = [];
  const source = await fs.readFile(filePath, 'utf8');
  const lines = source.split(/\r?\n/);
  const fenceMask = getFenceMask(lines);

  for (let index = 0; index < lines.length - 1; index += 1) {
    if (fenceMask[index] || fenceMask[index + 1]) {
      continue;
    }

    const headerLine = lines[index].trim();
    const delimiterLine = lines[index + 1].trim();

    if (!headerLine.startsWith('|') || !delimiterLine.startsWith('|')) {
      continue;
    }

    if (!isDelimiterRow(delimiterLine)) {
      continue;
    }

    const headerCells = splitRowCells(headerLine);
    const delimiterCells = splitRowCells(delimiterLine);

    if (!headerCells || !delimiterCells) {
      continue;
    }

    if (headerCells.length !== delimiterCells.length) {
      issues.push({
        line: index + 2,
        type: 'header-delimiter-mismatch',
        message: `header has ${headerCells.length} columns, delimiter has ${delimiterCells.length}`,
      });
    }

    let rowIndex = index + 2;

    while (rowIndex < lines.length && !fenceMask[rowIndex]) {
      const rowLine = lines[rowIndex].trim();

      if (!rowLine.startsWith('|')) {
        break;
      }

      if (isDelimiterRow(rowLine)) {
        break;
      }

      const rowCells = splitRowCells(rowLine);

      if (!rowCells) {
        break;
      }

      if (rowCells.length !== headerCells.length) {
        issues.push({
          line: rowIndex + 1,
          type: 'row-column-mismatch',
          message: `header has ${headerCells.length} columns, row has ${rowCells.length}`,
        });
      }

      rowIndex += 1;
    }

    index = rowIndex - 1;
  }

  return issues;
};

const run = async () => {
  let files;

  try {
    files = await walk(CONTENT_DIR);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to read content directory: ${message}`);
    process.exitCode = 1;
    return;
  }

  const allIssues = [];

  for (const filePath of files) {
    const issues = await checkFile(filePath);

    for (const issue of issues) {
      allIssues.push({
        file: normalizePath(filePath),
        ...issue,
      });
    }
  }

  if (allIssues.length > 0) {
    console.error('MDX table structure check failed:');

    for (const issue of allIssues) {
      console.error(`- ${issue.file}:${issue.line} [${issue.type}] ${issue.message}`);
    }

    process.exitCode = 1;
    return;
  }

  console.log(`MDX table structure check passed (${files.length} files).`);
};

await run();
