export interface KaitenCard {
  id: number;
  title: string;
  description?: string;
  column_id?: number;
  board_id?: number;
  owner?: { id: number; full_name: string };
  members?: Array<{ id: number; full_name: string }>;
  state?: number;
  created?: string;
  updated?: string;
}

export interface KaitenBoard {
  id: number;
  title: string;
  description?: string;
  columns?: Array<{ id: number; title: string }>;
}
