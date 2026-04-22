import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AppHeader from "../components/Header";
import { useAuth } from "@/hooks";

const { Content } = Layout;

const MainLayout = () => {
  const { user } = useAuth();
  return (
    <Layout>
      <AppHeader email={user?.email} />

      <Content style={{ marginTop: 64, background: "#fff" }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default MainLayout;
