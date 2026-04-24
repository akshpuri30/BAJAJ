export interface InputData {
  inputArr: string[];
}

export interface ApiResponse {
  user_id: string;
  email_id: string;
  college_roll_number: string;
  invalidList: string[];
  duplicateList: string[];
  trees: HierarchyGroup[];
  stats: SummaryData;
}

export interface HierarchyGroup {
  root: string;
  tree: Record<string, any>;
  has_cycle?: boolean;
  depth?: number;
}

export interface SummaryData {
  total_trees: number;
  total_cycles: number;
  largest_tree_root: string | null;
}
