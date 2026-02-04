export enum TaskStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: Date;
  color?: string;
  createdAt: Date;
  userId: string;
  subTasks?: SubTask[];
}

export interface SubTask {
  id: string;
  title: string;
  done: boolean;
  taskId: string;
}

export interface PlannerEntry {
  id: string;
  date: Date;
  taskId: string;
  task?: Task;
  userId: string;
}

export interface FocusSession {
  id: string;
  duration: number;
  date: Date;
  userId: string;
}

export interface Habit {
  id: string;
  title: string;
  icon?: string;
  createdAt: Date;
  userId: string;
  logs?: HabitLog[];
}

export interface HabitLog {
  id: string;
  date: Date;
  done: boolean;
  habitId: string;
  userId: string;
}

export interface FinanceEntry {
  id: string;
  title: string;
  category?: string;
  amount: number;
  paid: boolean;
  date: Date;
  userId: string;
}
