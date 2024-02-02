import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button } from 'antd';
import moment from 'moment';
import { Task } from '../../type'

// Interface to define the props expected by TaskFormModal component
interface TaskFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
  task?: Task; // The current edited task, if not, is to create a new task
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ visible, onClose, onSubmit, task }) => {
  // Form hook for managing form state
  const [form] = Form.useForm();

  // Effect to update form fields when task prop changes
  useEffect(() => {
    if (task) {
      // If task is provided, set form fields with task details
      form.setFieldsValue({
        ...task,
        due_date: moment(task.due_date),
      });
    } else {
      // If no task, reset form fields
      form.resetFields();
    }
  }, [task, form]);

  // Handle form submission
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // Format due_date before submitting
      onSubmit({
        ...values,
        id: task?.id,
        due_date: values.due_date.format('YYYY-MM-DD'),
      });
      onClose();
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  // Render the modal with form
  return (
    <Modal title={task ? 'Edit Task' : 'Create Task'} visible={visible} onOk={handleOk} onCancel={onClose} footer={[
      <Button key="back" onClick={onClose}>
        Cancel
      </Button>,
      <Button key="submit" type="primary" onClick={handleOk}>
        Submit
      </Button>,
    ]}>
      <Form form={form} layout="vertical" initialValues={{ priority_level: 2, status: 1 }}>
        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the title!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the description!' }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="due_date" label="Due Date" rules={[{ required: true, message: 'Please select the due date!' }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item name="priority_level" label="Priority Level" rules={[{ required: true, message: 'Please select the priority level!' }]}>
          <Select>
            <Select.Option value={3}>High</Select.Option>
            <Select.Option value={2}>Medium</Select.Option>
            <Select.Option value={1}>Low</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskFormModal;
