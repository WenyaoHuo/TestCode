import './index.css'

import React, { useEffect, useState } from 'react';
import { Button, Select, Empty, Tag } from 'antd';
import { User, Task } from '../../type'
import TaskItem from '../../components/task-item';
import TaskFormModal from '../../components/task-form-modal';
import { getLocalTasks, setLocalTasks, updateLocalTasks, deleteLocalTasks, saveTaskSort } from './task-utils'
import {
  SwapOutlined
} from '@ant-design/icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

// Interface for filters (status and priority level) and sorting criteria
interface Filter {
  status: number
  priority_level: number
}

interface Sort {
  due_date: boolean
  priority_level: boolean
}

const { CheckableTag } = Tag;
let timeId: any = null

// Home component for rendering the main application page
const Home: React.FC = () => {
  const [userInfo, setUserInfo] = useState({} as User)
  const [tasks, setTasks] = useState([] as Task[])
  const [filterForm, setFilterForm] = useState({
    status: -1,
    priority_level: -1
  } as Filter)
  const [sortForm, setSortForm] = useState({
    due_date: false,
    priority_level: false
  } as Sort)
  const [dropMode, setDropMode] = useState(false)

  // useEffect to initialize user info and tasks when component mounts
  useEffect(() => {
    const ui = window.localStorage.getItem('userInfo')
    if (ui) {
      const uInfo: User = JSON.parse(ui)
      setUserInfo(uInfo)
      setTasks(getLocalTasks(uInfo.username))
      checkTasks(uInfo)
    } else {
      window.location.href = '/#/login'
    }
  }, [])

  // Function to check for tasks that are about to expire or have already expired
  const checkTasks = (uInfo: User) => {
    timeId && clearTimeout(timeId)
    timeId = setTimeout(() => {
      const list = getLocalTasks(uInfo.username)
      const newList = list.filter((item: Task) => {
        const b1 = +new Date() >= +new Date(item.due_date)
        const b2 = (+new Date(item.due_date) - +new Date()) <= 86400000
        return item.status === 1 && (b1 || b2)
      })
      if (newList.length) {
        alert('There are tasks that are about to expire or have already expired, please handle them promptly')
      }
    }, 1000);
  }

  // Function to fetch and update tasks
  const getTasks = () => {
    setTasks(getLocalTasks(userInfo.username))
    filterList(null)
  }

  // Function to handle user logout
  const handleLogout = () => {
    window.localStorage.removeItem('userInfo')
    window.location.href = '/#/login'
  }

  // State and functions related to the task modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState({} as Task | undefined);

  const handleOpenNewTaskModal = () => {
    setCurrentTask(undefined);
    setIsModalVisible(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsModalVisible(true);
  };

  const handleDelete = (task: Task) => {
    deleteLocalTasks(userInfo.username, task)
    getTasks()
  }

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSubmitTask = (task: Task) => {
    if (task.id) { // edit
      task.status = 1
      updateLocalTasks(userInfo.username, task)
    } else { // add new
      task.id = Math.random().toString(36).substr(2, 9)
      task.status = 1
      setLocalTasks(userInfo.username, task)
    }

    getTasks()
    setIsModalVisible(false);
  };

  // Functions to handle filter and sort changes
  const changeFilter = (e: any, name: string) => {
    const newFilter: Filter = { ...filterForm }
    if (name === 'status') {
      newFilter.status = e
    } else if (name === 'priority_level') {
      newFilter.priority_level = e
    }
    setFilterForm(newFilter)
    filterList(newFilter)
  }

  const changeSort = (e: any, name: string) => {
    const newSort: Sort = { ...sortForm }
    if (name === 'due_date') {
      newSort.due_date = e
    } else if (name === 'priority_level') {
      newSort.priority_level = e
    }
    setSortForm(newSort)
    sortList(newSort)
  }

  // Functions to filter and sort the task list
  const filterList = (newFilter: Filter | null) => {
    newFilter = newFilter || filterForm

    let list = getLocalTasks(userInfo.username)
    if (newFilter.status !== -1) {
      list = list.filter(item => item.status === newFilter?.status)
    }
    if (newFilter.priority_level !== -1) {
      list = list.filter(item => item.priority_level === newFilter?.priority_level)
    }

    setTasks(list)
  }

  const sortList = (newSort: Sort | null) => {
    newSort = newSort || sortForm

    let list = getLocalTasks(userInfo.username)

    list.sort((a: Task, b: Task) => {
      if (newSort?.due_date) {
        return +new Date(a.due_date) - +new Date(b.due_date)
      } else {
        return +new Date(a.due_date) + +new Date(b.due_date)
      }
    })

    list.sort((a: Task, b: Task) => {
      if (newSort?.priority_level) {
        return a.priority_level - b.priority_level
      } else {
        return a.priority_level + b.priority_level
      }
    })

    setTasks(list)
  }

  // Function to handle task completion
  const handleDone = (task: Task) => {
    task.status = 2
    updateLocalTasks(userInfo.username, task)
    getTasks()
  }

  // DnD (Drag and Drop) functionality setup
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Function to handle the end of a drag and drop operation
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        const list = arrayMove(items, oldIndex, newIndex);
        saveTaskSort(userInfo.username, list)
        return list
      });
    }
  };

  return (
    <div>
      {/* Header Section */}
      <h1 style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 12 }}>Hi, {userInfo.username}</span>
        <Button onClick={handleLogout}>Logout</Button>
      </h1>

      <div>
        {/* Button Section */}
        <Button onClick={handleOpenNewTaskModal}>Create New Task</Button>
        <Button onClick={() => { setDropMode(!dropMode) }}>{!dropMode ? 'Enable' : 'Disable'} drag and drop</Button>
        
        {/* Filter Section */}
        <div className='filter'>
          <label htmlFor="">Status:&nbsp;</label>
          <Select value={filterForm.status} style={{ width: 100 }} onChange={(e) => { changeFilter(e, 'status') }}>
            <Select.Option value={-1}>All</Select.Option>
            <Select.Option value={1}>Pending</Select.Option>
            <Select.Option value={2}>Completed</Select.Option>
          </Select>
          <label htmlFor="" style={{ marginLeft: 16 }}>Priority Level:&nbsp;</label>
          <Select value={filterForm.priority_level} style={{ width: 100 }} onChange={(e) => { changeFilter(e, 'priority_level') }}>
            <Select.Option value={-1}>All</Select.Option>
            <Select.Option value={3}>High</Select.Option>
            <Select.Option value={2}>Medium</Select.Option>
            <Select.Option value={1}>Low</Select.Option>
          </Select>
        </div>

        {/* Sort Section */}
        <div className='sort'>
          <CheckableTag
            checked={sortForm.due_date}
            onChange={(e) => { changeSort(e, 'due_date') }}
          >
            Due Date
            <SwapOutlined style={{ transform: 'rotate(90deg)' }} />
          </CheckableTag>
          <CheckableTag
            checked={sortForm.priority_level}
            onChange={(e) => { changeSort(e, 'priority_level') }}
          >
            Priority Level
            <SwapOutlined style={{ transform: 'rotate(90deg)' }} />
          </CheckableTag>
        </div>

        {/* Task Display Section */}
        {
          tasks.length ?
            <>
              {// Drag and Drop Context
                dropMode ? <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={tasks.map(item => item.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map(item => <TaskItem key={item.id} task={item} onEdit={handleEditTask} onDelete={handleDelete} onDone={handleDone} dropMode={true} />)}
                  </SortableContext>
                </DndContext> : tasks.map(item => <TaskItem key={item.id} task={item} onEdit={handleEditTask} onDelete={handleDelete} onDone={handleDone} dropMode={false} />)
              }
            </>
            : <Empty style={{ marginTop: 16 }} />
        }
        <TaskFormModal
          visible={isModalVisible}
          onClose={handleCloseModal}
          onSubmit={handleSubmitTask}
          task={currentTask}
        />
      </div>
    </div>
  );
};

export default Home;
