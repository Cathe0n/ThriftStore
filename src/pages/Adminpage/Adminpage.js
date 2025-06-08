import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from "@apollo/client";
import { Table, Button, Modal, Form, Input, Select, InputNumber, message, Card } from 'antd';
import { EditOutlined, PlusOutlined, FilterOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminHeader from '../../components/header/AdminHeader';
import './Adminpage.css';
import { ADMIN_LOGIN_MUTATION, GET_ALL_PRODUCTS } from '../../graphql/adminMutations';
import { ADMIN_CREATE_PRODUCT } from '../../graphql/adminMutations';
import { ADMIN_UPDATE_PRODUCT } from '../../graphql/adminMutations';
import { ADMIN_DELETE_PRODUCT } from '../../graphql/adminMutations';
import { ADMIN_ADD_SIZE } from '../../graphql/adminMutations';
import { ADMIN_UPDATE_SIZE_STOCK } from '../../graphql/adminMutations';
// import OrderFilter from './OrderFilter'; // Keep if you still need it elsewhere
import ProductFilter from './ProductFilter'; // Import the new ProductFilter
import { Row, Col } from 'antd'


const { Option } = Select;

const AdminPage = () => {
  const { data, loading, error: queryError } = useQuery(GET_ALL_PRODUCTS); // Renamed error to avoid conflict
  const [createProduct, { loading: loadingCreate }] = useMutation(ADMIN_CREATE_PRODUCT, {
    refetchQueries: [{ query: GET_ALL_PRODUCTS }],
    awaitRefetchQueries: true,
  });
  const [updateProduct, { loading: loadingUpdate }] = useMutation(ADMIN_UPDATE_PRODUCT, {
    refetchQueries: [{ query: GET_ALL_PRODUCTS }],
    awaitRefetchQueries: true,
  });
  const [deleteProduct, { loading: loadingDelete }] = useMutation(ADMIN_DELETE_PRODUCT, {
    refetchQueries: [{ query: GET_ALL_PRODUCTS }],
    awaitRefetchQueries: true,
  });
  const [addSize] = useMutation(ADMIN_ADD_SIZE, {
    refetchQueries: [{ query: GET_ALL_PRODUCTS }],
    awaitRefetchQueries: true,
  });
  const [updateSizeStock] = useMutation(ADMIN_UPDATE_SIZE_STOCK, {
    refetchQueries: [{ query: GET_ALL_PRODUCTS }],
    awaitRefetchQueries: true,
  });
  
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isAddSizeModalVisible, setIsAddSizeModalVisible] = useState(false);
  const [isUpdateSizeModalVisible, setIsUpdateSizeModalVisible] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [form] = Form.useForm();
  const [sizeForm] = Form.useForm();

  // State for active product filters
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    if (data?.getAllProducts) {
      let formattedProducts = data.getAllProducts.map((p) => ({ // Removed index as it's not used
        key: p.id,
        product_id: p.id,
        product_name: p.product_name,
        gender: p.gender,
        price: p.price,
        discount_rate: p.discount_rate,
        category_type: p.category_type,
        sold_amount: p.sold_amount,
        total_stock: p.Total_stock, // Assuming backend field is Total_stock
        imagePath: p.imagePath,
        brand: p.brand,
        description: p.description,
      }));

      // Apply filters if any are active
      if (Object.keys(activeFilters).length > 0) {
        const { categories, genders, minPrice, maxPrice } = activeFilters;

        formattedProducts = formattedProducts.filter(product => {
          let isMatch = true;

          // Category filter
          if (categories && categories.length > 0) {
            isMatch = isMatch && categories.includes(product.category_type);
          }

          // Gender filter
          if (genders && genders.length > 0) {
            // Ensure case-insensitivity or consistent casing in data
            isMatch = isMatch && genders.includes(product.gender.toLowerCase()); 
          }

          // Price filter
          if (minPrice !== undefined && minPrice !== null && typeof minPrice === 'number') {
            isMatch = isMatch && product.price >= minPrice;
          }
          if (maxPrice !== undefined && maxPrice !== null && typeof maxPrice === 'number') {
            isMatch = isMatch && product.price <= maxPrice;
          }
          
          return isMatch;
        });
      }
      setProducts(formattedProducts);
    } else {
      setProducts([]); // Clear products if no data or data.getAllProducts is null/undefined
    }
  }, [data, activeFilters]); // Re-run when data or activeFilters change

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
      render: (price) => `$${price.toFixed(0)}`,
      sorter: (a, b) => a.price - b.price, // Optional: add sorting
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
      sorter: (a, b) => a.total_stock - b.total_stock, // Optional: add sorting
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
      width: 260,
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
            onClick={() => handleDelete(record.product_id)}
            // loading={loadingDelete} // Consider moving loading state to specific delete button if needed
          >
            Delete
          </Button>
          <Button 
            type="link" 
            onClick={() => handleAddSize(record.product_id)}
            style={{ color: '#1890ff' }}
          >
            Add Size
          </Button>
          <Button 
            type="link" 
            onClick={() => handleUpdateSizeStock(record.product_id)}
            style={{ color: '#52c41a' }}
          >
            Update Stock
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
      ...product, // Spread the product to fill form
      // price and discount_rate are already numbers
    });
    setEditingProduct(product);
    setIsModalVisible(true);
  };

  const handleDelete = (product_id) => {
    setProductToDelete(product_id);
    setIsDeleteModalVisible(true);
  };

  const handleAddSize = (productId) => {
    setCurrentProductId(productId);
    sizeForm.resetFields();
    setIsAddSizeModalVisible(true);
  };

  const handleUpdateSizeStock = (productId) => {
    setCurrentProductId(productId);
    sizeForm.resetFields();
    setIsUpdateSizeModalVisible(true);
  };

  const handleSubmit = () => {
    form.validateFields().then(async values => {
      try {
        const productInput = {
          product_name: values.product_name,
          gender: values.gender,
          price: parseFloat(values.price),
          discount_rate: parseFloat(values.discount_rate),
          category_type: values.category_type,
          imagePath: values.imagePath || '',
          brand: values.brand,
          description: values.description,
          // total_stock and sold_amount are usually managed by sizes or other logic
          // For create, total_stock might be needed, or derived from initial sizes.
          // For update, total_stock is often a calculated field.
          // The mutations ADMIN_CREATE_PRODUCT and ADMIN_UPDATE_PRODUCT will determine required fields.
          // Assuming total_stock is part of product details for now as per form:
          total_stock: parseInt(values.total_stock, 10), 
          sold_amount: values.sold_amount ? parseInt(values.sold_amount, 10) : 0,
        };

        if (editingProduct) {
          await updateProduct({
            variables: {
              product_id: editingProduct.product_id,
              ...productInput
            }
          });
          message.success('Product updated successfully');
        } else {
          await createProduct({
            variables: productInput // Pass the whole object
          });
          message.success('Product added successfully');
        }

        setIsModalVisible(false);
        form.resetFields();
      } catch (err) {
        message.error(`Failed to save product: ${err.message}`);
      }
    });
  };

  const handleAddSizeSubmit = async () => {
    try {
      const values = await sizeForm.validateFields();
      await addSize({
        variables: {
          product_id: currentProductId,
          size_type: values.size_type,
          stock_amount: parseInt(values.stock_amount, 10)
        }
      });
      message.success('Size added successfully');
      setIsAddSizeModalVisible(false);
    } catch (err) {
      message.error(`Failed to add size: ${err.message}`);
    }
  };

  const handleUpdateSizeStockSubmit = async () => {
    try {
      const values = await sizeForm.validateFields();
      await updateSizeStock({
        variables: {
          product_id: currentProductId,
          size_type: values.size_type,
          stock_amount: parseInt(values.stock_amount, 10)
        }
      });
      message.success('Size stock updated successfully');
      setIsUpdateSizeModalVisible(false);
    } catch (err) {
      message.error(`Failed to update size stock: ${err.message}`);
    }
  };

  // Callback for ProductFilter component
  const handleProductFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  if (loading) return <p>Loading products...</p>;
  if (queryError) return <p>Error loading products: ${queryError.message}</p>;

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
                loading={loadingCreate}
              >
                Add Product
              </Button>
              {/* Replace old Filter button with ProductFilter component */}
              <ProductFilter onFilterChange={handleProductFilterChange} />
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
              scroll={{ x: 1500, y: 'calc(100vh - 400px)' }} // Adjusted y scroll slightly
              pagination={{ pageSize: 15, showSizeChanger: true, pageSizeOptions: ['15', '30', '50'] }} // Added pagination
              bordered
              loading={loading || loadingCreate || loadingUpdate || loadingDelete} // More comprehensive loading
            />
          </div>
        </Card>
      </div>

      {/* Delete Product Modal */}
      <Modal
        title="Confirm Delete"
        visible={isDeleteModalVisible}
        onOk={async () => {
          if (!productToDelete) return;
          try {
            await deleteProduct({ variables: { product_id: productToDelete } });
            message.success('Product deleted successfully');
            setProductToDelete(null); // Reset
          } catch (err) {
            message.error(`Failed to delete product: ${err.message}`);
          } finally {
            setIsDeleteModalVisible(false);
          }
        }}
        onCancel={() => {
            setIsDeleteModalVisible(false);
            setProductToDelete(null); // Reset
        }}
        okButtonProps={{ danger: true, loading: loadingDelete }}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this product? This action cannot be undone.</p>
      </Modal>

      {/* Add/Edit Product Modal */}
      <Modal
        title={editingProduct ? "Edit Product" : "Add New Product"}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        okText={editingProduct ? "Update" : "Create"}
        cancelText="Cancel"
        confirmLoading={loadingCreate || loadingUpdate}
        destroyOnClose // To reset form state when modal is closed
      >
        <Form form={form} layout="vertical" initialValues={{ discount_rate: 0, sold_amount: 0 }}>
          <Form.Item 
            name="category_type" 
            label="Category" 
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            {/* Corrected category names for consistency */}
            <Select placeholder="Select category">
              <Option value="Women's Tops">Women's Tops</Option>
              <Option value="Women's Sweaters & Hoodies">Women's Sweaters & Hoodies</Option>
              <Option value="Women's Bottoms">Women's Bottoms</Option>
              <Option value="Women's Activewear">Women's Activewear</Option>
              <Option value="Women's Dresses & Skirts">Women's Dresses & Skirts</Option>
              <Option value="Women's Outerwear">Women's Outerwear</Option>

              <Option value="Men's Tops">Men's Tops</Option>
              <Option value="Men's Sweaters & Hoodies">Men's Sweaters & Hoodies</Option>
              <Option value="Men's Bottoms">Men's Bottoms</Option>
              <Option value="Men's Activewear">Men's Activewear</Option>
              <Option value="Men's Outerwear">Men's Outerwear</Option>
              <Option value="Men's Loungewear">Men's Loungewear</Option>
              
              <Option value="Kids Tops">Kids Tops</Option>
              <Option value="Kids Sweaters & Hoodies">Kids Sweaters & Hoodies</Option>
              <Option value="Kids Bottoms">Kids Bottoms</Option>
              <Option value="Kids Activewear">Kids Activewear</Option>
              <Option value="Kids Outerwear">Kids Outerwear</Option>
              <Option value="Kids Loungewear & Pajamas">Kids Loungewear & Pajamas</Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="product_name" 
            label="Product Name" 
            rules={[{ required: true, message: 'Please input product name' }]}
          >
            <Input placeholder="e.g. Classic Cotton T-Shirt" />
          </Form.Item>

          <Form.Item 
            name="gender" 
            label="Gender" 
            rules={[{ required: true, message: 'Please select gender' }]}
          >
            <Select placeholder="Select gender">
              <Option value="female">Female</Option>
              <Option value="male">Male</Option>
              <Option value="unisex">Unisex</Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="brand" 
            label="Brand" 
            rules={[{ required: true, message: 'Please input brand' }]}
          >
            <Input placeholder="Brand name" />
          </Form.Item>

          <Form.Item 
            name="price" 
            label="Price ($)" 
            rules={[{ required: true, message: 'Please input price' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} prefix="$" precision={2} />
          </Form.Item>

          <Form.Item 
            name="discount_rate" 
            label="Discount Rate (%)" 
            rules={[{ required: true, message: 'Please input discount rate (0-100)' }]}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} formatter={value => `${value}%`} parser={value => value.replace('%', '')} />
          </Form.Item>

          <Form.Item 
            name="total_stock" 
            label="Total Stock (calculated from sizes)" 
            rules={[{ required: true, message: 'Please input total stock' }]}
            // This field might be better as read-only if it's derived from individual sizes.
            // Or, if it's set manually at product creation and then updated by size changes.
            // For now, keeping it editable as per original code.
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item 
            name="sold_amount" 
            label="Sold Amount (updated automatically)" 
            rules={[{ required: false }]} // Usually not directly editable
            initialValue={0}
          >
            <InputNumber min={0} style={{ width: '100%' }} disabled={!editingProduct} /> 
            {/* Disable for new products, potentially enable for edits if admin needs to adjust */}
          </Form.Item>

          <Form.Item 
            name="description" 
            label="Description" 
            rules={[{ required: false }]}
          >
            <Input.TextArea rows={3} placeholder="Product description" />
          </Form.Item>

          <Form.Item 
            name="imagePath" 
            label="Image Path" 
            rules={[{ required: false }]} // Make required if image is mandatory
          >
            <Input placeholder="URL or file path" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Size Modal */}
      <Modal
        title="Add Size"
        visible={isAddSizeModalVisible}
        onOk={handleAddSizeSubmit}
        onCancel={() => setIsAddSizeModalVisible(false)}
        okText="Add"
        cancelText="Cancel"
        destroyOnClose
      >
        <Form form={sizeForm} layout="vertical">
          <Form.Item 
            name="size_type" 
            label="Size Type" 
            rules={[{ required: true, message: 'Please select size type' }]}
          >
            <Select placeholder="Select size">
              <Option value="XS">XS</Option>
              <Option value="S">S</Option>
              <Option value="M">M</Option>
              <Option value="L">L</Option>
              <Option value="XL">XL</Option>
              <Option value="XXL">XXL</Option>
              <Option value="XXXL">XXXL</Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="stock_amount" 
            label="Stock Amount" 
            rules={[{ required: true, message: 'Please input stock amount' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Update Size Stock Modal */}
      <Modal
        title="Update Size Stock"
        visible={isUpdateSizeModalVisible}
        onOk={handleUpdateSizeStockSubmit}
        onCancel={() => setIsUpdateSizeModalVisible(false)}
        okText="Update"
        cancelText="Cancel"
        destroyOnClose
      >
        <Form form={sizeForm} layout="vertical">
          <Form.Item 
            name="size_type" 
            label="Size Type" 
            rules={[{ required: true, message: 'Please select size type' }]}
          >
            <Select placeholder="Select size">
              <Option value="XS">XS</Option>
              <Option value="S">S</Option>
              <Option value="M">M</Option>
              <Option value="L">L</Option>
              <Option value="XL">XL</Option>
              <Option value="XXL">XXL</Option>
              <Option value="XXXL">XXXL</Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="stock_amount" 
            label="New Stock Amount" 
            rules={[{ required: true, message: 'Please input stock amount' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;