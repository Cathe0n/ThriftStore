import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PoweroffOutlined, AppstoreOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Avatar, Dropdown, Menu } from 'antd';
import logo from '../../assets/Vero.png';
import './AdminHeader.css';

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const employeeName = "Admin User";

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/adminloginpage');
  };

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const menu = (
    <Menu>
      <Menu.Item key="/adminprofile">
        My Profile
      </Menu.Item>
      <Menu.Item key="/adminsettings">
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item 
        key="logout" 
        icon={<PoweroffOutlined />}
        onClick={handleLogout}
        danger
      >
        Log Out
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="admin-header">
      <div className="admin-header-content">
        <div className="admin-header-logo">
          <img src={logo} alt="VERO Admin" className="admin-logo" />
        </div>

        <div className="admin-nav-menu">
          <Button
            type={location.pathname === "/adminpage" ? "primary" : "text"}
            icon={<AppstoreOutlined />}
            onClick={() => navigate('/adminpage')}
            className="admin-nav-button"
          >
            Products
          </Button>
          <Button
            type={location.pathname === "/adminorder" ? "primary" : "text"}
            icon={<ShoppingCartOutlined />}
            onClick={() => navigate('/adminorder')}
            className="admin-nav-button"
          >
            Orders
          </Button>
        </div>

        <div className="admin-header-user">
          <Dropdown overlay={menu} placement="bottomRight">
            <div className="admin-user-dropdown">
              <Avatar 
                style={{ backgroundColor: '#f56a00', marginRight: '10px' }}
              >
                {employeeName.charAt(0)}
              </Avatar>
              <span className="admin-user-name">{employeeName}</span>
            </div>
          </Dropdown>
          <Button 
            type="text" 
            icon={<PoweroffOutlined />} 
            onClick={handleLogout}
            className="admin-logout-btn"
          />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
