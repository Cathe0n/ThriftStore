import React, { useState, useEffect } from 'react';
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Table, Button, Modal, Form, Input, Select, InputNumber, message, Card, Tag, Popover } from 'antd';
import { EditOutlined, PlusOutlined, FilterOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminHeader from '../../components/header/AdminHeader';
import './Adminpage.css';
import { ADMIN_LOGIN_MUTATION, GET_ALL_PRODUCTS } from '../../graphql/adminMutations';
import { ADMIN_CREATE_PRODUCT } from '../../graphql/adminMutations';
import { ADMIN_UPDATE_PRODUCT } from '../../graphql/adminMutations';
import { ADMIN_DELETE_PRODUCT } from '../../graphql/adminMutations';
import { ADMIN_ADD_SIZE } from '../../graphql/adminMutations';
import { ADMIN_UPDATE_SIZE_STOCK } from '../../graphql/adminMutations';
import { ADMIN_VIEW_SIZES_BY_PRODUCT_ID } from '../../graphql/adminMutations';
import ProductFilter from './ProductFilter';

const { Option } = Select;

const AdminPage = () => {
  const { data, loading, error } = useQuery(GET_ALL_PRODUCTS);
  const [getProductSizes] = useLazyQuery(ADMIN_VIEW_SIZES_BY_PRODUCT_ID)
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
    refetchQueries: [{ query: GET_ALL_PRODUCTS }], // Consider refetching sizes too or updating local state
    awaitRefetchQueries: true,
  });
  const [updateSizeStock] = useMutation(ADMIN_UPDATE_SIZE_STOCK, {
    refetchQueries: [{ query: GET_ALL_PRODUCTS }], // Consider refetching sizes too or updating local state
    awaitRefetchQueries: true,
  });

  const [products, setProducts] = useState([]);
  const [productSizes, setProductSizes] = useState({}); // Changed to object for easier lookup
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isAddSizeModalVisible, setIsAddSizeModalVisible] = useState(false);
  const [isUpdateSizeModalVisible, setIsUpdateSizeModalVisible] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [form] = Form.useForm();
  const [sizeForm] = Form.useForm();

  const fetchAllProductSizes = async (productIds) => {
    const sizesData = { ...productSizes }; // Preserve existing sizes if needed, or start fresh: const sizesData = {};

    for (const productId of productIds) {
      // Optional: Avoid re-fetching if sizes for this product are already loaded
      // if (sizesData[productId]) continue;

      try {
        const { data: sizeDataResponse } = await getProductSizes({
          variables: { product_id: productId }
        });

        if (sizeDataResponse?.getProductsizes) {
          sizesData[productId] = sizeDataResponse.getProductsizes;
        } else {
          sizesData[productId] = []; // Ensure there's an entry even if no sizes
        }
      } catch (error) {
        console.error(`Error fetching sizes for product ${productId}:`, error);
        sizesData[productId] = []; // Default to empty array on error
      }
    }
    setProductSizes(sizesData);
  };

  const [activeProductFilters, setActiveProductFilters] = useState({});

  useEffect(() => {
    if (data?.getAllProducts) {
      let formattedProducts = data.getAllProducts.map((p) => ({
        key: p.id,
        product_id: p.id,
        product_name: p.product_name,
        gender: p.gender,
        price: p.price,
        discount_rate: p.discount_rate,
        category_type: p.category_type,
        sold_amount: p.sold_amount,
        total_stock: p.Total_stock,
        imagePath: p.imagePath,
        brand: p.brand,
        description: p.description,
      }));

      if (Object.keys(activeProductFilters).length > 0) {
        const { categories, genders, minPrice, maxPrice } = activeProductFilters;

        formattedProducts = formattedProducts.filter(product => {
          let categoryMatch = true;
          let genderMatch = true;
          let priceMatch = true;

          if (categories && categories.length > 0) {
            categoryMatch = categories.includes(product.category_type);
          }
          if (genders && genders.length > 0) {
            genderMatch = genders.includes(product.gender);
          }
          if (minPrice !== undefined && minPrice !== null) {
            if (product.price < minPrice) priceMatch = false;
          }
          if (maxPrice !== undefined && maxPrice !== null) {
            if (product.price > maxPrice) priceMatch = false;
          }
          return categoryMatch && genderMatch && priceMatch;
        });
      }
      setProducts(formattedProducts);
      const productIds = formattedProducts.map(p => p.product_id);
      if (productIds.length > 0) {
        fetchAllProductSizes(productIds);
      }
    } else {
        setProducts([]);
        setProductSizes({}); // Clear sizes when products are cleared
    };
  }, [data, activeProductFilters]); // Removed getProductSizes from deps as it's stable

  const SizesDisplay = ({ productId }) => {
    const sizes = productSizes[productId] || [];

    if (!productId || sizes.length === 0) { // Added check for productId
      return <Tag color="default">No sizes</Tag>;
    }

    const content = (
      <div style={{ maxWidth: '200px' }}>
        {sizes.map((size, index) => (
          <div key={`${size.size_type}-${index}`} style={{ marginBottom: '4px' }}> {/* Improved key */}
            <Tag color="blue">{size.size_type}</Tag>
            <span>Stock: {size.stock_amount}</span>
          </div>
        ))}
      </div>
    );

    return (
      <Popover content={content} title="Available Sizes" trigger="hover">
        <div style={{ cursor: 'pointer' }}>
          {sizes.slice(0, 3).map((size, index) => (
            <Tag key={`${size.size_type}-preview-${index}`} color="blue" style={{ marginBottom: '2px' }}> {/* Improved key */}
              {size.size_type}
            </Tag>
          ))}
          {sizes.length > 3 && (
            <Tag color="default">+{sizes.length - 3} more</Tag>
          )}
        </div>
      </Popover>
    );
  }

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
    // ***** CORRECTED COLUMN DEFINITION *****
    {
      title: 'Available Sizes',
      key: 'available_sizes', // Unique key for the column
      width: 150,
      render: (_, record) => ( // Use implicit return and correct property name
        <SizesDisplay productId={record.product_id} />
      )
    },
    // ***** END OF CORRECTION *****
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
            loading={loadingDelete && productToDelete === record.product_id} // More specific loading
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
      product_name: product.product_name,
      gender: product.gender,
      price: product.price,
      discount_rate: product.discount_rate,
      category_type: product.category_type,
      sold_amount: product.sold_amount,
      total_stock: product.total_stock, // Ensure this is what you intend to edit
      brand: product.brand,
      description: product.description,
      imagePath: product.imagePath,
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
    sizeForm.resetFields(); // Good to reset, but you might want to pre-fill if user is updating a specific existing size
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
            // total_stock: parseInt(values.total_stock) // If your mutation accepts total_stock
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
            variables: productInput // Ensure your createProduct mutation variables match these fields
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
      // Manually update productSizes state or refetch for the specific product
      fetchAllProductSizes([currentProductId]); // Refetch sizes for the updated product
      setIsAddSizeModalVisible(false);
      sizeForm.resetFields();
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
      // Manually update productSizes state or refetch for the specific product
      fetchAllProductSizes([currentProductId]); // Refetch sizes for the updated product
      setIsUpdateSizeModalVisible(false);
      sizeForm.resetFields();
    } catch (err) {
      message.error(`Failed to update size stock: ${err.message}`);
    }
  };

  const handleProductFilterChange = (filters) => {
    setActiveProductFilters(filters);
  };

  if (loading && !data) return <p>Loading products...</p>; // Show loading only if no data yet
  if (error) return <p>Error loading products: ${error.message}</p>;

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
              scroll={{ x: 1500, y: 'calc(100vh - 350px)' }}
              pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'] }} // Added pagination
              bordered
              loading={loading || loadingDelete} // Table loading for initial fetch or delete
            />
          </div>
        </Card>
      </div>

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
            setProductToDelete(null); // Reset on cancel
        }}
        okType="danger"
        okText="Delete"
        cancelText="Cancel"
        confirmLoading={loadingDelete} // Modal confirm button loading
        okButtonProps={{
          danger: true,
          type: 'primary',
        }}
      >
        <p>Are you sure you want to delete this product? This action cannot be undone.</p>
      </Modal>


      <Modal
        title={editingProduct ? "Edit Product" : "Add New Product"}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
            setIsModalVisible(false);
            form.resetFields(); // Reset form on cancel
        }}
        width={800}
        okText={editingProduct ? "Update" : "Create"}
        cancelText="Cancel"
        confirmLoading={loadingCreate || loadingUpdate}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="category_type"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Select category">
              <Option value="Women's Tops">Women's Tops</Option>
              <Option value="Women's Sweaters & Hoodiess">Women's Sweaters & Hoodiess</Option>
              <Option value="Women's Bottoms">Women's Bottoms</Option>
              <Option value="Women's Activewear">Women's Activewear</Option>
              <Option value="Women's Dresses & Skirts">Women's Dresses & Skirts</Option>
              <Option value="Women's Outerwear">Women's Outerwear</Option>
              <Option value="Men's Tops">Men's Tops</Option>
              <Option value="Men's Sweaters & Hoodiess">Men's Sweaters & Hoodiess</Option>
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
            label="Total Stock (auto-calculated from sizes)"
            rules={[{ required: false }]} // Should ideally be read-only or not in form if auto-calc
          >
            <InputNumber min={0} style={{ width: '100%' }} disabled={true} /> 
            {/* Consider disabling if it's auto-calculated or removing it from this form */}
          </Form.Item>
          <Form.Item
            name="sold_amount"
            label="Sold Amount (auto-updated)"
            rules={[{ required: false }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} disabled={true}/>
             {/* Consider disabling as this is usually a tracked metric */}
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
            rules={[{ required: false, type: 'url', message: 'Please enter a valid URL' }]}
          >
            <Input placeholder="URL or file path" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Size"
        visible={isAddSizeModalVisible}
        onOk={handleAddSizeSubmit}
        onCancel={() => {
            setIsAddSizeModalVisible(false);
            sizeForm.resetFields();
        }}
        okText="Add"
        cancelText="Cancel"
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

      <Modal
        title="Update Size Stock"
        visible={isUpdateSizeModalVisible}
        onOk={handleUpdateSizeStockSubmit}
        onCancel={() => {
            setIsUpdateSizeModalVisible(false);
            sizeForm.resetFields();
        }}
        okText="Update"
        cancelText="Cancel"
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