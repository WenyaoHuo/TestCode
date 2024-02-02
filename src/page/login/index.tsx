import './index.css'

import React from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';

const Login: React.FC = () => {
  // Function called on successful form submission
  const onFinish = (values: any) => {
    console.log('Success:', values);

    // Retrieve users from local storage
    let usersStr = window.localStorage.getItem('users')
    let users = []
    if (usersStr) {
      users = JSON.parse(usersStr)
    }

    // Check if entered username and password match any user
    const target = users.find((u: any) => u.username === values.username && u.password === values.password)
    if (target) {
      // Set user information in local storage and redirect to home page
      window.localStorage.setItem('userInfo', JSON.stringify(target))
      window.location.href = '/#/'
    } else {
      // Display an error message for incorrect account or password
      message.error('Account or password error')
    }
  };

  // Function called on form submission failure
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // Function to redirect to the registration page
  const toReg = () => {
    window.location.href = '/#/register'
  }

  return (
    <div>
      {/* Login Form */}
      <h1>Login</h1>
      <Form
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >

        {/* Username Input */}
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
  
        </Form.Item>

        {/* Password Input */}
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        {/* Link to Registration Page */}
        <Form.Item name="reg">
          <Button type="link" onClick={toReg}>Register</Button>
        </Form.Item>

        {/* Login Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
