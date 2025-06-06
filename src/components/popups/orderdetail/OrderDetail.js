import React from "react";
import { Typography, Tag, Table } from "antd";
import "./OrderDetail.css"; 

const { Title, Text } = Typography;

const OrderDetail = ({ selectedOrder }) => {
  const statusColors = {
    Processing: "blue",
    Shipped: "orange",
    Delivered: "green",
    Cancelled: "red",
  };

  const product = [
    {
      id: 1,
      product: "Cotton T-Shirt",
      size: "M",
      price: 149900,
      quantity: 2,
      total: 299800,
    },
    {
      id: 2,
      product: "Classic Jeans",
      size: "32",
      price: 299900,
      quantity: 1,
      total: 299900,
    },
  ];

  return (
    <div className="order-details">
      <div className="order-section">
        <Title level={4} className="section-title">
          Customer Information
        </Title>
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
            <Tag
              color={statusColors[selectedOrder.status]}
              style={{ marginLeft: 8 }}
            >
              {selectedOrder.status}
            </Tag>
          </div>
        </div>
      </div>

      <div className="order-section">
        <Title level={4} className="section-title">
          Order Items
        </Title>
        <Table
                        dataSource={product}
                        pagination={false}
                        rowKey="id"
                      >
        
          <Table.Column title="Product" dataIndex="product" key="product" />
          <Table.Column title="Size" dataIndex="size" key="size" />
          <Table.Column
            title="Price"
            dataIndex="price"
            key="price"
            render={(price) => `Rp ${price.toLocaleString("id-ID")}`}
          />
          <Table.Column title="Qty" dataIndex="quantity" key="quantity" />
          <Table.Column
            title="Total"
            dataIndex="total"
            key="total"
            render={(total) => `Rp ${total.toLocaleString("id-ID")}`}
          />
        
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
          <Text strong>{`Rp ${selectedOrder.total.toLocaleString(
            "id-ID"
          )}`}</Text>
        </div>
      </div>
    </div>
  );
};
export default OrderDetail;
