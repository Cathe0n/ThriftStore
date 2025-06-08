import React, { useState } from 'react';
import { Button, Modal, Checkbox, Space, Divider, InputNumber, Form, Row, Col } from 'antd';
import { FilterOutlined, CloseOutlined } from '@ant-design/icons';

const ProductFilter = ({ onFilterChange }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // These category names MUST MATCH the <Option value="..."> in AdminPage.js Form.Item for "category_type"
  const categoryOptions = [
    "Women's Tops", "Women's Sweaters & Hoodiess", "Women's Bottoms",
    "Women's Activewear", "Women's Dresses & Skirts", "Women's Outerwear",
    "Men's Tops", "Men's Sweaters & Hoodiess", 
    "Men's Bottoms", "Men's Activewear", "Men's Outerwear", "Men's Loungewear",
    "Kids Tops", "Kids Sweaters & Hoodies", "Kids Bottoms", // Corrected 'Hoodiess' to 'Hoodies' to match majority
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
    return count;
  };

  const handleApplyFilters = () => {
    form.validateFields().then(values => {
      const activeValues = {};
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
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleClearFilters = () => {
    form.resetFields();
    onFilterChange({});
    setActiveFilterCount(0);
    // setVisible(false); // Optional: close modal on clear
  };

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
        width={600} // Increased width for better layout of checkboxes
      >
        <Form form={form} layout="vertical" onValuesChange={onFormValuesChange}>
          <Divider orientation="left">Category</Divider>
          <Form.Item name="categories">
            <Checkbox.Group style={{ width: '100%' }}>
              <Row gutter={[8, 8]}> {/* Added gutter for spacing */}
                {categoryOptions.map(option => (
                  <Col xs={24} sm={12} md={8} key={option.value}> {/* Responsive columns */}
                    <Checkbox value={option.value}>{option.label}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Divider orientation="left">Gender</Divider>
          <Form.Item name="genders">
            <Checkbox.Group>
                <Row gutter={[8,8]}>
                    {genderOptions.map(option => (
                        <Col key={option.value}>
                            <Checkbox value={option.value}>{option.label}</Checkbox>
                        </Col>
                    ))}
                </Row>
            </Checkbox.Group>
          </Form.Item>

          <Divider orientation="left">Price Range ($)</Divider>
          <Space align="baseline">
            <Form.Item name="minPrice">
              <InputNumber placeholder="Min Price" min={0} style={{width: "120px"}} precision={2} />
            </Form.Item>
            <span>-</span>
            <Form.Item name="maxPrice">
              <InputNumber placeholder="Max Price" min={0} style={{width: "120px"}} precision={2}/>
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default ProductFilter;