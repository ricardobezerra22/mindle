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

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  userId: string;
}
export interface Groups {
  id: string;
  name: string;
  color: string;
  tasks: Task[];
}
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: Date;
  color?: string;
  isFavorite: boolean;
  categoryId?: string;
  category?: TaskCategory;
  timeSpent: number;
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
  elapsed: number;
  focusContext?: string;
  date: Date;
  taskId?: string;
  task?: Task;
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

export interface Project {
  id: string;
  title: string;
  description?: string;
  archived: boolean;
  position: number;
  categoryId?: string;
  category?: TaskCategory;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  topics?: Topic[];
}

export interface Topic {
  id: string;
  title: string;
  content?: any;
  expanded: boolean;
  position: number;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  subtopics?: Subtopic[];
}

export interface Subtopic {
  id: string;
  title: string;
  content?: any;
  expanded: boolean;
  position: number;
  topicId: string;
  createdAt: Date;
  updatedAt: Date;
  tasks?: ProjectTask[];
}

export interface ProjectTask {
  id: string;
  title: string;
  done: boolean;
  position: number;
  subtopicId: string;
  createdAt: Date;
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
