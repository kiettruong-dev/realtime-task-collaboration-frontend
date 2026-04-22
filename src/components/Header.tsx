import { Layout, Dropdown, Avatar, Space, Typography, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { removeAccessToken } from "@/utils/token";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = ({ email }: { email: string }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    removeAccessToken();

    message.success("Logged out");

    navigate("/login");
  };

  const items = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#fff",
        padding: "0 24px",
        borderBottom: "1px solid #f0f0f0",
        zIndex: 1000,
      }}
    >
      <Text strong>Task Manager</Text>

      <Dropdown menu={{ items }} placement="bottomRight">
        <Space style={{ cursor: "pointer" }}>
          <Avatar icon={<UserOutlined />} />
          <Text>{email}</Text>
        </Space>
      </Dropdown>
    </Header>
  );
};

export default AppHeader;
