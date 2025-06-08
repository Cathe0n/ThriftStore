import React, { useState, useEffect } from 'react';
import { Button, Modal, Checkbox, Space, Divider, InputNumber, Form } from 'antd';
import { FilterOutlined, CloseOutlined } from '@ant-design/icons';

const ProductFilter = ({ onFilterChange }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Define options for filters
  // Ensure these category names match exactly with what's used in AdminPage product form and data
  const categoryOptions = [
    "Women's Tops", "Women's Sweaters & Hoodies", "Women's Bottoms",
    "Women's Activewear", "Women's Dresses & Skirts", "Women's Outerwear",
    "Men's Tops", "Men's Sweaters & Hoodies", 
    "Men's Bottoms", "Men's Activewear", "Men's Outerwear", "Men's Loungewear",
    "Kids Tops", "Kids Sweaters & Hoodies", "Kids Bottoms",
    "Kids Activewear", "Kids Outerwear", "Kids Loungewear & Pajamas"
  ].map(cat => ({ label: cat, value: cat }));

  const genderOptions = [
    { label: 'Female', value: 'female' },
    { label: 'Male', value: 'male' },
    { label: 'Unisex', value: 'unisex' },
  ];

  const countSetFields = (values) => {
    let count = 0;
    if (values.categories && values.categories.length > 0) count++;
    if (values.genders && values.genders.length > 0) count++;
    if ((values.minPrice !== undefined && values.minPrice !== null && values.minPrice !== '') || 
        (values.maxPrice !== undefined && values.maxPrice !== null && values.maxPrice !== '')) count++;
    // Add more conditions if other filters are added
    return count;
  };

  const handleApplyFilters = () => {
    form.validateFields().then(values => {
      const activeValues = {};
      // Clean up empty/undefined values before passing
      if (values.categories && values.categories.length > 0) {
        activeValues.categories = values.categories;
      }
      if (values.genders && values.genders.length > 0) {
        activeValues.genders = values.genders;
      }
      if (values.minPrice !== undefined && values.minPrice !== null && values.minPrice !== '') {
        activeValues.minPrice = parseFloat(values.minPrice);
      }
      if (values.maxPrice !== undefined && values.maxPrice !== null && values.maxPrice !== '') {
        activeValues.maxPrice = parseFloat(values.maxPrice);
      }
      
      onFilterChange(activeValues);
      setActiveFilterCount(countSetFields(activeValues));
      setVisible(false);
    });
  };

  const handleClearFilters = () => {
    form.resetFields();
    onFilterChange({}); // Pass empty object to signify all filters cleared
    setActiveFilterCount(0);
    // setVisible(false); // Optional: close modal on clear
  };

  // Update badge count when form values change inside the modal
  const onFormValuesChange = () => {
    const currentFormValues = form.getFieldsValue();
    setActiveFilterCount(countSetFields(currentFormValues));
  };


  return (
    <>
      <Button
        icon={<FilterOutlined />}
        onClick={() => setVisible(true)}
        size="large"
      >
        Filters
        {activeFilterCount > 0 && (
          <span 
            className="filter-badge" 
            style={{ 
              marginLeft: '8px', 
              backgroundColor: '#1890ff', 
              color: 'white', 
              borderRadius: '10px', 
              padding: '0px 7px',
              fontSize: '0.9em'
            }}
          >
            {activeFilterCount}
          </span>
        )}
      </Button>

      <Modal
        title="Filter Products"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="clear" onClick={handleClearFilters} icon={<CloseOutlined />}>
            Clear All
          </Button>,
          <Button key="apply" type="primary" onClick={handleApplyFilters}>
            Apply Filters
          </Button>,
        ]}
        width={600}
      >
        <Form form={form} layout="vertical" onValuesChange={onFormValuesChange}>
          <Divider orientation="left">Category</Divider>
          <Form.Item name="categories">
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                {categoryOptions.map(option => (
                  <Col span={8} key={option.value}>
                    <Checkbox value={option.value}>{option.label}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Divider orientation="left">Gender</Divider>
          <Form.Item name="genders">
            <Checkbox.Group options={genderOptions} />
          </Form.Item>

          <Divider orientation="left">Price Range</Divider>
          <Space align="baseline">
            <Form.Item name="minPrice">
              <InputNumber placeholder="Min Price" prefix="$" min={0} style={{width: "120px"}} />
            </Form.Item>
            <span>-</span>
            <Form.Item name="maxPrice">
              <InputNumber placeholder="Max Price" prefix="$" min={0} style={{width: "120px"}}/>
            </Form.Item>
          </Space>
          {/* Future filter sections can be added here (e.g., Brand, Stock Range) */}
        </Form>
      </Modal>
    </>
  );
};
// Add Row and Col import if not already globally available via antd
// For Checkbox.Group layout:
import { Row, Col } from 'antd'; // Add this at the top of ProductFilter.js if not there

export default ProductFilter;