import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Table, Button, Modal, Form, Input, Select, InputNumber, message, Card } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined, FilterOutlined } from '@ant-design/icons';
import AdminHeader from '../../components/header/AdminHeader';
import './Adminpage.css';
import { GET_ALL_PRODUCTS } from '../../graphql/adminMutations';

const { Option } = Select;

const AdminPage = () => {
  // GraphQL stuff idk
  const { data, loading, error } = useQuery(GET_ALL_PRODUCTS);

  // states
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterText, setFilterText] = useState('');

  // Modal and form states for popup
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // idk
  useEffect(() => {
    if (data?.getAllProducts) {
      const formattedProducts = data.getAllProducts.map((p, index) => ({
        key: index.toString(),
        product_name: p.product_name,
        gender: p.gender,
        price: p.price,
        discount_rate: p.discount_rate,
        category_type: p.category_type,
        sold_amount: p.sold_amount,
        total_stock: p.Total_stock, // uhhhhhhhhhhhhhhhhhhhh
        imagePath: p.imagePath,
        brand: p.brand,
        description: p.description,
      }));
      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts); // filterung
    }
  }, [data]);

  // the search func filter thing idk how
  useEffect(() => {
    if (!filterText.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(p =>
        p.product_name.toLowerCase().includes(filterText.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [filterText, products]);

  const handleAdd = () => {
    form.resetFields();
    setEditingProduct(null);
    setIsModalVisible(true);
  };

  const handleEdit = (product) => {
    form.setFieldsValue({
      product_name: product.product_name,
      gender: product.gender,
      price: product.price,
      discount_rate: product.discount_rate,
      category_type: product.category_type,
      sold_amount: product.sold_amount,
      total_stock: product.total_stock,
      brand: product.brand,
      description: product.description,
      imagePath: product.imagePath,
    });
    setEditingProduct(product);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {  //delete idk how either me stoopid
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this product?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        const updatedProducts = products.filter(p => p.key !== key);
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        message.success('Product deleted successfully');
      },
    });
  };

  const handleSubmit = () => { //backend pls help
    form.validateFields().then(values => {
      const productData = {
        ...values,
        key: editingProduct ? editingProduct.key : Date.now().toString(),
      };

      let updatedProducts;
      if (editingProduct) {
        updatedProducts = products.map(p =>
          p.key === editingProduct.key ? productData : p
        );
        message.success('Product updated successfully');
      } else {
        updatedProducts = [...products, productData];
        message.success('Product added successfully');
      }

      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setIsModalVisible(false);
    });
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products: {error.message}</p>;

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category_type',
      key: 'category_type',
      width: 120,
      fixed: 'left',
    },
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
      width: 180,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      width: 120,
    },
    {
      title: 'Price ($)',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Discount Rate (%)',
      dataIndex: 'discount_rate',
      key: 'discount_rate',
      width: 140,
      render: (rate) => `${rate}%`,
    },
    {
      title: 'Total Stock',
      dataIndex: 'total_stock',
      key: 'total_stock',
      width: 110,
    },
    {
      title: 'Sold Amount',
      dataIndex: 'sold_amount',
      key: 'sold_amount',
      width: 110,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 160,
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

  return (
    <div className="admin-dashboard-container">
      <AdminHeader />

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
              <Input.Search
                placeholder="Search product by name"
                allowClear
                onChange={e => setFilterText(e.target.value)}
                style={{ width: 200, marginLeft: 16 }}
              />
              <Button 
                icon={<FilterOutlined />} 
                size="large"
                style={{ marginLeft: 8 }}
              >
                Filters
              </Button>
            </div>
          </div>
        </Card>

        <Card className="products-card">
          <h2 className="section-title">
            <span>Current Products</span>
            <span className="product-count">{filteredProducts.length} items</span>
          </h2>
          <div className="products-table-container">
            <Table
              className="products-table"
              columns={columns}
              dataSource={filteredProducts}
              scroll={{ x: 1300, y: 'calc(100vh - 350px)' }}
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
        width={800}
        okText={editingProduct ? "Update" : "Create"}
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="category_type" 
            label="Category" 
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Select category">
              <Option value="Ladies">Ladies</Option>
              <Option value="Men">Men</Option>
              <Option value="Kids">Kids</Option>
              {/*Trnsgender option when*/}
            </Select>
          </Form.Item>

          <Form.Item
            name="product_name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select gender' }]}
          >
            <Select placeholder="Select gender">
              <Option value="Female">Female</Option>
              <Option value="Male">Male</Option>
              <Option value="Unisex">Unisex</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="brand"
            label="Brand"
            rules={[{ required: false }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price (Rp)"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="discount_rate"
            label="Discount Rate (%)"
            rules={[{ required: true, message: 'Please enter discount rate' }]}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="total_stock"
            label="Total Stock"
            rules={[{ required: true, message: 'Please enter total stock' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="sold_amount"
            label="Sold Amount"
            rules={[{ required: true, message: 'Please enter sold amount' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="imagePath"
            label="Image URL"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;
