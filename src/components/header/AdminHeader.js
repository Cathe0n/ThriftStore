import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PoweroffOutlined, AppstoreOutlined, ShoppingCartOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Avatar, Modal } from 'antd';
import logo from '../../assets/Vero.png';
import './AdminHeader.css';

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const employeeName = "Admin User";
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const showLogoutConfirm = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/adminloginpage');
  };

  const handleCancel = () => {
    setIsLogoutModalOpen(false);
  };

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
          <div className="admin-user-dropdown">
            <Avatar 
              style={{ backgroundColor: '#f56a00', marginRight: '10px' }}
            >
              {employeeName.charAt(0)}
            </Avatar>
            <span className="admin-user-name">{employeeName}</span>
          </div>
          <Button 
            type="text" 
            icon={<PoweroffOutlined />} 
            onClick={showLogoutConfirm}
            className="admin-logout-btn"
          />
        </div>
      </div>

      <Modal
        title={
          <>
            <ExclamationCircleFilled style={{ color: '#faad14', marginRight: '8px' }} />
            Confirm Logout
          </>
        }
        open={isLogoutModalOpen}
        onOk={handleLogout}
        onCancel={handleCancel}
        okText="Logout"
        cancelText="Cancel"
        centered
      >
        <p>Are you sure you want to logout from the admin panel?</p>
      </Modal>
    </header>
  );
};

export default AdminHeader;