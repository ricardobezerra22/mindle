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

export enum Mood {
  HAPPY = "HAPPY",
  CALMLY = "CALMLY",
  OK = "OK",
  SAD = "SAD",
  TIRED = "TIRED",
  OVERWHELMED = "OVERWHELMED",
}

export enum EnergyLevel {
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
  position: number;
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
  position: number;
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
  weeklyGoal: number;
  position: number;
  createdAt: Date;
  userId: string;
  logs?: HabitLog[];
}

export interface DailyMood {
  id: string;
  date: Date;
  mood: Mood;
  energy?: EnergyLevel;
  createdAt: Date;
  userId: string;
}

export interface HabitLog {
  id: string;
  date: Date;
  done: boolean;
  habitId: string;
  userId: string;
}

export enum GoalStatus {
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  color?: string;
  status: GoalStatus;
  deadline?: Date;
  position: number;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  projects?: Project[];
}

export interface GoalWithProgress extends Goal {
  progress: number;
  totalTasks: number;
  completedTasks: number;
  projectCount: number;
  clarityScore: number;
  lastActivity?: Date;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  archived: boolean;
  archivedAt?: Date;
  position: number;
  weight: number;
  categoryId?: string;
  category?: TaskCategory;
  goalId?: string;
  goal?: Goal;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  topics?: Topic[];
  tasks?: ProjectTask[];
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
  tasks?: ProjectTask[];
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
  projectId?: string;
  topicId?: string;
  subtopicId?: string;
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
