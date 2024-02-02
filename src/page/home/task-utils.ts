import { Task, TaskList } from '../../type'

// Function to get tasks for a specific user from local storage
export const getLocalTasks = (username: string) => {
  const tasksStr = window.localStorage.getItem('tasks')
  let taskList = []
  if (tasksStr) {
    taskList = JSON.parse(tasksStr)
  }
  const target: TaskList = taskList.find((item: TaskList) => item.username === username)
  return target ? target.tasks : []
}

// Function to set a new task in local storage for a specific user
export const setLocalTasks = (username: string, task: Task) => {
  const tasksStr = window.localStorage.getItem('tasks')
  let taskList: TaskList[] = []
  if (tasksStr) {
    taskList = JSON.parse(tasksStr)
  }
  const index = taskList.findIndex((item: TaskList) => item.username === username)
  if (index === -1) {
    taskList.push({
      username,
      tasks: [task]
    })
  } else {
    taskList[index].tasks.push(task)
  }
  window.localStorage.setItem('tasks', JSON.stringify(taskList))
}

// Function to update an existing task in local storage for a specific user
export const updateLocalTasks = (username: string, task: Task) => {
  const tasksStr = window.localStorage.getItem('tasks')
  let taskList: TaskList[] = []
  if (tasksStr) {
    taskList = JSON.parse(tasksStr)
  }
  const index = taskList.findIndex((item: TaskList) => item.username === username)
  if (index !== -1) {
    const ts = taskList[index].tasks
    const ind = ts.findIndex((item: Task) => item.id === task.id)
    if (ind !== -1) {
      taskList[index].tasks[ind] = task
    }
  }
  window.localStorage.setItem('tasks', JSON.stringify(taskList))
}

// Function to delete a task from local storage for a specific user
export const deleteLocalTasks = (username: string, task: Task) => {
  const tasksStr = window.localStorage.getItem('tasks')
  let taskList: TaskList[] = []
  if (tasksStr) {
    taskList = JSON.parse(tasksStr)
  }
  const index = taskList.findIndex((item: TaskList) => item.username === username)
  if (index !== -1) {
    const ts = taskList[index].tasks
    const ind = ts.findIndex((item: Task) => item.id === task.id)
    if (ind !== -1) {
      taskList[index].tasks.splice(ind, 1)
    }
  }
  window.localStorage.setItem('tasks', JSON.stringify(taskList))
}

// Function to save the order of tasks after a drag and drop operation
export const saveTaskSort = (username: string, tasks: Task[]) => {
  const tasksStr = window.localStorage.getItem('tasks')
  let taskList: TaskList[] = []
  if (tasksStr) {
    taskList = JSON.parse(tasksStr)
  }
  const index = taskList.findIndex((item: TaskList) => item.username === username)
  if (index !== -1) {
    taskList[index].tasks = tasks
  }
  window.localStorage.setItem('tasks', JSON.stringify(taskList))
}