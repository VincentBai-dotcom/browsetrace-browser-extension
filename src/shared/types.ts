export type PageCapture = {
  url: string;
  domain: string;
  title: string;
  capturedAt: number;
  lang?: string;
  meta: Record<string, string | string[]>;
  schemaOrg?: unknown[];
  blocks: ContentBlock[];
};

export type ContentBlock = {
  blockId: string; // stable hash(text + sourcePath + pageUrl)
  pageUrl: string;
  sectionPath: string; // compact CSS path / outline path
  text: string;
  order: number; // visual/logical order on page
  bbox?: { x: number; y: number; w: number; h: number };
};
