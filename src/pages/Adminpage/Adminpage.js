import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Card } from 'antd';
import { EditOutlined, PlusOutlined, FilterOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminHeader from '../../components/header/AdminHeader'; // <-- Added import
import './Adminpage.css';

const { Option } = Select;

const AdminPage = () => {
  const [products, setProducts] = useState([
    {
      key: '1',
      type: 'Ladies',
      product: 'T-Shirt',
      name: 'T-Shirt',
      code: 'L-S-B0027',
      price: '6',
      stock: ['S-1', 'M-2', 'L-3', 'XL-0'],
    },
    {
      key: '2',
      type: 'Men',
      product: 'Polo Shirt',
      name: 'Classic Polo',
      code: 'M-P-C0012',
      price: '12',
      stock: ['S-3', 'M-5', 'L-2', 'XL-4'],
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      fixed: 'left',
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      width: 150,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: 'Product Code',
      dataIndex: 'code',
      key: 'code',
      width: 150,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (text) => `$${text}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => (
        <div className="stock-cell">
          {stock.map((item, index) => (
            <span key={index} className="stock-tag">{item}</span>
          ))}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <div className="table-actions">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button 
            type="link" 
            icon={<DeleteOutlined />} 
            danger
            onClick={() => handleDelete(record.key)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setEditingProduct(null);
    setIsModalVisible(true);
  };

  const handleEdit = (product) => {
    form.setFieldsValue({
      ...product,
      stockS: product.stock[0].split('-')[1],
      stockM: product.stock[1].split('-')[1],
      stockL: product.stock[2].split('-')[1],
      stockXL: product.stock[3].split('-')[1],
    });
    setEditingProduct(product);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this product?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setProducts(products.filter(item => item.key !== key));
        message.success('Product deleted successfully');
      },
    });
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const stock = [
        `S-${values.stockS}`,
        `M-${values.stockM}`,
        `L-${values.stockL}`,
        `XL-${values.stockXL}`
      ];

      const productData = {
        ...values,
        stock,
        key: editingProduct ? editingProduct.key : Date.now().toString(),
      };

      if (editingProduct) {
        setProducts(products.map(p => p.key === editingProduct.key ? productData : p));
        message.success('Product updated successfully');
      } else {
        setProducts([...products, productData]);
        message.success('Product added successfully');
      }

      setIsModalVisible(false);
    });
  };

  return (
    <div className="admin-dashboard-container">
      <AdminHeader /> {/* <-- Added AdminHeader component */}

      <div className="dashboard-content">
        <Card className="dashboard-header-card">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Product Management Dashboard</h1>
            <div className="action-buttons">
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAdd}
                size="large"
              >
                Add Product
              </Button>
              <Button 
                icon={<FilterOutlined />} 
                size="large"
              >
                Filters
              </Button>
            </div>
          </div>
        </Card>

        <Card className="products-card">
          <h2 className="section-title">
            <span>Current Products</span>
            <span className="product-count">{products.length} items</span>
          </h2>
          <div className="products-table-container">
            <Table
              className="products-table"
              columns={columns}
              dataSource={products}
              scroll={{ x: 1000, y: 'calc(100vh - 350px)' }}
              pagination={false}
              bordered
            />
          </div>
        </Card>
      </div>

      <Modal
        title={editingProduct ? "Edit Product" : "Add New Product"}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        okText={editingProduct ? "Update" : "Create"}
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <div className="form-grid">
            <Form.Item 
              name="type" 
              label="Category" 
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select placeholder="Select category">
                <Option value="Ladies">Ladies</Option>
                <Option value="Men">Men</Option>
                <Option value="Kids">Kids</Option>
              </Select>
            </Form.Item>

            <Form.Item 
              name="product" 
              label="Product Type" 
              rules={[{ required: true, message: 'Please input product type' }]}
            >
              <Input placeholder="e.g. T-Shirt, Jeans" />
            </Form.Item>

            <Form.Item 
              name="name" 
              label="Product Name" 
              rules={[{ required: true, message: 'Please input product name' }]}
            >
              <Input placeholder="e.g. Classic Cotton T-Shirt" />
            </Form.Item>

            <Form.Item 
              name="code" 
              label="Product Code" 
              rules={[{ required: true, message: 'Please input product code' }]}
            >
              <Input placeholder="e.g. L-S-B0027" />
            </Form.Item>

            <Form.Item 
              name="price" 
              label="Price ($)" 
              rules={[{ required: true, message: 'Please input price' }]}
            >
              <Input type="number" prefix="$" />
            </Form.Item>
          </div>

          <h3 className="stock-title">Inventory Levels</h3>
          <div className="stock-fields">
            <Form.Item 
              name="stockS" 
              label="Size S" 
              rules={[{ required: true, message: 'Please input quantity' }]}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item 
              name="stockM" 
              label="Size M" 
              rules={[{ required: true, message: 'Please input quantity' }]}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item 
              name="stockL" 
              label="Size L" 
              rules={[{ required: true, message: 'Please input quantity' }]}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item 
              name="stockXL" 
              label="Size XL" 
              rules={[{ required: true, message: 'Please input quantity' }]}
            >
              <Input type="number" min={0} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;
