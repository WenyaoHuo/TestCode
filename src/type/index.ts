export interface Task {
  id: string
  title: string
  description: string
  due_date: string
  priority_level: number // 3 high、2 medium、1 low
  status: number // 1 pending 2 completed
}

export interface TaskList {
  username: string
  tasks: Task[]
}

export interface User {
  username: string
  password: string
}
