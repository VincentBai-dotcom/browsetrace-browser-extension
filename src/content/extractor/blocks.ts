// Internal type used during extraction before postprocess()
export type RawBlock = {
  node: Element;
  sectionPath: string;
  text: string;
  orderHint: number;
};
