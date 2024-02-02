import './index.css'

import React from 'react';
import { Form, Input, Button } from 'antd';

const Register: React.FC = () => {
  // Function called on successful form submission
  const onFinish = (values: any) => {
    console.log('Success:', values);

    // Retrieve users from local storage
    let usersStr = window.localStorage.getItem('users')
    let users = []
    if (usersStr) {
      users = JSON.parse(usersStr)
    }

    // Create user data object from form values
    const userData = {
      username: values.username,
      password: values.password
    }

    // Add the new user to the list of users
    users.push(userData)

    // Update users in local storage
    window.localStorage.setItem('users', JSON.stringify(users))

    // Set user information in local storage and redirect to home page
    window.localStorage.setItem('userInfo', JSON.stringify(userData))
    window.location.href = '/#/'
  };

  // Function called on form submission failure
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // Function to redirect to the login page
  const toLogin = () => {
    window.location.href = '/#/login'
  }

  return (
    <div>
      <h1>Register</h1>

      {/* Registration Form */}
      <Form
        name="register"
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

        {/* Confirm Password Input */}
        <Form.Item
          label="Confirm Password"
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords that you entered do not match!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

         {/* Link to Login Page */}
        <Form.Item name="reg">
          <Button type="link" onClick={toLogin}>Login</Button>
        </Form.Item>

        {/* Register Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
