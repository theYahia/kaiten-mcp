export interface KaitenCard {
  id: number;
  title: string;
  description?: string;
  column_id?: number;
  board_id?: number;
  owner?: { id: number; full_name: string };
  members?: Array<{ id: number; full_name: string }>;
  tags?: Array<{ id: number; name: string }>;
  state?: number;
  created?: string;
  updated?: string;
  sort_order?: number;
  lane_id?: number;
}

export interface KaitenBoard {
  id: number;
  title: string;
  description?: string;
  columns?: Array<{ id: number; title: string; sort_order?: number }>;
}

export interface KaitenColumn {
  id: number;
  title: string;
  board_id: number;
  sort_order?: number;
  type?: number;
}

export interface KaitenTag {
  id: number;
  name: string;
  color?: string;
}

export interface KaitenUser {
  id: number;
  full_name: string;
  email?: string;
  username?: string;
}

export interface KaitenSpace {
  id: number;
  title: string;
  description?: string;
  boards?: KaitenBoard[];
}
