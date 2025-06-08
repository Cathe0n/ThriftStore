import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Card, Typography, Badge, message, Spin } from 'antd';
import { FilterOutlined, EyeOutlined, SyncOutlined } from '@ant-design/icons';
import './AdminOrder.css'; 
import AdminHeader from '../../components/header/AdminHeader';
import OrderFilter from './OrderFilter';
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { GET_ALL_ORDERS } from '../../graphql/adminMutations';
import { GET_PRODUCT_BY_ID } from '../../graphql/mutations';
const { Title, Text } = Typography;

const AdminOrder = () => {
  const { data, loading, error } = useQuery(GET_ALL_ORDERS);
  const [getProductById, { loading: productLoading }] = useLazyQuery(GET_PRODUCT_BY_ID);
  
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [productDetailsMap, setProductDetailsMap] = useState({});
  const [loadingProductDetails, setLoadingProductDetails] = useState(false);

  // Fetch product details for a specific product ID
  const fetchProductDetails = async (productId) => {
    if (productDetailsMap[productId]) {
      return productDetailsMap[productId];
    }

    try {
      const { data: productData } = await getProductById({
        variables: { id: productId }
      });
      
      if (productData?.getProductbyId) {
        const productDetails = productData.getProductbyId;
        setProductDetailsMap(prev => ({
          ...prev,
          [productId]: productDetails
        }));
        return productDetails;
      }
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      message.error(`Failed to fetch product details for ID: ${productId}`);
    }
    return null;
  };

  // Fetch all product details for orders
  const fetchAllProductDetails = async (ordersData) => {
    const productIds = [...new Set(ordersData.map(order => order.product_id).filter(Boolean))];
    
    if (productIds.length === 0) return;

    setLoadingProductDetails(true);
    
    try {
      const productPromises = productIds.map(async (productId) => {
        if (!productDetailsMap[productId]) {
          return await fetchProductDetails(productId);
        }
        return productDetailsMap[productId];
      });

      await Promise.all(productPromises);
    } catch (error) {
      console.error('Error fetching product details:', error);
      message.error('Failed to fetch some product details');
    } finally {
      setLoadingProductDetails(false);
    }
  };

  useEffect(() => {
    if (data?.getAllorders) {
      const formattedOrders = data.getAllorders.map((order, index) => ({
        key: order.id || index,
        orderId: order.id || `ORD-${index + 1}`,
        customer: order.customer_name || order.customer_id || 'Unknown Customer',
        date: order.order_date || order.created_at || new Date().toLocaleDateString('id-ID'),
        items: order.quantity || 1,
        total: order.total_price || 0,
        status: order.status || 'Pending',
        address: order.location || 'No address provided',
        // Keep original data for reference
        product_id: order.product_id,
        customer_id: order.customer_id,
        quantity: order.quantity,
        total_price: order.total_price,
        size_type: order.size_type,
        // Add any other fields from your GraphQL response
        ...order
      }));
      
      setOrders(formattedOrders);
      setFilteredOrders(formattedOrders);
      
      // Fetch product details for all orders
      fetchAllProductDetails(formattedOrders);
    }
  }, [data]);

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
      title: 'Product',
      key: 'product',
      width: 200,
      render: (_, record) => {
        const product = productDetailsMap[record.product_id];
        if (loadingProductDetails && !product) {
          return <Spin size="small" />;
        }
        return product ? product.product_name : 'Loading...';
      },
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      width: 150,
    },
    {
      title: 'Product',
      key: 'product',
      width: 200,
      render: (_, record) => {
        const product = productDetailsMap[record.product_id];
        if (loadingProductDetails && !product) {
          return <Spin size="small" />;
        }
        return product ? product.product_name : 'Loading...';
      },
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

  const handleViewDetails = async (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
    
    // Fetch product details if not already loaded
    if (order.product_id && !productDetailsMap[order.product_id]) {
      await fetchProductDetails(order.product_id);
    }
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

  const handleRefreshOrders = () => {
    // Clear product details cache and refetch
    setProductDetailsMap({});
    // You might want to refetch the orders query here
    message.success('Orders refreshed successfully');
  };

  // Prepare order items for the modal table
  const getOrderItems = (order) => {
    const product = productDetailsMap[order.product_id];
    
    if (!product) {
      return [{
        id: order.product_id || 1,
        product_name: 'Loading...',
        size_type: order.size_type || 'N/A',
        price: order.total_price || 0,
        quantity: order.quantity || 1,
        total_price: order.total_price || 0,
        brand: 'Loading...',
        category_type: 'Loading...'
      }];
    }

    return [{
      id: product.id,
      product_name: product.product_name,
      size_type: order.size_type || 'N/A',
      price: product.price,
      quantity: order.quantity || 1,
      total_price: order.total_price || (product.price * (order.quantity || 1)),
      brand: product.brand,
      category_type: product.category_type,
      imagePath: product.imagePath,
      description: product.description
    }];
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
                loading={loading || loadingProductDetails}
                onClick={handleRefreshOrders}
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
              scroll={{ x: 1200, y: 'calc(100vh - 350px)' }}
              pagination={{ pageSize: 10 }}
              bordered
              loading={loading}
            />
          </div>
        </Card>
      </div>

      <Modal
        title={`Order Details: ${selectedOrder?.orderId}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={900}
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
                dataSource={getOrderItems(selectedOrder)} 
                rowKey={(item, index) => item.id || index} 
                pagination={false}
                loading={productLoading}
              >
                <Table.Column 
                  title="Product" 
                  dataIndex="product_name" 
                  key="product"
                  render={(name, record) => (
                    <div>
                      <div><Text strong>{name}</Text></div>
                      <div><Text type="secondary">Brand: {record.brand}</Text></div>
                      <div><Text type="secondary">Category: {record.category_type}</Text></div>
                    </div>
                  )}
                />
                <Table.Column title="Size" dataIndex="size_type" key="size" />
                <Table.Column 
                  title="Unit Price" 
                  dataIndex="price" 
                  key="price" 
                  render={(price) => `Rp ${price?.toLocaleString('id-ID') || '0'}`}
                />
                <Table.Column title="Qty" dataIndex="quantity" key="quantity" />
                <Table.Column 
                  title="Total" 
                  dataIndex="total_price" 
                  key="total" 
                  render={(total) => `Rp ${total?.toLocaleString('id-ID') || '0'}`}
                />
              </Table>
            </div>

            <div className="order-totals">
              <div className="total-row">
                <Text>Subtotal:</Text>
                <Text>Rp {selectedOrder.total_price?.toLocaleString('id-ID') || '0'}</Text>
              </div>
              <div className="total-row">
                <Text>Shipping:</Text>
                <Text>Rp 25.000</Text>
              </div>
              <div className="total-row">
                <Text strong>Grand Total:</Text>
                <Text strong>{`Rp ${selectedOrder.total?.toLocaleString('id-ID')}`}</Text>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrder;