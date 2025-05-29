import React, { useState } from 'react';
import { Table, Tag, Button, Modal, Card, Typography, Badge, message } from 'antd';
import { FilterOutlined, EyeOutlined, SyncOutlined } from '@ant-design/icons';
import './AdminOrder.css'; 
import AdminHeader from '../../components/header/AdminHeader';
import OrderFilter from './OrderFilter';

const { Title, Text } = Typography;

const AdminOrder = () => {
  const [orders, setOrders] = useState([
    {
      key: '1',
      orderId: 'ORD-2023-001',
      customer: 'John Doe',
      date: '2023-10-15',
      items: 3,
      total: 4299000, // Rp 4,299,000
      status: 'Processing',
      address: '123 Main St, New York, NY',
    },
    {
      key: '2',
      orderId: 'ORD-2023-002',
      customer: 'Jane Smith',
      date: '2023-10-16',
      items: 5,
      total: 8750000, // Rp 8,750,000
      status: 'Shipped',
      address: '456 Park Ave, Boston, MA',
    },
    {
      key: '3',
      orderId: 'ORD-2023-003',
      customer: 'Robert Johnson',
      date: '2023-10-17',
      items: 2,
      total: 2499000, // Rp 2,499,000
      status: 'Delivered',
      address: '789 Oak St, Chicago, IL',
    },
    {
      key: '4',
      orderId: 'ORD-2023-004',
      customer: 'Emily Davis',
      date: '2023-10-18',
      items: 4,
      total: 6575000, // Rp 6,575,000
      status: 'Pending',
      address: '321 Pine Rd, Seattle, WA',
    },
  ]);

  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusColors = {
    Processing: 'blue',
    Shipped: 'geekblue',
    Delivered: 'green',
    Pending: 'orange',
    Cancelled: 'red',
  };

  const handleFilterChange = (selectedStatuses) => {
    if (selectedStatuses.length === 0) {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => selectedStatuses.includes(order.status));
      setFilteredOrders(filtered);
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 150,
      fixed: 'left',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      width: 150,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      width: 100,
      render: (items) => `${items} items`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      render: (total) => `Rp ${total.toLocaleString('id-ID')}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          Details
        </Button>
      ),
    },
  ];

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleUpdateStatus = () => {
    Modal.confirm({
      title: 'Update Order Status',
      content: 'Select the new status for this order:',
      okText: 'Update',
      onOk() {
        message.success('Order status updated successfully');
        setIsModalVisible(false);
      },
    });
  };

  return (
    <div className="admin-dashboard-container">
      <AdminHeader />

      <div className="dashboard-content">
        <Card className="dashboard-header-card">
          <div className="dashboard-header">
            <div>
              <Title level={2} className="dashboard-title">Order Management</Title>
              <Text type="secondary">Monitor and manage customer orders</Text>
            </div>
            <div className="action-buttons">
              <Button
                type="primary"
                icon={<SyncOutlined />}
                size="large"
              >
                Refresh Orders
              </Button>
              <OrderFilter onFilterChange={handleFilterChange} />
            </div>
          </div>
        </Card>

        <Card className="products-card">
          <div className="section-header">
            <h2 className="section-title">
              <span>Ongoing Orders</span>
              <Badge
                count={filteredOrders.length}
                style={{ backgroundColor: '#1890ff' }}
              />
            </h2>
          </div>
          <div className="products-table-container">
            <Table
              className="orders-table"
              columns={columns}
              dataSource={filteredOrders}
              scroll={{ x: 1000, y: 'calc(100vh - 350px)' }}
              pagination={{ pageSize: 10 }}
              bordered
            />
          </div>
        </Card>
      </div>

      <Modal
        title={`Order Details: ${selectedOrder?.orderId}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="update"
            type="primary"
            onClick={handleUpdateStatus}
          >
            Update Status
          </Button>,
        ]}
      >
        {selectedOrder && (
          <div className="order-details">
            <div className="order-section">
              <Title level={4} className="section-title">Customer Information</Title>
              <div className="info-grid">
                <div>
                  <Text strong>Name:</Text> {selectedOrder.customer}
                </div>
                <div>
                  <Text strong>Shipping Address:</Text> {selectedOrder.address}
                </div>
                <div>
                  <Text strong>Order Date:</Text> {selectedOrder.date}
                </div>
                <div>
                  <Text strong>Status:</Text>
                  <Tag color={statusColors[selectedOrder.status]} style={{ marginLeft: 8 }}>
                    {selectedOrder.status}
                  </Tag>
                </div>
              </div>
            </div>

            <div className="order-section">
              <Title level={4} className="section-title">Order Items</Title>
              <Table
                dataSource={[
                  { id: 1, product: 'Cotton T-Shirt', size: 'M', price: 149900, quantity: 2, total: 299800 },
                  { id: 2, product: 'Classic Jeans', size: '32', price: 299900, quantity: 1, total: 299900 },
                ]}
                pagination={false}
              >
                <Table.Column title="Product" dataIndex="product" key="product" />
                <Table.Column title="Size" dataIndex="size" key="size" />
                <Table.Column title="Price" dataIndex="price" key="price" render={price => `Rp ${price.toLocaleString('id-ID')}`} />
                <Table.Column title="Qty" dataIndex="quantity" key="quantity" />
                <Table.Column title="Total" dataIndex="total" key="total" render={total => `Rp ${total.toLocaleString('id-ID')}`} />
              </Table>
            </div>

            <div className="order-totals">
              <div className="total-row">
                <Text>Subtotal:</Text>
                <Text>Rp 220.000</Text>
              </div>
              <div className="total-row">
                <Text>Shipping:</Text>
                <Text>Rp 125.000</Text>
              </div>
              <div className="total-row">
                <Text strong>Grand Total:</Text>
                <Text strong>{`Rp ${selectedOrder.total.toLocaleString('id-ID')}`}</Text>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrder;
