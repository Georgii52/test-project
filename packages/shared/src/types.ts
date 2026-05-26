export interface Role {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  role: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  doneAt: Date | null;
  workType: string;
  workAmount: number;
  workAmountUnit: string;
  executor: User;
  status: string;
}

export interface TasksResponse {
  data: Task[];
  totalPages: number;
}
