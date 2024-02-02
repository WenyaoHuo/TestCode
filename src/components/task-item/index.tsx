import './index.css'

import React from 'react';
import { Tag, Popconfirm } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { Task } from '../../type'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Props interface for TaskItem component
interface Props {
  task: Task,
  onEdit: any
  onDelete: any
  onDone: any
  dropMode: boolean
}

// TaskItem component for rendering individual tasks
const TaskItem: React.FC<Props> = ({ task, onEdit, onDelete, onDone, dropMode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  // Styling for drag and drop animation
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="c-task-item" ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div style={{ display: 'flex' }}>
        <div className="ll">
          <div className="title">
            <span style={{ marginRight: 16 }}>{task.title}</span>
            {
              task.status === 1 ? <Tag color="#2db7f5">Pending</Tag> : <></>
            }
            {
              task.status === 2 ? <Tag color="#87d068">Completed</Tag> : <></>
            }
          </div>
          <div className="address">{task.description}</div>
          <div className="address">{task.due_date}</div>
        </div>
      </div>
      {/* Priority level tags */}
      <div className="tag-wrap">
        {
          task.priority_level === 3 ? <Tag color="error">High</Tag> : <></>
        }
        {
          task.priority_level === 2 ? <Tag color="warning">Medium</Tag> : <></>
        }
        {
          task.priority_level === 1 ? <Tag color="processing">Low</Tag> : <></>
        }
      </div>

      {/* Action icons for task (Edit, Delete, Complete) */}
      {
        dropMode ? <></> : <div className='icon-wrap'>
          {
            task.status === 1 ? <Popconfirm
              title="Complete the task"
              description="Are you sure to Complete this task?"
              onConfirm={() => { onDone(task) }}
              onCancel={() => { }}
              okText="Yes"
              cancelText="No"
            >
              <CheckCircleOutlined style={{ cursor: 'pointer' }} />
            </Popconfirm> : <></>
          }
          {/* Edit task icon */}
          {
            task.status === 1 ? <EditOutlined style={{ margin: '0 12px', cursor: 'pointer' }} onClick={() => {
              onEdit(task)
            }} /> : <></>
          }
          {/* Delete task icon */}
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => { onDelete(task) }}
            onCancel={() => { }}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ cursor: 'pointer' }} />
          </Popconfirm>
        </div>
      }

    </div>
  );
};

export default TaskItem;
