import React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import dayLocaleData from 'dayjs/plugin/localeData';
import { Button, Calendar, List, Col, Radio, Row, Select, Typography, theme } from 'antd';
import { Link } from 'react-router-dom';
import './EventManagementClient.css';

dayjs.extend(dayLocaleData);
dayjs.locale('en');

const App = () => {
  const { token } = theme.useToken();

  const events = [
    { date: '2023-12-01', title: 'Event 1' },
    { date: '2023-12-05', title: 'Event 2' },
    // Add more events as needed
  ];

  const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  const dateFullCellRender = (value) => {
    const day = value.date();

    return (
      <Link to={`/ViewEventClient`}>
        <Button
          type="text"
          style={{ width: '70%', height: '100%', textAlign: 'center', margin: '0', padding: '0' }}
          onClick={() => console.log(`Clicked on ${value.format('YYYY-MM-DD')}`)}
        >
          {day}
        </Button>
      </Link>
    );
  };


  const listStyle = {
    width: '40%', // Adjust the width of the list
  };

  return (
    <div className="wrapper">
      <Calendar
        fullscreen={false}
        className='calendar'
        headerRender={({ value, type, onChange, onTypeChange }) => {
          const start = 0;
          const end = 12;
          const monthOptions = [];
          let current = value.clone();
          const localeData = value.localeData();
          const months = [];
          for (let i = 0; i < 12; i++) {
            current = current.month(i);
            months.push(localeData.monthsShort(current));
          }
          for (let i = start; i < end; i++) {
            monthOptions.push(
              <Select.Option key={i} value={i} className="month-item">
                {months[i]}
              </Select.Option>,
            );
          }
          const year = value.year();
          const month = value.month();
          const options = [];
          for (let i = year - 10; i < year + 10; i += 1) {
            options.push(
              <Select.Option key={i} value={i} className="year-item">
                {i}
              </Select.Option>,
            );
          }
          return (
            <div
              style={{
                padding: 8,
              }}
            >
              <Typography.Title level={4}>My Events</Typography.Title>
              <Row gutter={8}>
                <Col>
                  <Radio.Group
                    size="small"
                    onChange={(e) => onTypeChange(e.target.value)}
                    value={type}
                  >
                    <Radio.Button value="month">Month</Radio.Button>
                    <Radio.Button value="year">Year</Radio.Button>
                  </Radio.Group>
                </Col>
                <Col>
                  <Select
                    size="small"
                    dropdownMatchSelectWidth={false}
                    className="my-year-select"
                    value={year}
                    onChange={(newYear) => {
                      const now = value.clone().year(newYear);
                      onChange(now);
                    }}
                  >
                    {options}
                  </Select>
                </Col>
                <Col>
                  <Select
                    size="small"
                    dropdownMatchSelectWidth={false}
                    value={month}
                    onChange={(newMonth) => {
                      const now = value.clone().month(newMonth);
                      onChange(now);
                    }}
                  >
                    {monthOptions}
                  </Select>
                </Col>
              </Row>
            </div>
          );
        }}
        onPanelChange={onPanelChange}
        dateFullCellRender={dateFullCellRender}
      />
      <h2 className="list-header">List of Events:</h2>
      <List
        className="list"
        dataSource={events}
        renderItem={(item) => (
          <List.Item>
            {dayjs(item.date).format('YYYY-MM-DD')}: {item.title}
          </List.Item>
        )}
      />
    </div>
  );
};

export default App;
