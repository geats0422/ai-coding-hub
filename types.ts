import React from 'react';

export interface DocSection {
  id: string;
  title: string;
  content?: React.ReactNode;
}

export interface LocalizedToolDocs {
  name: string;
  description: string;
  sections: DocSection[];
}

export interface ToolDocs {
  id: string;
  icon: React.ReactNode;
  en: LocalizedToolDocs;
  zh: LocalizedToolDocs;
}