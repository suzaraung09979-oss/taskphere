// src/types/task.ts
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: Priority;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  created_at?: string;
  updated_at?: string;
}