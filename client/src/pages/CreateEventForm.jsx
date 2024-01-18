import React from 'react';
import './CreateEventForm.css';
import { Button, DatePicker, Form, Input, Mentions, Select, message, TimePicker } from 'antd';

const { RangePicker } = TimePicker;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 9,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
};

/*
const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'This is a success message',
    });
  };
  */

const App = () => (
  
  <Form className='container custom-form'
    {...formItemLayout}
    variant="filled"
  >
    <h1 className='header'>
        Create New Event
    </h1>
    <Form.Item
      label="Event Name"
      name="Mentions"
      rules={[
        {
          required: true,
          message: 'Please input!',
        },
      ]}
    >
      <Mentions />
    </Form.Item>

    <Form.Item
      label="Event Description"
      name="TextArea"
      rules={[
        {
          required: true,
          message: 'Please input!',
        },
      ]}
    >
      <Input.TextArea />
    </Form.Item>

    <Form.Item
      label="Staff"
      name="Select"
      rules={[
        {
          required: true,
          message: 'Please input!',
        },
      ]}
    >
      <Select />
    </Form.Item>

    <Form.Item
      label="Client"
      name="Select"
      rules={[
        {
          required: true,
          message: 'Please input!',
        },
      ]}
    >
      <Select />
    </Form.Item>

    <Form.Item
      label="Event Date"
      name="DatePicker"
      rules={[
        {
          required: true,
          message: 'Please input!',
        },
      ]}
    >
      <DatePicker />
    </Form.Item>

    <Form.Item
      label="Event Time"
      name="RangePicker"
      rules={[
        {
          required: true,
          message: 'Please input!',
        },
      ]}
    >
      <RangePicker />
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 1,
        span: 21,
      }}
    >
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
);
export default App;