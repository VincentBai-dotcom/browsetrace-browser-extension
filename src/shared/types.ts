export type EventType =
  | "navigate"
  | "visible_text"
  | "click"
  | "input"
  | "scroll"
  | "focus";
export type EventPayload = {
  ts_utc: number;
  ts_iso: string;
  url: string;
  title: string | null;
  type: EventType;
  data: Record<string, unknown>;
};
