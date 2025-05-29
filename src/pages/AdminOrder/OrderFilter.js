import React, { useState } from 'react';
import { Button, Modal, Tag, Checkbox, Space, Divider } from 'antd';
import { FilterOutlined, CloseOutlined } from '@ant-design/icons';

const OrderFilter = ({ onFilterChange }) => {
  const [visible, setVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState([]);

  const statusOptions = [
    { value: 'Processing', label: 'Processing', color: 'blue' },
    { value: 'Shipped', label: 'Shipped', color: 'geekblue' },
    { value: 'Delivered', label: 'Delivered', color: 'green' },
    { value: 'Pending', label: 'Pending', color: 'orange' },
    { value: 'Cancelled', label: 'Cancelled', color: 'red' },
  ];

  const handleStatusChange = (status, checked) => {
    if (checked) {
      setSelectedStatus([...selectedStatus, status]);
    } else {
      setSelectedStatus(selectedStatus.filter(s => s !== status));
    }
  };

  const applyFilters = () => {
    onFilterChange(selectedStatus);
    setVisible(false);
  };

  const clearFilters = () => {
    setSelectedStatus([]);
    onFilterChange([]);
  };

  return (
    <>
      <Button 
        icon={<FilterOutlined />} 
        onClick={() => setVisible(true)}
        size="large"
      >
        Filters
        {selectedStatus.length > 0 && (
          <span className="filter-badge">{selectedStatus.length}</span>
        )}
      </Button>

      <Modal
        title="Filter Orders"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="clear" onClick={clearFilters} icon={<CloseOutlined />}>
            Clear All
          </Button>,
          <Button key="apply" type="primary" onClick={applyFilters}>
            Apply Filters
          </Button>,
        ]}
        width={400}
      >
        <Divider orientation="left">Order Status</Divider>
        <Space direction="vertical" style={{ width: '100%' }}>
          {statusOptions.map(option => (
            <div key={option.value}>
              <Checkbox
                checked={selectedStatus.includes(option.value)}
                onChange={(e) => handleStatusChange(option.value, e.target.checked)}
              >
                <Tag color={option.color}>{option.label}</Tag>
              </Checkbox>
            </div>
          ))}
        </Space>
      </Modal>
    </>
  );
};

export default OrderFilter;