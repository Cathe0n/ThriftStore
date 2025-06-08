import React, { useState, useEffect} from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Card,
  Typography,
  Badge,
  message,
} from "antd";
import { FilterOutlined, EyeOutlined, SyncOutlined } from "@ant-design/icons";
import "./UserTransaction.css";
import OrderDetail from "../../components/popups/orderdetail/OrderDetail";
import { useAuth } from "../../context/AuthContext";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { GET_ORDER_BY_CUSTOMER_ID } from "../../graphql/mutations";

const { Title, Text } = Typography;

const UserTransaction = () => {
  const { user } = useAuth();
  const { data, loading, error } = useQuery(GET_ORDER_BY_CUSTOMER_ID);
    const [orders, setOrders] = useState([]);

      useEffect(() => {
          if (data?.getOrderByCustomerId) {
            const formattedOrders = data.getOrderByCustomerId.map((order, index) => ({
              key: order.id || index,
              orderId: order.id || `ORD-${index + 1}`,
              date: order.order_date || order.created_at || new Date().toLocaleDateString('id-ID'),
              items: order.quantity || 1,
              location: order.location || 'No location provided',
              total: order.total_price || 0,
              status: order.status || 'Pending',
            
            }));
            setOrders(formattedOrders);
          }
        }, [data]);
  //   {
  //     key: "1",
  //     orderId: "ORD-2023-001",
  //     customer: "John Doe",
  //     date: "2023-10-15",
  //     items: 3,
  //     total: 4299000, // Rp 4,299,000
  //     status: "Processing",
  //     address: "123 Main St, New York, NY",
  //   }

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusColors = {
    Processing: "blue",
    Shipped: "geekblue",
    Delivered: "green",
    Pending: "orange",
    Cancelled: "red",
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      width: 150,
      fixed: "left",
    },
    
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      width: 100,
      render: (items) => `${items} items`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 120,
      render: (total) => `Rp ${total.toLocaleString("id-ID")}`,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    
    // {
    //   title: "Actions",
    //   key: "actions",
    //   width: 120,
    //   fixed: "right",
    //   render: (_, record) => (
    //     <Button
    //       type="link"
    //       icon={<EyeOutlined />}
    //       onClick={() => handleViewDetails(record)}
    //     >
    //       Details
    //     </Button>
    //   ),
    // },
  ];

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleUpdateStatus = () => {
    Modal.confirm({
      title: "Update Order Status",
      content: "Select the new status for this order:",
      okText: "Update",
      onOk() {
        message.success("Order status updated successfully");
        setIsModalVisible(false);
      },
    });
  };

  return (
    <div className="admin-dashboard-container">
      {!user ? (
        <p className="empty-message">
          Please log in to your account to view your Order Transactions.
        </p>
      ) : (
        <div className="dashboard-content">
          {/* <Modal
            title={`Order Details: ${selectedOrder?.orderId}`}
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            width={800}
            footer={[
              <Button key="back" onClick={() => setIsModalVisible(false)}>
                Close
              </Button>,
              <Button key="update" type="primary" onClick={handleUpdateStatus}>
                Update Status
              </Button>,
            ]}
          >
            {selectedOrder && <OrderDetail selectedOrder={selectedOrder} />}
          </Modal> */}

          <Card className="products-card">
            <div className="section-header">
              <h2 className="section-title">
                <span>Ongoing Orders</span>
              </h2>
            </div>
            <div className="products-table-container">
              <Table
                className="orders-table"
                columns={columns}
                dataSource={orders}
                scroll={{ x: 1000, y: "calc(100vh - 350px)" }}
                pagination={{ pageSize: 10 }}
                bordered
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserTransaction;
