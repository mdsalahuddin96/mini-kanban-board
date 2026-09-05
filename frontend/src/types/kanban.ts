export interface Task {
  id: string;
  title: string;
  description?: string;
  order: number;
  columnId: string;
}

export interface Column {
  id: string;
  title: string;
  order: number;
  tasks: Task[];
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
}