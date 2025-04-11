 
export interface Project<T extends {populateColumns: boolean} = {populateColumns: false}> {
  _id: string,
  name: string,
  description: string,
  columns?: T['populateColumns'] extends true ? Column[] : string[],
  starred?: boolean,
  createdAt: Date,
  updatedAt: Date,
}

export interface Column<T extends {populateTasks: boolean} = {populateTasks: false}> {
  _id: string,
  name: string,
  description: string,
  color?: string,
  tasks?: T['populateTasks'] extends true ? Task[] : string[],
  deadline?: Date,
  createdAt: Date,
  updatedAt: Date,
}

export interface Task {
  _id: string,
  name: string,
  description: string,
  color?: string,
  isCompleted?: boolean,
  completedAt?: Date,
  deadline?: Date,
  createdAt: Date,
  updatedAt: Date,
}
